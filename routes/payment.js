const express = require('express');
const router = express.Router();
const {offerAvailable, getAmount} = require('../utils/getAmount');

router.get('/', (req, res)=>{
    res.render('paymentRedirect', {user: req.session.user, amount: getAmount()});
})

router.get('/mpesa', (req, res)=>{
    res.render('payment', {user: req.session.user, offer: offerAvailable(new Date().toISOString()), amount: getAmount()});
});


module.exports = router;