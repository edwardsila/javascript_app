const mongoose = require('mongoose');
const { newLog } = require('../controllers/summary');

// Define a schema for log entries
const logSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  timestamp: Date,
  responseTime: Number,
  sessionId: String,
  ip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IP'
  },
  os: String,
  device: String,
  client: String,
  user: {
    type: String,
    default: null
  },
  summarized: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

logSchema.pre('save', async function (next){
  try {
    if (this.summarized) {
      return  next();
    }
    await newLog(new Date().toDateString());
    this.summarized = true;
    next();
  } catch (error) {
    next(error);
  }
})

// Create a Mongoose model based on the schema
const Log = mongoose.model('Log', logSchema);

module.exports = Log;
