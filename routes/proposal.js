const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const Proposal = require('../models/proposal');
const Job = require('../models/job');
const TokenTransaction = require('../models/tokenTransaction');
const checkObjId = require('../utils/isCorrectObjectId');
const tokenRequired = require('../middleware/tokenRequired');
const { useTokensMiddleware, deductTokens } = require('../controllers/token');

router.get('/send', useTokensMiddleware, async (req, res)=>{
    const jobId = req.query.id;
    if(!checkObjId(jobId)){
        return res.status(400).render('error', {message: 'Wrong Job Id', status: 400});
    }
    try {
        const existingProposal = await Proposal.findOne({proposer: req.session.user._id, job: jobId});
        if(existingProposal){
            return res.redirect('/proposal/sent?id='+existingProposal._id);
        }

        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).render('error', {message: 'Job not found', status: 404});
        }

        res.render('propose', {job});
    } catch (error) {
        console.log(error);
        return res.status(500).render('error', {message: 'An error ocurred on our side', status: 500});
    }
})

router.post('/', useTokensMiddleware, async (req, res)=>{
    const {job, price, periodValue, periodUnit, coverLetter} = req.body;
    if(!checkObjId(job)){
        return res.status(400).render('error', {message: 'Wrong Job Id', status: 400});
    }
    for(i of [price, periodValue, periodUnit, coverLetter]){
        if(!i){
            return res.status(400).render('error', {message: 'there are missing values', status: 400});
        }
    }
    try {
        const proposer =  req.session.user._id;
        const estimatedTime = `${periodValue} ${periodUnit}`;

        // Get token cost from middleware
        const tokenCost = req.tokenCost || 1;

        const proposal = new Proposal({
            proposer, estimatedTime, price, job, coverLetter, tokensUsed: tokenCost
        });

        await proposal.save();

        // Deduct tokens from user's account
        const result = await deductTokens(proposer, job, proposal._id, tokenCost);

        if (result.error) {
            return res.status(result.status || 500).render('error', {message: result.error, status: result.status || 500});
        }

        res.redirect('/proposal/sent?id='+proposal._id);
    } catch (error) {
        console.log(error);
        return res.status(500).render('error', {message: 'An error ocurred on our side', status: 500});
    }
})

router.get('/sent', tokenRequired(0), async (req, res)=>{
    const proposalId = req.query.id;
    if(!checkObjId(proposalId)){
        return res.status(400).render('error', {message: 'Wrong proposal Id', status: 400});
    }
    try {
        const proposal = await Proposal.findById(proposalId);

        if(!proposal){
            return res.status(404).render('error', {message: 'Proposal not found', status: 404});
        }
        const uid = req.session.user._id;

        if(uid.toString() != proposal.proposer.toString()){
            return res.status(403).render('error', {message: 'Permission denied', status: 403});
        }
        const job = await Job.findById(proposal.job);

        res.render('proposal', {job, proposal});
    } catch (error) {
        console.log(error);
        return res.status(500).render('error', {message: 'An error ocurred on our side', status: 500});
    }
})
module.exports = router;