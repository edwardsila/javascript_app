const mongoose = require('mongoose');
const { newIncome } = require('../controllers/summary');
const { Schema } = mongoose;

// Payment model
const paymentSchema = new Schema({
  account: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['writer', 'client'],
    default: "writer"
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  agent: {
    type: String,
    required: true,
    enum: ['mpesa', 'paypal'],
    default: "mpesa"
  },
  reasonForPayment: {
    type: String,
    enum: ['registration', 'job', 'token_purchase'],
    default: "registration"
  },
  status: {
    type: String,
    required: true,
    enum: ['initiated', 'completed', 'failed'],
  },
  reference: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  etc: {
    type: Object
  },
  summarized: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

paymentSchema.pre('save', async function (next) {
  try {
    if (this.summarized) {
      return  next();
    }
    await newIncome(new Date().toDateString(), this.amount);
    this.summarized = true;

    next();
  } catch (error) {
    next(error);
  }
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment
