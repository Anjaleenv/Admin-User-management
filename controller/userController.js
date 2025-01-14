const User = require('../model/User');
const bcrypt = require('bcrypt'); 

const getRegister = (req, res) => {
    res.render('register', { message: req.flash('error') });
};

const insertUser = async (req, res) => {
    const { name, email, password, cPassword } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name || !email || !password || !cPassword) {
        req.flash('error', 'All Fields are required');
        return res.redirect('/register');
    }


    if(!emailRegex.test(email)){
        req.flash('error', 'Enter Valid Email Address');
        return res.redirect('/register'); 
    }

    if (password !== cPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/register');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already in use');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while registering. Please try again.');
        res.redirect('/register');
    }
};

const loginLoad = (req, res) => {
    res.render('login', { message: req.flash('error') });
};

const verifyLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        };

        res.redirect('/home');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while logging in. Please try again.');
        res.redirect('/login');
    }
};

const loadHome = (req, res) => {
    if (req.session.user) {
        if(req.session.contact){
            return res.render('home', { user: req.session.user,contact:req.session.contact });
        }
       return res.render('home', { user: req.session.user,contact:null });
    } else {
        res.redirect('/login');
    }
};

const userLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
};

let contact=async (req,res)=>{
    if(req.session.user){
        req.session.contact=await User.findOne({email:req.session.user.email})
        res.redirect('/home')
    }else{
        res.redirect("/login")
    }
}

module.exports = {
    getRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
      contact
};
