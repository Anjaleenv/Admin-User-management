const isLogin = (req, res, next) => {
    try {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/login');
    }
};

const isLogi = (req, res) => {
 res.send('user contact')
};


const isLoggedOut = (req, res, next) => {
    try {
        if (req.session.user) {
            res.redirect('/home');
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
        next();
    }
};

module.exports = {
    isLogin,
    isLoggedOut,
    isLogi
};