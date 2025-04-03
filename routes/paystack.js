const express = require('express');
const { requestPayment, paymentCallback, validCountries, createPayStackPayment } = require('../controllers/payStack');

const loginRequired = require("../middleware/loginRequired.js");

const router = express.Router();

router.get('/validCountries', validCountries);
router.get('/init', requestPayment);
router.post('/payCallback', paymentCallback);
router.post('/client/createPayment', loginRequired, createPayStackPayment);
router.post('/writer/createPayment', loginRequired, createPayStackPayment);

module.exports = router;