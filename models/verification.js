const mongoose = require('mongoose');
const { newVerification } = require('../controllers/summary');
const { Schema } = mongoose;

const verificationSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
    unique: true
  },
  accountType: {
    type: String, required: true, enum: ['client', 'writer']
  },
  revoked: {
    type: Boolean,
    default: false
  },
  revocationDate: {
    type: Date
  },
  reasonForRevocation: {
    type: String
  },
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  summarized: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

verificationSchema.pre('save', async (next) => {
  try {
    await newVerification(this.createdAt);
    this.summarized = true;
    next();
  } catch (error) {
    next(error);
  }
})

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
