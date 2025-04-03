const express = require('express');
const { create, login, changeAbout, changeName, changeLocation, deleteSkill, addSkill, addWorkXp, deleteWorkXp, findByReferralCode } = require('../controllers/account');
const Verification = require('../models/verification')

const router = express.Router();
const { createPayment, createVerification, isVerified } = require('../controllers/action');

router.get('/set-all-referrals', require('../controllers/referrals').create);
router.post('/login', login);
router.post('/create', create);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

router.get('/info', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user)
    } else {
        res.json({ error: 'user not found' });
    }
})

router.get('/verification', async (req, res) => {
    const user = req.session.user;
    if (!user || !user._id) {
        return res.json({ error: 'Login' });
    }
    try {
        const myVerification = await Verification.findOne({ account: user._id });
        if (!myVerification) {
            res.status(400).json({ error: 'not verified' })
        } else {
            res.json({ verification: myVerification })
        }
    } catch (error) {

    }
})

router.post('/isVerified', isVerified);
router.post('/payment', createPayment);
router.post('/verify', createVerification);

router.post('/edit-about', changeAbout);
router.post('/edit-name', changeName);
router.post('/edit-location', changeLocation);
router.get('/delete-skill/:id', deleteSkill);
router.post('/add-skill', addSkill);
router.post('/add-work-experience', addWorkXp);
router.get('/delete-work-xp/:id', deleteWorkXp);
router.get('/findByReferral', findByReferralCode);
module.exports = router;