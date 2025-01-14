const express = require('express');
const userRouter = express.Router();
const path = require('path');
const userController = require('../controller/userController');
const auth = require('../middleware/auth');

userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

userRouter.get('/register',auth.isLoggedOut, userController.getRegister);
userRouter.post('/register', userController.insertUser);
userRouter.get('/',auth.isLoggedOut, userController.loginLoad);
userRouter.get('/login', auth.isLoggedOut, userController.loginLoad);
userRouter.post('/login', userController.verifyLogin);
userRouter.get('/home', auth.isLogin, userController.loadHome);
userRouter.get('/logout', userController.userLogout);
userRouter.get('/contact',userController.contact)



module.exports = userRouter;



