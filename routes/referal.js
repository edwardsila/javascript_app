const express = require("express");
const router = express.Router();

const Account = require("../models/account");

router.get('/:inviteCode', async (req, res)=>{
    const inviteCode  = req.params.inviteCode;
    try {
        var isAvailable = await Account.findOne({referralCode: inviteCode});
        if(!isAvailable){
            isAvailable = await Account.findOne({customReferralCode: inviteCode})
        }
    } catch (error) {
        
    }
})

module.exports  = router;