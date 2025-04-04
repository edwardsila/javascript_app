const MPesa = require('../models/mpesa.js');
const Payment = require('../models/payment.js');

const axios = require('axios')


const getAmount = require('../utils/getAmount').getAmount;
async function pay(phone, amount, name){
    try {

        const data = JSON.stringify({
          phone, amount:getAmount(), 'Order_Id':123, name
        })
        console.log('request data -> ', data)
        const config = {
          method: 'POST',
          maxBodyLength: Infinity,
          url: 'https://workhubwriters.com/mpesa/stkPush',
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        }

        const res = await axios(config);

        return res.data;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}

/**
 *
 * @param {String} phone
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
}


const initPay = async (req, res) => {
    try {

        // Get amount from request or use default
        const amount = req.body.amount || 299;
        const phone = req.body.phone;
        const account = req.session.user._id;
        const accountType = req.body.accountType || 'writer';
        const reasonForPayment = req.body.reasonForPayment || 'registration';
        const description = req.body.description || 'Account activation';
        const p = await pay(formatPhone(phone), amount, req.user.name);
        if (!p) {
            throw new Error('failed to initiate payment')
        }
        if (!p.MerchantRequestID) {
            throw new Error(p)
        }


        const mpesa = new MPesa({
            ...p,
            account,
            accountType
        });

        await mpesa.save()

        const payment = new Payment({
            account,
            amount,
            status: mpesa.ResponseCode && mpesa.ResponseCode == 0 ? 'initiated' : 'failed',
            agent: 'mpesa',
            reference: mpesa.CheckoutRequestID,
            accountType,
            reasonForPayment,
            description
        })

        await payment.save()

        console.log({
            payment, mpesa
        })

        return res.json({ success: 'Payment was successful', payment })
    } catch (error) {
        console.error(error);
        res.status(500).json(error)
    }
}

module.exports = initPay;