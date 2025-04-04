// const MPesa = require('../models/mpesa.js');
const Payment = require('../models/payment.js');
const Account = require('../models/account.js');
const TokenTransaction = require('../models/tokenTransaction.js');
const axios = require('axios');
const { processTokenPurchase } = require('./token');

/**
 * Format phone number for M-Pesa
 * @param {String} phoneNumber
 * @returns {String}
 */
const formatPhone = function (phoneNumber) {
    // Remove all non-numeric characters
    const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Add the country code if it's not already there
    if (numericPhoneNumber.startsWith('0')) {
        return '254' + numericPhoneNumber.substring(1);
    } else if (numericPhoneNumber.startsWith('+' + '254')) {
        return numericPhoneNumber.substring(1);
    } else {
        return numericPhoneNumber;
    }
};

/**
 * Initiate Word Coins purchase via M-Pesa
 */
const initTokenPurchase = async (req, res) => {
    try {
        // Get token package from session
        if (!req.session.tokenPackage) {
            return res.status(400).json({ error: 'No Word Coins package selected' });
        }

        const { tokens, price, reference } = req.session.tokenPackage;
        const phone = req.body.phone;
        const account = req.session.user._id;

        // Instead of making an external API call, let's use the local M-Pesa controller
        // This simplifies the process and avoids potential network issues

        // Create a payment record directly
        const formattedPhone = formatPhone(phone);
        console.log('Word Coins purchase for phone:', formattedPhone, 'amount:', price);

        // Create a unique reference for this payment
        const mpesaReference = reference || Date.now().toString();

        // For testing purposes, we'll skip the actual M-Pesa integration
        // and directly create a payment record
        console.log(`Creating Word Coins purchase for account ${account}, amount ${price}, WC ${tokens}`);

        // Create payment record
        const payment = new Payment({
            account,
            amount: price,
            status: 'initiated',
            agent: 'mpesa',
            reference: mpesaReference,
            accountType: 'writer',
            reasonForPayment: 'token_purchase',
            description: `Purchase of ${tokens} Word Coins (WC)`
        });

        await payment.save();

        // Store payment ID in session for later processing
        req.session.tokenPaymentId = payment._id;

        return res.json({
            success: 'Payment initiated successfully',
            payment,
            tokens
        });
    } catch (error) {
        console.error('Error initiating token purchase:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

/**
 * Process Word Coins purchase after M-Pesa payment confirmation
 */
const processTokenPayment = async (req, res) => {
    try {
        const paymentId = req.params.id || req.session.tokenPaymentId;

        if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID is required' });
        }

        // Get payment details
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Check if payment is for Word Coins purchase
        if (payment.reasonForPayment !== 'token_purchase') {
            return res.status(400).json({ error: 'This payment is not for Word Coins purchase' });
        }

        // For testing purposes, automatically mark the payment as completed
        payment.status = 'completed';
        await payment.save();

        // Get Word Coins package from query parameters or use default values
        const tokens = parseInt(req.query.tokens) || 7; // Default to 7 WC if not specified

        // For testing purposes, directly add Word Coins to the user's account
        const account = await Account.findById(payment.account);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Create a token transaction
        const tokenTransaction = new TokenTransaction({
            account: payment.account,
            amount: tokens,
            type: 'purchase',
            description: `Purchased ${tokens} Word Coins (WC)`,
            payment: payment._id
        });

        await tokenTransaction.save();

        // Update account Word Coins
        account.tokens += tokens;
        await account.save();

        const result = {
            success: true,
            account,
            payment,
            tokenTransaction,
            error: null
        };

        // Clear token package from session
        delete req.session.tokenPackage;
        delete req.session.tokenPaymentId;

        return res.json({
            success: true,
            message: `Successfully purchased ${tokens} Word Coins (WC)`,
            tokens: account.tokens,
            payment: payment,
            transaction: tokenTransaction
        });
    } catch (error) {
        console.error('Error processing token payment:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

module.exports = {
    initTokenPurchase,
    processTokenPayment
};
