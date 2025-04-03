const https = require('https');
const express = require('express');
const paystackLiveSecret = process.env['PAYSTACK_LIVE_SECRET'];
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function validCountries(req, res) {
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/country',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + paystackLiveSecret, // Replace 'SECRET_KEY' with your actual Paystack secret key
    },
  };

  const request = https.request(options, (paystackRes) => {
    let data = '';

    paystackRes.on('data', (chunk) => {
      data += chunk;
    });

    paystackRes.on('end', () => {
      const countryData = JSON.parse(data);
      console.log(countryData);

      // You can customize the response based on your needs
      res.status(200).json(countryData);
    });
  });

  request.on('error', (error) => {
    console.error(error);

    // Handle errors in the response
    res.status(500).json({ message: 'Error fetching valid countries', status: 500 });
  });

  // End the request
  request.end();
}

module.exports = validCountries;