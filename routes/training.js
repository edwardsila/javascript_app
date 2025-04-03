const express = require('express');

const router = express.Router();
const  verificationCheck = require('../middleware/activationRequired');

router.use('/', verificationCheck, (req, res)=>{
    res.redirect('/contact')
})

module.exports = router;