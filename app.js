require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const { connect } = require('mongoose');
// const path = require('path');
// const fileUpload = require('express-fileupload');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const flash = require('express-flash');
// const flash = require('connect-flash');
const passport = require('passport');
// const connectDB = require('./server/models/database');

const app = express();

// middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const port = process.env.PORT || 3000;



// parser request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));

// app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    // cookie: { maxAge: 1000 * 60 * 60 * 24 }  // 24 hours
}));
// Flash msg
app.use(flash());

// app.use(fileUpload);

// Passport config
const passportInit = require('./server/config/passport');
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

// app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/route');
const { nextTick } = require('process');
app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})