const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
  MerchantRequestID: {
    type: String,
    required: true
  },
  CheckoutRequestID: {
    type: String,
    required: true
  },
  ResponseCode: {
    type: String,
    required: true
  },
  ResponseDescription: {
    type: String,
    required: true
  },
  CustomerMessage: {
    type: String,
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
  }
});

const MPesa = mongoose.model('MPesa', paymentRequestSchema);

module.exports = MPesa;




