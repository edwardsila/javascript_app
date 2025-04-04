const mongoose = require('mongoose');
const { Schema } = mongoose;
const { newWriter } = require('../controllers/summary');


const accountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  rating: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: 'New User'
  },
  accessKey: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'default-profile-pic.jpg'
  },
  region: {
    continent: {
      type: String
    },
    country: {
      type: String
    },
    subCountry: {
      type: String
    },
    city: {
      type: String
    }
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert', 'N/A']
    }
  }],
  certification: [{
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    documentProof: {
      type: String,
      required: true
    }
  }],
  searchHistory: [{
    search: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  workExperience: [{
    jobTitle: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    }
  }],
  resume: {
    type: String
  },
  referral: {
    type: String,
    unique: true,
    sparse: true // This allows multiple documents to have null/undefined values
  },
  invitedBy: {
    type: String
  },
  summarized: {
    type: Boolean,
    default: false
  },
  tokens: {
    type: Number,
    default: 0
  }
}, { timestamps: true });


// Post-save hook to call the newWriter function after a writer is saved
accountSchema.pre('save', async function (next) {
  try {

    if (this.summarized) {
      next();
      return;
    }
    await newWriter(this.createdAt);
    this.summarized = true;
    next();
  } catch (error) {
    next(error);
  }
});


const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
