const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: {
    type: String,
    default: ''
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
