const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  accountType:{
    type: String, required: true, enum: ['writer', 'client']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h'
  }
}, {timestamps: true});
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset