const express = require('express')
const Verification = require('../models/verification');
const getColor = require('../utils/nameToColor');
const getDate = require('../utils/getMonthAndYear');

const router = express.Router();
const {makeTableData, getReferrals} = require('../controllers/dashboard')

function loginRequired(req, res, next){
    if(!req.session.user){
        return res.redirect('/join');
    }else{
        next();
    }
}
router.get('/',loginRequired, async (req, res)=>{
    try {
        const user = await makeTableData(req.session.user._id);
        res.render('dashboard', {user, page: 1, pageName: "Dashboard"});
    } catch (error) {
        console.log(error);
        res.render("error", {status: 500, message: "An error occurred"});
    }
})

router.get('/jobs',loginRequired, async (req, res)=>{
    
    const user = await makeTableData(req.session.user._id);
    res.render('dashboard-job', {user, page: 2, pageName: "Jobs Statistics"});
})

router.get('/referrals', loginRequired, async (req, res)=>{
    try {
        const user = await getReferrals(req.session.user._id);
        const color = getColor(user.name);
        res.render('dashboard-referral', {user, page: 3, pageName: "Referrals", color});
    } catch (error) {
        console.log(error);
        res.render("error", {status: 500, message: "An error occurred"});
    }
})
router.get('/profile', async (req, res)=>{
    if(!req.session.user){
        return res.redirect('/join');
    }
    const user = req.session.user;
    let verification = await Verification.findOne({account: user._id});
    if(verification){
        verification = {verified: true};
    }else{
        verification = {verified: false}
    }
    const color = getColor(user.name);
    
    res.render('profile', {user, page: 4, pageName: "Profile", verification, color, getDate});
})

router.get('/settings', async (req, res)=>{
    if(!req.session.user){
        return res.redirect('/join');
    }
    const user = req.session.user;
    let verification = await Verification.findOne({account: user._id});
    if(!verification){
        verification = {verified: false};
    }
    const color = getColor(user.name);
    
    const workExperience = user.workExperience.map((w)=>{
        const {startDate, endDate} = w;
        w.startDate = getDate(startDate.toString());
        if(endDate){
            w.endDate = getDate(endDate.toString());
        }
        return w;
    })

    res.render('dash-settings', {user, page: 5, pageName: "Settings", verification, color, workExperience});
})
module.exports = router;