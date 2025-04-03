const Payment = require('../../models/payment');
const PayStack = require('../../models/payStack');

const express = require('express');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function createPayStackPayment (req, res){
    try {
        const client = req.client;
        const writer = req.user;


        const transactionId = req.body.transactionId;

        const payStackTransaction = await PayStack.findOne({reference:transactionId});

        if(!payStackTransaction){
            return res.status(404).json({error: "Paystack transaction not found"});
        }

        let accountType = null;
        let accountId = null;
        if(client){
            accountType = 'client';
            accountId = client._id
        }

        if(writer){
            accountType = 'writer',
            accountId = writer._id;
        }

        if(!accountType){
           return res.status(400).json({
                error: 'Specify whether you are a writer or employer'
            });
        }
        const payObj = {
            amount: payStackTransaction.amount,
            accountType,
            account: accountId,
            paymentDate: new Date(),
            agent: 'paystack',
            reasonForPayment: 'Work Hub Transaction',
            status: 'initiated',
            reference: payStackTransaction.reference,
            etc: payStackTransaction.toObject()
        }

        const payment = new Payment(payObj);

        await payment.save();

        res.status(200).json(payment);

    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
}

module.exports = createPayStackPayment;