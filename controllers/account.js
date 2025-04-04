const Account = require('../models/account')
const Registration = require("../models/registration");
const email = require('../email/send.email');
const bcrypt = require('bcrypt')
const createHash = require('../utils/createHash')

const express = require('express');
const useragent = require('useragent');
const Login = require('../models/login');


/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
async function create(req, res) {
    const account = req.body;

    console.trace(account);
    // Check if all required fields are present
    for (let e of ["name", "email", "password", "phone"]) {
        if (!account[e]) {
            return res
                .status(403)
                .render('error', { message: "missing `" + e + "` in account details", status: 400 });
        }
    }

    try {
        // Check if an account with the same email or phone already exists
        const existingEmail = await Account.findOne({ email: account.email });
        if (existingEmail) {
            return res
                .status(409)
                .render("error", { message: `An account has already been registered under the email ${account.email}`, status: 409 });
        }

        const existingPhone = await Account.findOne({ phone: account.phone });
        if (existingPhone) {
            return res
                .status(409)
                .json("error", { message: `An account has already been registered under the phone number ${account.phone}`, status: 409 });
        }

        // Hash the password using bcrypt
        const password = await bcrypt.hash(account.password, 10)

        // Generate a custom API key
        const accessKey = createHash({ length: 32, encoding: 36 });

        // Generate a unique referral code before saving
        const tempId = createHash({ length: 10, encoding: 36 });
        const referralCode = (new Date().valueOf() + parseInt(tempId, 16)).toString(36);

        // Create the user with the referral code already set
        let user = new Account({
            name: account.name,
            email: account.email,
            phone: account.phone,
            password,
            accessKey,
            invitedBy: account.referral,
            referral: referralCode,
            tokens: 5 // Give new users 5 free tokens to start
        });

        const savedUser = await user.save();
        req.session.user = savedUser;
        res.status(201).redirect('/');

        const inviteCode = account.referral;
        const registration = new Registration({
            account: savedUser._id,
            session: req.session.id,
            url: req.url,
            ip: req.ip,
            referral: inviteCode,
            name: savedUser.name
        });

        registration.save();
        email.welcome(savedUser.name, savedUser.email, savedUser.referral);

    } catch (error) {
        console.error(error);
        res.status(500).render("error", { message: "An error occurred", status: 500 });
    }
}



async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).render("error", { message: 'missing email', status: 400 })
        }
        if (!password) {
            return res.status(400).render("error", { message: 'missing password', status: 400 })
        }
        const account = await Account.findOne({ email });
        console.log(account);
        if (!account) {
            return res.status(404).render("error", { message: 'account by email : ' + email + ' not found, check the email and try again', status: 400 })
        }
        let success = bcrypt.compareSync(password, account.password);
        if (success) {
            req.session.user = account
            res.redirect('/');

            const agent = useragent.parse(req.get('User-Agent'));



            const login = new Login({
                account: account._id,
                sessionId: req.session.id,
                device: agent.device.toString(),
                os: agent.os.toString(),
                client: agent.toString(),
                ip: req.ip
            });

            login.save();
        } else {
            res.status(401).render("error", { message: 'wrong password', status: 400 })
        }

    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "internal server error", status: 500 });
    }
}

async function changeAbout(req, res) {
    if (!req.session.user) {
        return res.status(403).render('error', { message: "You are not logged in", status: 403 });
    }
    if (!req.body.about) {
        return res.status(403).render('error', { message: "Description not provided", status: 403 });
    }
    try {
        const user = await Account.findById(req.session.user._id);

        if (!user) {
            return res.status(403).render('error', { message: "You are not logged in", status: 403 });
        }

        user.description = req.body.about;

        await user.save();
        res.redirect('/dashboard/settings');
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { message: "An error occurred", status: 500 });
    }
}

async function changeName(req, res) {
    if (!req.session.user) {
        return res.status(403).render('error', { message: "You are not logged in", status: 403 });
    }
    if (!req.body.name) {
        return res.status(403).render('error', { message: "Provide a new name", status: 403 });
    }
    try {
        const user = await Account.findById(req.session.user._id);

        if (!user) {
            return res.status(403).render('error', { message: "You are not logged in", status: 403 });
        }

        user.name = req.body.name;

        await user.save();
        res.redirect('/dashboard/settings');
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { message: "An error occurred", status: 500 });
    }
}

async function changeLocation(req, res) {
    if (!req.session.user) {
        return res.status(403).render('error', { message: "You are not logged in", status: 403 });
    }
    const location = req.body;
    console.log(location);
    for (let e of ['continent', 'country', 'subCountry', 'city']) {
        if (!location[e]) {
            return res.status(400).render('error', { message: `Missing "${e}" in location details`, status: 400 });
        }
    }

    try {
        const user = await Account.findById(req.session.user._id);

        if (!user) {
            return res.status(403).render('error', { message: "You are not logged in", status: 403 });
        }

        user.region = location;

        await user.save();

        res.redirect('/dashboard/profile');
    } catch (error) {
        console.error(error)
        res.status(500).render('error', { message: "An error occurred", status: 500 });
    }
}

