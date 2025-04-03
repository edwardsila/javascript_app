const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  documents: [
    {
      name: String,
      url: String
    }
  ],
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Payment'
  },
  feedback: {
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    comment: String
  }
}, {timestamps: true, timeseries: true});

module.exports = mongoose.model('Solution', solutionSchema);
