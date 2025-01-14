const isLogin = async (req, res, next) => {
    try {
        if (req.session.isAdmin) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/admin');
    }
};

const isLoggedOut = async (req, res, next) => {
    try {
        if (req.session.isAdmin) {
            res.redirect('/admin/home');
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
    isLoggedOut
};