const addSkill = async (req, res) => {
    if (!req.session.user) {
        return res.status(403).render('error', { message: "You are not logged in", status: 403 });
    }
    const { skill, skillLevel } = req.body; // Assuming the form fields are named "skill" and "skillLevel"
    if(!skill || !skillLevel){
        return res.status(400).render('error', { message: "Bad request, missing skill or skill level", status: 400 });
    }
    try {
        // Find the account by its ID and push the new skill to the skills array
        const account = await Account.findByIdAndUpdate(
            req.session.user._id, // Assuming you have user authentication and req.user contains the logged-in user's information
            {
                $push: {
                    skills: {
                        name: skill,
                        level: skillLevel,
                    },
                },
            },
            { new: true }
        );

        if (!account) {
            return res.status(403).render('error', { message: "You are not logged in", status: 403 });
        }

        // Skill added successfully
        res.redirect('/dashboard/settings')
    } catch (error) {
        console.error('Error adding skill:', error);
        return res.status(500).render('error', { message: "Internal server error", status: 500 });
    }
};


const deleteSkill = async (req, res) => {
    if (!req.session.user) {
        return res.status(403).render('error', { message: "You are not logged in", status: 403 });
    }
    const skillId = req.params.id;

    try {
        // Find the account by its ID and update it to remove the skill
        const account = await Account.findByIdAndUpdate(
            req.session.user._id,
            { $pull: { skills: { _id: skillId } } },
            { new: true }
        );

        if (!account) {
            return res.status(403).render('error', { message: "You are not logged in", status: 403 });
        }

        // Skill deleted successfully
        res.redirect('/dashboard/settings');
    } catch (error) {
        console.error(error)
        return res.status(500).render('error', { message: "An error occurred", status: 500 });
    }
};

async function addWorkXp(req, res){
    if (!req.session.user) {
        return res.status(403).render('error', { message: "You are not logged in", status: 403 });
    }
    const { jobTitle, company, startDate, endDate } = req.body; // Assuming the form fields are named "skill" and "skillLevel"
    if(!jobTitle || !company || !startDate){
        return res.status(400).render('error', { message: "Bad request, provide all details", status: 400 });
    }
    try {
        // Find the account by its ID and push the new skill to the skills array
        const account = await Account.findByIdAndUpdate(
            req.session.user._id, // Assuming you have user authentication and req.user contains the logged-in user's information
            {
                $push: {
                    workExperience:{
                        jobTitle, company, startDate, endDate: endDate ? endDate : null
                    },
                },
            },
            { new: true }
        );

        if (!account) {
            return res.status(403).render('error', { message: "You are not logged in", status: 403 });
        }

        // Skill added successfully
        res.redirect('/dashboard/settings')
    } catch (error) {
        console.error('Error adding work experience:', error);
        return res.status(500).render('error', { message: "Internal server error", status: 500 });
    }
}

const deleteWorkXp = async (req, res) => {
    if (!req.session.user) {
        return res.status(403).render('error', { message: "You are not logged in", status: 403 });
    }
    const xpId = req.params.id;

    try {
        // Find the account by its ID and update it to remove the skill
        const account = await Account.findByIdAndUpdate(
            req.session.user._id,
            { $pull: { workExperience: { _id: xpId } } },
            { new: true }
        );

        if (!account) {
            return res.status(403).render('error', { message: "You are not logged in", status: 403 });
        }

        // Skill deleted successfully
        res.redirect('/dashboard/settings');
    } catch (error) {
        console.error(error)
        return res.status(500).render('error', { message: "An error occurred", status: 500 });
    }
}


const setReferral = async (req, res) => {
    const accountId =  req.session.user._id;

    if(!accountId){
        return res.status(400).render('error', {status: 40, message: "Login to access this resource"})
    }
    try {
        const account  = await Account.findById(accountId);

        if(!account){
            throw new Error("Account not found");
        }

        if(account.referral){
            throw new Error(`Account already has referral code ${account.referral}`);
        }

        let id = account._id.toString().slice(17);

        id = parseInt(id, 16).toString(36);

        account.referral = id;

        res.status(200).json(account);

    } catch (error) {
        console.log(error);
        res.status(500).json({error});
    }
}

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function findByReferralCode(req, res){
    const referralCode  = req.query.code || req.body.code;
    try {
        const user = await Account.findOne({referral: referralCode});
        if(!user){
            return res.status(404).json({name: "Not found"})
        }else{
            return res.json({name: user.name});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({name: "An error occurred"});
    }
}
module.exports = {
    create, login, changeAbout, changeName, changeLocation, deleteSkill, addSkill, addWorkXp, deleteWorkXp, setReferral, findByReferralCode
}