// Add this at the very top of the file, before other requires
// This ensures environment variables are loaded early
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    console.log('Using built-in env-file functionality instead of dotenv');
    // Node.js will use --env-file flag if provided
  }
}

const express = require('express')

const cors = require('cors')


const session = require('express-session');
const mongoose = require('mongoose')

const router = require('./router.js');
const updateUser = require('./middleware/login.js')

// Import routes
const mpesaRoutes = require('./routes/mpesa.routes');

const app = express()

// Debug log to verify environment variables
console.log('\n======== ENVIRONMENT VARIABLES CHECK ========');
console.log(`pay_url: "${process.env.pay_url}"`);
console.log(`mpesa_callback_url: "${process.env.mpesa_callback_url}"`);
console.log(`PORT: "${process.env.PORT}"`);
console.log('=============================================\n');

// Add this after app initialization to debug environment variables
console.log('Environment variables loaded:');
console.log('- pay_url:', process.env.pay_url);
console.log('- PORT:', process.env.PORT);
console.log('- mpesa_callback_url:', process.env.mpesa_callback_url);

app.set('trust proxy', true);


app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false
}));

app.use(cors({ origin: '*' }))

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(updateUser);

// Register routes
app.use('/mpesa', mpesaRoutes);

app.set('view engine', 'ejs')

router(app);

let port = process.env.PORT
const uri = process.env.uri;


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result => {
    app.listen(port, () => {
        console.log('app listening on http://127.0.0.1:' + port);
    })
}).catch(err => {
    console.log(err)
})

