const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  accessKey: {
    type: String,
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true
  }
}, {timestamps: true});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
