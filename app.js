const express = require('express')

const cors = require('cors')


const session = require('express-session');
const mongoose = require('mongoose')

const router = require('./router.js');
const updateUser = require('./middleware/login.js')

const app = express()

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

