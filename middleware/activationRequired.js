const Verification = require('../models/verification');

async function activationRequired(req, res, next){
    if(!req.session.user){
        return res.redirect('/join');
    }
    try {
        const isActive = await Verification.findOne({account: req.session.user._id});
       
        if(isActive){
            return next()
        }
        res.redirect('/pro-only')
    } catch (error) {
        res.status(500).render('error', {message: 'An error has occurred', status:500})
    }
}

module.exports = activationRequired;