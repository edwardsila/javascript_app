// Require the modules
const express = require('express');
const crypto = require('crypto');
const PayStack = require('../../models/payStack');

// Define a route handler for the callback url
const paymentCallback = (req, res) => {
  try {
    // Get the paystack secret key from the environment variables
    const secret = process.env.PAYSTACK_SECRET;

    // Get the request headers
    const { 'x-paystack-signature': signature } = req.headers;

    // Get the request body as a raw buffer
    const body = req.rawBody;

    // Compute the hash of the body using the secret key
    const hash = crypto
      .createHmac('sha512', secret)
      .update(body)
      .digest('hex');

    // Compare the hash with the signature
    if (hash === signature) {
      // The request is valid
      // Parse the body as JSON
      const data = JSON.parse(body);

      // Get the transaction data
      const { amount, reference, status } = data.data;

      // Save the transaction data to the database
      const payment = new PayStack({
        content: body,
        amount,
        reference,
        status
      });

      payment.save((err, doc) => {
        if (err) {
          // Handle the database error
          console.error(err);
          res.status(500).json({ error: 'Database error' });
        } else {
          // The payment is saved
          // Send a response to paystack
          res.status(200).json({ message: 'OK' });

          // Optionally, perform other actions based on the transaction status
          // For example, send a confirmation email to the customer, update your inventory, etc.
        }
      });
    } else {
      // The request is invalid
      // Send a response to paystack with an error message
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    // Handle any other errors
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = paymentCallback;