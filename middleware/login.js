const express = require('express');
const Account = require('../models/account');
const Proposal = require('../models/proposal');


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function updateUser(req, res, next){
    try {
        if(!req.session.user){
           return next();
        }

        let id = req.session.user._id;

        const user  = await Account.findById(id);

        if(user){
            const proposals = await Proposal.find({proposer: user._id});
            req.session.user = {
                ...user.toObject(),
                proposals,
                jobs: proposals.filter(p=>p.status == 'accepted')
            };
        }

        return next();
    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = updateUser;