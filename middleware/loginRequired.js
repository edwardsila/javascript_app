const loginRequired = (req, res, next)=>{
    if(!req.session.user){
        res.redirect('/join');
    }else{
        next();
    }
};

module.exports = loginRequired;