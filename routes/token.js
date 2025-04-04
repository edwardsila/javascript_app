const express = require('express');
const router = express.Router();
const { purchaseTokens, getTokenHistory } = require('../controllers/token');
const { processTokenPayment } = require('../controllers/tokenPurchase');
const loginRequired = require('../middleware/loginRequired');
const { getAmount, offerAvailable } = require('../utils/getAmount');

// Token purchase page
router.get('/', loginRequired, (req, res) => {
    res.render('token-packages', {
        user: req.session.user,
        offer: offerAvailable(new Date().toISOString())
    });
});

// Process token purchase request
router.post('/purchase', loginRequired, purchaseTokens);

// Token payment page
router.get('/payment', loginRequired, (req, res) => {
    if (!req.session.tokenPackage) {
        return res.redirect('/token');
    }

    res.render('token-payment', {
        user: req.session.user,
        package: req.session.tokenPackage,
        offer: offerAvailable(new Date().toISOString())
    });
});

// Insufficient tokens page
router.get('/insufficient', loginRequired, (req, res) => {
    const { job, required } = req.query;

    res.render('insufficient-tokens', {
        user: req.session.user,
        jobId: job,
        requiredTokens: required || 1,
        offer: offerAvailable(new Date().toISOString())
    });
});

// Complete token purchase
router.get('/purchase/complete/:id', loginRequired, processTokenPayment);

// Get token transaction history
router.get('/history', loginRequired, getTokenHistory);

module.exports = router;
