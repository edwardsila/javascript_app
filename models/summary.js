const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  interval: {
    type: String,
    enum: ['day', 'month', 'year', 'lifetime'],
    required: true,
  },
  date: {
    type: String, // i.e 2023 or 2023/11 or 2023/11/14 or 'lifetime'
    unique: true,
    required: true
  },
  registrations: {
    type: Number,
    default: 0,
  },
  logins: {
    type: Number,
    default: 0,
  },
  referrals: {
    type: Number,
    default: 0,
  },
  verifications: {
    type: Number,
    default: 0,
  },
  visits: {
    type: Number,
    default: 0,
  },
  visitors: {
    type: Number,
    default: 0,
  },
  paymentCount: {
    type: Number,
    default: 0,
  },
  income: {
    type: Number,
    default: 0,
  },
  incomeCount:{
    type: Number,
    default: 0
  },
  expenditure: {
    type: Number,
    default: 0,
  },
  expenditureCount: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
    default: 0,
  },
  searches: {
    type: Number,
    default: 0,
  },
  jobs: {
    type: Number,
    default: 0,
  },
  proposals: {
    type: Number,
    default: 0,
  },
  feedbacks: {
    type: Number,
    default: 0,
  },
  readFeedbacks: {
    type: Number,
    default: 0,
  },
});


const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
