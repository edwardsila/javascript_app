const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
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
      paymentMethod: {
        type: String,
      },
      paymentDetails: {
        type: Object
      }
}, {timestamps: true});


const Client = mongoose.model('Client', clientSchema);

module.exports = Client;