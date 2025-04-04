const Account = require('../models/account');
const TokenTransaction = require('../models/tokenTransaction');
const Payment = require('../models/payment');
const express = require('express');
const createHash = require('../utils/createHash');

/**
 * Purchase tokens for an account
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function purchaseTokens(req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const { packageId } = req.body;

    // Define Word Coins packages
    const tokenPackages = {
        'starter': { tokens: 7, price: 750 },
        'most_popular': { tokens: 15, price: 1250 },
        'freelancer_active': { tokens: 30, price: 2000 }
    };

    // Validate package
    if (!packageId || !tokenPackages[packageId]) {
        return res.status(400).json({ error: 'Invalid package selected' });
    }

    const selectedPackage = tokenPackages[packageId];

    try {
        // Create a reference for the payment
        const reference = createHash({ length: 10, encoding: 36 });

        // Store the package info in the session for the payment process
        req.session.tokenPackage = {
            packageId,
            tokens: selectedPackage.tokens,
            price: selectedPackage.price,
            reference
        };

        // Redirect to payment page
        res.redirect('/token/payment');
    } catch (error) {
        console.error('Error initiating token purchase:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}

/**
 * Process token purchase after payment
 * @param {String} accountId - Account ID
 * @param {Object} paymentData - Payment data
 * @param {Number} tokens - Number of tokens purchased
 * @returns {Promise<Object>} - Result of the operation
 */
async function processTokenPurchase(accountId, paymentData, tokens) {
    try {
        // Find the account
        const account = await Account.findById(accountId);
        if (!account) {
            return { error: 'Account not found', status: 404 };
        }

        // Create a payment record
        const payment = new Payment({
            account: accountId,
            accountType: 'writer',
            amount: paymentData.amount,
            paymentDate: new Date(),
            agent: paymentData.agent,
            reasonForPayment: 'token_purchase',
            status: 'completed',
            reference: paymentData.reference,
            description: `Purchase of ${tokens} Word Coins (WC)`,
            etc: paymentData.etc || {}
        });

        await payment.save();

        // Create a token transaction
        const tokenTransaction = new TokenTransaction({
            account: accountId,
            amount: tokens,
            type: 'purchase',
            description: `Purchased ${tokens} Word Coins (WC)`,
            payment: payment._id
        });

        await tokenTransaction.save();

        // Update account tokens
        account.tokens += tokens;
        await account.save();

        return {
            success: true,
            account,
            payment,
            tokenTransaction
        };
    } catch (error) {
        console.error('Error processing token purchase:', error);
        return { error: 'An error occurred while processing the token purchase', status: 500 };
    }
}

/**
 * Use tokens to apply for a job
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
async function useTokensMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/join');
    }

    try {
        // Get the job ID from the request
        const jobId = req.body.job || req.query.id;
        if (!jobId) {
            return res.status(400).render('error', { message: 'Job ID is required', status: 400 });
        }

        // Get the job to determine token cost
        const Job = require('../models/job');
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).render('error', { message: 'Job not found', status: 404 });
        }

        // Get the token cost for this job
        const tokenCost = job.tokenCost || 1;

        // Check if user has enough tokens
        const account = await Account.findById(req.session.user._id);
        if (account.tokens < tokenCost) {
            return res.redirect(`/token/insufficient?job=${jobId}&required=${tokenCost}`);
        }

        // Store token cost in request for later use
        req.tokenCost = tokenCost;
        req.jobId = jobId;

        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Error in useTokensMiddleware:', error);
        return res.status(500).render('error', { message: 'An error occurred', status: 500 });
    }
}

/**
 * Deduct tokens after successful proposal submission
 * @param {String} accountId - Account ID
 * @param {String} jobId - Job ID
 * @param {String} proposalId - Proposal ID
 * @param {Number} tokenCost - Number of tokens to deduct
 * @returns {Promise<Object>} - Result of the operation
 */
async function deductTokens(accountId, jobId, proposalId, tokenCost) {
    try {
        // Find the account
        const account = await Account.findById(accountId);
        if (!account) {
            return { error: 'Account not found', status: 404 };
        }

        // Check if user has enough tokens
        if (account.tokens < tokenCost) {
            return { error: 'Insufficient tokens', status: 400 };
        }

        // Create a token transaction
        const tokenTransaction = new TokenTransaction({
            account: accountId,
            amount: -tokenCost, // Negative amount for usage
            type: 'usage',
            description: `Used ${tokenCost} Word Coins (WC) to apply for a job`,
            job: jobId,
            proposal: proposalId
        });

        await tokenTransaction.save();

        // Update account tokens
        account.tokens -= tokenCost;
        await account.save();

        return {
            success: true,
            account,
            tokenTransaction
        };
    } catch (error) {
        console.error('Error deducting tokens:', error);
        return { error: 'An error occurred while deducting tokens', status: 500 };
    }
}

/**
 * Get token transaction history for an account
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getTokenHistory(req, res) {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const transactions = await TokenTransaction.find({ account: req.session.user._id })
            .sort({ createdAt: -1 })
            .populate('job', 'title')
            .populate('proposal', 'coverLetter')
            .populate('payment', 'amount reference');

        res.json(transactions);
    } catch (error) {
        console.error('Error getting token history:', error);
        res.status(500).json({ error: 'An error occurred while retrieving token history' });
    }
}

module.exports = {
    purchaseTokens,
    processTokenPurchase,
    useTokensMiddleware,
    deductTokens,
    getTokenHistory
};
