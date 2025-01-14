const User = require('../model/User')
const bcrypt = require('bcrypt')

const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (error) {
        throw new Error('Password hashing failed: ' + error.message)
    }
}

const loadLogin = async (req, res) => {
    try {
        if (req.session.isAdmin) {
            return res.redirect('/admin/home')
        }
        return res.render('admin/adminLogin', { 
            title: "Admin Login", 
            message: req.flash('error') || '' 
        })
    } catch (error) {
        console.error('Error loading login page:', error.message)
        req.flash('error', 'An error occurred. Please try again.')
        return res.redirect('/admin')
    }
}

const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            req.flash('error', 'All fields are required')
            return res.redirect('/admin')
        }

        const admin = await User.findOne({ email, isAdmin: true })
        
        if (!admin) {
            req.flash('error', 'Invalid credentials or not an admin')
            return res.redirect('/admin')
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        
        if (!isMatch) {
            req.flash('error', 'Invalid password')
            return res.redirect('/admin')
        }

        req.session.isAdmin = true
        req.session.adminData = {
            id: admin._id,
            name: admin.name,
            email: admin.email
        }

        return res.redirect('/admin/home')

    } catch (error) {
        console.error('Login error:', error.message)
        req.flash('error', 'An error occurred during login')
        return res.redirect('/admin')
    }
}

const loadHome = async (req, res) => {
    try {
        if (!req.session.isAdmin) {
            return res.redirect('/admin');
        }

        const users = await User.find({ isAdmin: false }).select('-password');
        
        return res.render('admin/adminHome', {
            title: 'Admin Dashboard',
            users,
            admin: req.session.adminData,
            message: req.flash('success') || req.flash('error')
        });
    } catch (error) {
        console.error('Dashboard error:', error.message);
        req.flash('error', 'Error loading dashboard');
        return res.redirect('/admin');
    }
}

const loadCreateUser = async (req, res) => {
    try {
        if (!req.session.isAdmin) {
            return res.redirect('/admin')
        }
        return res.render('admin/createUser', {
            title: 'Create User',
            message: req.flash('error') || ''
        })
    } catch (error) {
        console.error('Error loading create user page:', error.message)
        req.flash('error', 'Error loading create user page')
        return res.redirect('/admin/home')
    }
}

const createUser = async (req, res) => {
    try {
        if (!req.session.isAdmin) {
            return res.redirect('/admin')
        }

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            req.flash('error', 'All fields are required')
            return res.redirect('/admin/create-user')
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            req.flash('error', 'Email already registered')
            return res.redirect('/admin/create-user')
        }

        const hashedPassword = await securePassword(password)
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        })

        await newUser.save()
        req.flash('success', 'User created successfully')
        return res.redirect('/admin/home')

    } catch (error) {
        console.error('Error creating user:', error.message)
        req.flash('error', 'Error creating user')
        return res.redirect('/admin/create-user')
    }
}

const loadEdit = async (req, res) => {
    try {
        if (!req.session.isAdmin) {
            return res.redirect('/admin')
        }

        const user = await User.findById(req.params.id).select('-password')
        
        if (!user) {
            req.flash('error', 'User not found')
            return res.redirect('/admin/home')
        }

        return res.render('admin/editUser', {
            title: 'Edit User',
            user,
            message: req.flash('error') || ''
        })

    } catch (error) {
        console.error('Error loading edit page:', error.message)
        req.flash('error', 'Error loading edit page')
        return res.redirect('/admin/home')
    }
}

const editUser = async (req, res) => {
    try {
        if (!req.session.isAdmin) {
            return res.redirect('/admin')
        }

        const { id, name, email } = req.body

        if (!name || !email) {
            req.flash('error', 'All fields are required')
            return res.redirect(`/admin/edit/${id}`)
        }

        await User.findByIdAndUpdate(id, { name, email })
        req.flash('success', 'User updated successfully')
        return res.redirect('/admin/home')

    } catch (error) {
        console.error('Error updating user:', error.message)
        req.flash('error', 'Error updating user')
        return res.redirect('/admin/home')
    }
}

const deleteUser = async (req, res) => {
    try {
        if (!req.session.isAdmin) {
            return res.redirect('/admin')
        }

        const userId = req.query.id
        await User.findByIdAndDelete(userId)
        
        req.flash('success', 'User deleted successfully')
        return res.redirect('/admin/home')

    } catch (error) {
        console.error('Error deleting user:', error.message)
        req.flash('error', 'Error deleting user')
        return res.redirect('/admin/home')
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy()
        return res.redirect('/admin')
    } catch (error) {
        console.error('Logout error:', error.message)
        return res.redirect('/admin/home')
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadHome,
    loadCreateUser,
    createUser,
    loadEdit,
    editUser,
    deleteUser,
    logout
}