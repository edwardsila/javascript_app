const mongoose = require('mongoose');
const { newProposal } = require('../controllers/summary');
const { Schema } = mongoose;
const jobProposalSchema = new Schema({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  proposer: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  attachments: {
    type: [String]
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  summarized: {
    type: Boolean,
    default: false
  },
  tokensUsed: {
    type: Number,
    required: true,
    default: 1
  }
}, { timestamps: true });

jobProposalSchema.pre('save', async function (next) {
  try {
    if (this.summarized) {
      return next();
    }

    await newProposal(this.createdAt);
    this.summarized = true;

    next();
  } catch (error) {
    next(error)
  }
});

const Proposal = mongoose.model('Proposal', jobProposalSchema)

module.exports = Proposal;