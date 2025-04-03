const Account = require("../models/account");
const Registration = require("../models/registration");
const express = require("express");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function create(req, res) {
    try {
        const accounts = await Account.find();
        res.json({success: "Connection done"});

        for (let account of accounts) {
            if(account.referral){
                continue;
            }
            let id = account._id.toString().slice(17);

            id = parseInt(id, 16).toString(36);

            account.referral = id;
            await account.save();

            console.log({
                account: account._id,
                referral: account.referral
            });
        }
        
    } catch (error) {
        res.json(error);
        throw error;
    }
}

async function getReferrals(accountId) {
    try {
        const account = await Account.findById(accountId);

        if (!account) {
            throw new Error("Account not found");
        }

        const referral = account.referral;

        const registrations = await Registration.find({ referral });

        return registrations;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getReferrals, create
}