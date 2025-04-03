const mongoose = require("mongoose");

const Account = require('./account');
const { newReferral } = require("../controllers/summary");

const registrationSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    referral: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    name: {
        type: String
    },
    summarized: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

registrationSchema.pre('save', async function (next) {
    try {
        if (this.summarized) {
            return next();
        }

        const n = await Account.count({ referral: this.referral });
        if (n) {
            await newReferral(new Date());
        }

        this.summarized = true;

        next();
    } catch (error) {
        next(error);
    }
})

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;