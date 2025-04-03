const mongoose = require('mongoose');

const payStackSchema = new mongoose.Schema({
    content: String,
    amount: Number,
    status: String,
    reference: String
}, {timestamps: true});

const PayStack = mongoose.model('PayStack', payStackSchema);

module.exports = PayStack;