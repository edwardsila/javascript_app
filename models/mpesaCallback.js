const mongoose = require('mongoose');
const email = require("../email/send.email")

const callbackSchema = new mongoose.Schema({
    content: {
        type: Object
    }
}, {timestamps: true});

callbackSchema.post('save', async function(next){
    email.payment(this);
    next();
})

const MpesaCallback = mongoose.model("MpesaCallback", callbackSchema);

module.exports = MpesaCallback;