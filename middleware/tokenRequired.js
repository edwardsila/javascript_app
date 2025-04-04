const Account = require('../models/account');

/**
 * Middleware to check if a user has enough tokens to perform an action
 * @param {Number} requiredTokens - Number of tokens required (default: 1)
 * @returns {Function} - Express middleware function
 */
function tokenRequired(requiredTokens = 1) {
    return async function(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/join');
        }
        
        try {
            const account = await Account.findById(req.session.user._id);
            
            if (!account) {
                return res.redirect('/join');
            }
            
            if (account.tokens >= requiredTokens) {
                // User has enough tokens, proceed
                return next();
            }
            
            // User doesn't have enough tokens, redirect to token purchase page
            const jobId = req.query.id || req.body.job;
            res.redirect(`/token/insufficient?job=${jobId}&required=${requiredTokens}`);
        } catch (error) {
            console.error('Error in tokenRequired middleware:', error);
            res.status(500).render('error', { message: 'An error has occurred', status: 500 });
        }
    };
}

module.exports = tokenRequired;
