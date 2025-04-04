const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenTransactionSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'usage', 'refund', 'bonus'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job'
  },
  proposal: {
    type: Schema.Types.ObjectId,
    ref: 'Proposal'
  },
  summarized: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const TokenTransaction = mongoose.model('TokenTransaction', tokenTransactionSchema);

module.exports = TokenTransaction;
