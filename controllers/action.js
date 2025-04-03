const Payment = require("../models/payment");
const Registration = require("../models/registration");
const Verification = require('../models/verification');
const Account = require("../models/account");
const express = require('express');

function splitMessage(message) {
    try {
        // Define regular expressions to extract different parts of the message
        const confirmationRegex = /([A-Z0-9]+) Confirmed/;
        const amountRegex = /Ksh([\d.]+) sent to ([A-Z\s]+) for account (\d+) on (\d+\/\d+\/\d+ at \d+:\d+ [APM]+)\s+/;
        const balanceRegex = /New M-PESA balance is Ksh([\d.]+)\. Transaction cost, Ksh([\d.]+)\./;
        const transactRegex = /Amount you can transact within the day is ([\d,.]+)\./;

        // Extract the parts of the message using the regular expressions
        const confirmationMatch = message.match(confirmationRegex);
        const amountMatch = message.match(amountRegex);
        const balanceMatch = message.match(balanceRegex);
        const transactMatch = message.match(transactRegex);

        // Create an object to store the distinct parts
        const distinctParts = {
            confirmationCode: confirmationMatch ? confirmationMatch[1] : null,
            amount: amountMatch ? parseFloat(amountMatch[1]) : null,
            recipient: amountMatch ? amountMatch[2] : null,
            accountNumber: amountMatch ? amountMatch[3] : null,
            dateTime: amountMatch ? amountMatch[4] : null,
            balance: balanceMatch ? parseFloat(balanceMatch[1]) : null,
            transactionCost: balanceMatch ? parseFloat(balanceMatch[2]) : null,
            transactAmount: transactMatch ? parseFloat(transactMatch[1].replace(/,/g, '')) : null,
        };

        const dateTimeParts = distinctParts.dateTime.match(/(\d+\/\d+\/\d+) at (\d+:\d+ [APM]+)/);

        if (dateTimeParts) {
            const [day, month, year] = dateTimeParts[1].split('/');
            const time = dateTimeParts[2];
            const date = new Date(`${month}/${day}/${year} ${time} GMT+0300`);
            distinctParts.date = date;
        }

        // Remove the original dateTime property
        delete distinctParts.dateTime;

        return distinctParts;
    } catch (error) {
        return {
            error: "could not transform the message to Object",
            reason: "Wrong M-Pesa Message",
            log: error
        };
    }
}

const create = {
    payment: async function (email, mpesaMessage) {
        try {
            const account = await Account.findOne({ email });
            if (!account) {
                return {
                    error: "Account by email " + email + " not found",
                    status: 404
                }
            }

            const mpesaJSON = splitMessage(mpesaMessage);
            const { date, amount, confirmationCode: reference } = mpesaJSON;

            if (!date) {
                return {
                    ...mpesaJSON,
                    status: 400
                }
            };

            const usedReference = await Payment.findOne({
                reference
            });

            if (usedReference) {
                return {
                    error: `The M-Pesa reference ${reference} has already been used`,
                    status: 400
                }
            }

            const payment = new Payment({
                account: account._id,
                accountType: 'writer',
                amount,
                paymentDate: date,
                agent: "mpesa",
                reasonForPayment: "registration",
                status: "completed",
                reference,
                description: 'This payment was verified manually',
                etc: {
                    confirmationMessage: mpesaMessage,
                    ...mpesaJSON
                }
            })

            await payment.save();


            return payment;
        } catch (error) {
            return { error, status: 500 };
        }
    },
    verification: async function (payment) {
        if (!payment) {
            return { error: "provide payment id", status: 400 };
        }

        try {
            const pay = await Payment.findById(payment);

            if (!pay) {
                return { error: "Payment not found", status: 400 };
            }

            const { account, accountType } = pay;
            const isUsed = await Verification.findOne({
                payment
            });

            if (isUsed) {
                return {
                    error: `M-Pesa reference code ${pay.reference} has already been used`,
                    status: 400
                }
            }
            const isVerified = await Verification.findOne({
                account
            });

            if (isVerified) {
                return {
                    error: "Account is already verified",
                    status: 400
                };
            }
            const registration =await Registration.findOne({ account});
            if(registration){
                registration.verified = true;
                registration.save();
            }
            const verification = new Verification({
                account,
                accountType,
                payment
            });

            await verification.save();

            return verification
        } catch (error) {
            return {
                error,
                status: 500
            }
        }
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function createPayment(req, res) {
    let { email, mpesaMessage } = req.body;

    // validation check if email and mpesa message are provided
    // create payment and respond
    try {
        const payment = await create.payment(email, mpesaMessage);


        if (payment.error) {
            return res.status(payment.status).json(payment);
        }
        return res.status(200).json(payment)
    } catch (error) {
        console.log(error);
        res.status(500).status({ error: "An error occurred, try again latter" });
    }
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function createVerification(req, res) {
    const { payment } = req.body;

    try {

        const verification = await create.verification(payment);
        if (verification.error) {
            return res.status(verification.status).json(verification);
        }
        return res.status(200).json(verification);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An unexpected error occurred, try again later" });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function isVerified(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Provide an email" });
    }

    try {
        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(404).json({ error: `account by the email ${email} not found` });
        }

        const verification = await Verification.findOne({ account: account._id });

        if (!verification) {
            return res.json({
                verification: false
            })
        }

        const payment = await Payment.findById(verification.payment);

        return res.json({
            account,
            verification,
            payment
        })
    } catch (error) {
        return res.status(500).json({
            error: "An unexpected error occurred"
        })
    }
}
module.exports = {
    createPayment, createVerification, isVerified
}