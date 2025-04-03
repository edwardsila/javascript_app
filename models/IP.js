const mongoose = require('mongoose');
const { newIp } = require('../controllers/summary');

const IPSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },
  isLoaded: {
    type: Boolean,
    default: false
  },
  status: String,
  message: String,
  continent: String,
  continentCode: String,
  country: String,
  countryCode: String,
  region: String,
  regionName: String,
  city: String,
  zip: String,
  lat: Number,
  lon: Number,
  timezone: String,
  offset: String,
  currency: String,
  isp: String,
  org: String,
  as: String,
  asname: String,
  mobile: {
    type: Boolean,
    default: false
  },
  proxy: {
    type: Boolean,
    default: false
  },
  hosting: {
    type: Boolean,
    default: false
  },
  summarized: {
    type: Boolean,
    default: false
  },
  freq:{
    type: Number,
    default: 1
  }
}, { timestamps: true });


IPSchema.pre('save', async function (next) {
  try {
    if (this.summarized) {
      return  next();
    }
    await newIp(this.createdAt);
    this.summarized = true;
    next()
  } catch (error) {
    next(error);
  }
})

const IP = mongoose.model('IP', IPSchema);

module.exports = IP;
