const mongoose = require('mongoose');
const { newLogin } = require('../controllers/summary');

const loginSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    ip: String,
    sessionId: String,
    os: String,
    device: String,
    client: String,
    summarized: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

loginSchema.pre('save', async function (next){
    try {
        if (this.summarized) {
            return  next();
          }
        await newLogin(new Date().toDateString());
        this.summarized = true;
        next();
    } catch (error) {
        next(error);
    }
})

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;