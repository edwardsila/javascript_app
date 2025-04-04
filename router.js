
const morgan = require('./middleware/morgan.js')

const Account = require('./models/account.js')
const Feedback = require("./models/feedback.js")
const { offerAvailable } = require('./utils/getAmount.js')
const loginRequired = require('./middleware/loginRequired.js')
const lipaNaMpesaRoutes = require("./routes/lipanampesa.js");

function router(app) {
    app.get('/', morgan, (req, res) => {
        res.render('index', { user: req.session.user, offer: offerAvailable(new Date()) })
    })

    app.use('/dashboard', morgan, require('./routes/dashboard.js'));
    app.use('/account', morgan, require('./routes/account.js'));
    app.get('/logout', morgan, (req, res) => res.redirect('/account/logout'))
    app.use('/blog', morgan, require('./routes/blog.js'));
    app.use('/job', morgan, require('./routes/job.js'));
    app.use('/jobs', morgan, require('./routes/jobs.js'));
    app.use('/proposal', morgan, loginRequired, require('./routes/proposal.js'))
    app.use('/payment', morgan, loginRequired, require('./routes/payment.js'))
    app.use('/training', morgan, require('./routes/training.js'));
    app.use('/paystack', morgan,  require("./routes/paystack.js"))
    app.use('/token', morgan, require('./routes/token.js'))

    app.use('/mpesa', lipaNaMpesaRoutes);

    app.get('/testimonials', morgan, (req, res) => {
        res.render('testimonials')
    })
    app.get('/writer', morgan, (req, res) => {
        res.render('seller')
    })

    app.get('/post-job', morgan, (req, res) => {
        res.render('post-job')
    })


    app.get('/contact', morgan, (req, res) => {
        res.render('contact')
    })

    app.post('/comment', morgan, (req, res) => {

        const { name, message, phone, email } = req.body;

        const feedback = new Feedback({ name, message, phone, email, ip: req.ip });

        feedback.save();
        console.error({ ...req.body, date: new Date().toString() });
        res.render('contact');
    })

    app.get('/feedback-json', async (req, res) => {
        try {
            const feedback = await Feedback.find();
            res.json(feedback);
        } catch (error) {
            res.json(error);
        }
    })
    app.get('/terms-conditions', morgan, (req, res) => {
        res.render('tandc')
    })
    // Pro-only route now redirects to token page in the route below
    app.get('/signup', morgan, (req, res) => {
        const account = req.query.account;
        if (account === 'writer') {
            res.render('signup-writer', { referral: null, name: "WorkHub Writers" });
        } else if (account === 'client') {
            res.render('join');
        } else {
            res.render('signup1');
        }
    });
    app.get('/join', morgan, (req, res) => {
        res.render('join')
    })
    app.get('/join/:referralCode', morgan, async (req, res) => {
        const referral = req.params.referralCode;
        try {

            const account = Account.findOne({ referral });
            if (account) {
                return res.render('signup-writer', { referral, name: account.name });
            }
            res.render('signup-writer', { referral, name: "WorkHub Writers" })
        } catch (error) {
            res.render('signup-writer', { referral, name: "WorkHub Writers" })
        }
    })
    app.get('/Login', morgan, (req, res) => {
        res.render('login')
    })
    app.get('/activation', morgan, (req, res) => {
        res.redirect('/token')
    })

    app.get('/pro-only', morgan, (req, res) => {
        res.redirect('/token')
    })

    app.use(morgan, (req, res) => {
        res.status(404).render('404')
    })
}

module.exports  = router;