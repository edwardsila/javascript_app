const express = require('express');

const router = express.Router();
const tokenRequired = require('../middleware/tokenRequired');

router.use('/', tokenRequired(1), (req, res)=>{
    res.redirect('/contact')
})

module.exports = router;