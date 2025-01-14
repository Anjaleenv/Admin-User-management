const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');
const adminAuth = require('../middleware/adminAuth');

adminRouter.use(express.json());
adminRouter.use(express.urlencoded({ extended: true }));

// Admin routes
adminRouter.get('/', adminAuth.isLoggedOut, adminController.loadLogin);
adminRouter.post('/', adminController.verifyLogin);

// Admin home 
adminRouter.get('/home', adminAuth.isLogin, adminController.loadHome);
adminRouter.get('/logout', adminAuth.isLogin, adminController.logout);

// User management routes
adminRouter.get('/create-user', adminAuth.isLogin, adminController.loadCreateUser);
adminRouter.post('/create-user', adminAuth.isLogin, adminController.createUser);

adminRouter.get('/edit/:id', adminAuth.isLogin, adminController.loadEdit);
adminRouter.post('/edit-user', adminAuth.isLogin, adminController.editUser);

adminRouter.get('/delete-user', adminAuth.isLogin, adminController.deleteUser);

module.exports = adminRouter;