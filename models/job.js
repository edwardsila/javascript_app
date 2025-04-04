const mongoose = require('mongoose');
const { newJob } = require('../controllers/summary');
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId
const jobSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  keywords: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timeExpected: {
    type: String,
    required: true
  },
  images: {
    type: [String]
  },
  documents: {
    type: [String]
  },
  price: {
    type: Number,
    required: true
  },
  expertiseLevel: {
    type: String,
    required: true,
    enum: ['entry level', 'beginner', 'intermediate', 'expert', 'N/A']
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  likes: [{
    type: ObjectId,
    ref: 'Account',
    unique: true
  }],
  completed: {
    type: Boolean,
    default: false
  },
  summarized: {
    type: Boolean,
    default: false
  },
  tokenCost: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

jobSchema.index({
  title: 'text',
  keywords: 'text',
  description: 'text',
  expertiseLevel: 'text',
});


jobSchema.pre('save', async function (next) {
  try {
    if (this.summarized) {
      return next();
    }

    await newJob(this.createdAt);
    this.summarized = true;

    next()
  } catch (error) {
    next(error);
  }
})

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
