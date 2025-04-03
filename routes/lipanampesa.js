const express = require('express')
const router = express.Router()
const {
    initiateSTKPush,
    stkPushCallback,
    confirmPayment
} = require( "../controllers/lipanampesa.js");


const {accessToken} = require("../middlewares/generateAccessToken.js");
const MpesaCallback = require('../models/mpesaCallback.js');
const initPay = require('../controllers/mpesa.js');
const manualUpdate = require('../controllers/manualUpdate.js');

router.route('/stkPush').post(accessToken,initiateSTKPush)
router.route('/stkPushCallback/:Order_ID').post(stkPushCallback)
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken,confirmPayment);
router.post('/start', initPay);
router.post('/manualUpdate', manualUpdate);
router.post('/cb', (req, res)=>{
    const cb = new MpesaCallback({
        content: req.body
    });
    cb.save();

    res.json({
        success: true,
        message: "message received"
    });
})

module.exports = router
