const https = require('https');
const paystackLiveSecret = process.env['PAYSTACK_LIVE_SECRET'];

const express = require('express');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function requestPayment(req, res){
    try {
        const { email, amount } = req.query;
    const params = JSON.stringify({
        email, amount, currency: 'KES'
    })

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + paystackLiveSecret,
            'Content-Type': 'application/json'
        }
    }

    const request = https.request(options, response => {
        let data = ''

        response.on('data', (chunk) => {
            data += chunk
        });

        response.on('end', () => {
            console.log(JSON.parse(data));
            res.status(200).json(JSON.parse(data));
        })
    }).on('error', error => {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong', status: 500 });
    })

    request.write(params)
    request.end()
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', status: 500 });
    }
}

module.exports = requestPayment;