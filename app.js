const express = require('express');
const session = require('express-session');
const flash = require('connect-flash'); 
const path = require('path');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cache = require('nocache');
const userRouter = require('./router/userRouter');


const adminRouter = require('./router/adminRoute');

//create express app
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connecting to MongoDB
connectDB();


// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cache());
// Initialize flash messages
app.use(flash()); 
// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));





// Set flash messages in res.locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.messages = req.flash();
    next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.use('/', userRouter);

app.use('/admin', adminRouter);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
