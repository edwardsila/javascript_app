const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  topics: {
    type: String
  },
  excerpt: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  }],
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  indexes: [
    // Index for topics field
    {
      fields: {
        topics: 'text'
      }
    },
    // Index for publishedAt field
    {
      fields: {
        publishedAt: -1 // Descending order for sorting latest posts first
      }
    },
    // Index for excerpt, title, and content fields (text search)
    {
      fields: {
        excerpt: 'text',
        title: 'text',
        content: 'text'
      }
    }
  ]
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
