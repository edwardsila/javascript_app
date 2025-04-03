const mongoose = require("mongoose");
const { newFeedback, readFeedback } = require("../controllers/summary");

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    message: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    ip: {
        type: String
    },
    summarized: {
        type: Boolean,
        default: false
    },
    readSummarized: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Post-save hook to call the newWriter function after a writer is saved
feedbackSchema.pre('save', async function (next) {
    try {
        if (this.isModified('read') && !this.readSummarized) {
            await readFeedback(new Date().toDateString());
            this.readSummarized = true;
        }
        if (this.summarized) {
            next();
            return;
        }

        await newFeedback(this.createdAt);
        this.summarized = true;

        next();
    } catch (error) {
        next(error);
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;