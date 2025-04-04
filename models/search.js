const mongoose = require('mongoose');
const { newSearch } = require('../controllers/summary');

const searchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  query: {
    type: String,
    default: '',
  },
  page: {
    type: Number,
    required: true,
  },
  resultsCount: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['POST', 'GET']
  },
  summarized: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

searchSchema.pre('save', async function (next) {
  try {
    if(this.summarized){
      return next();
    }
    await newSearch(this.createdAt);
    this.summarized = true;
    next()
  } catch (error) {
    next(error);
  }
})

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;