const express = require('express');
const router = express.Router();
// const auth = require('../middleware/loginRequired');

//const {create} = require('../controllers/blog');

router.get('/editor', (req, res)=>{
    res.render('edit-blog');
})

// Route for creating a new blog post
//router.post('/create', auth, create);

// Export the router for use in your application
module.exports = router;
