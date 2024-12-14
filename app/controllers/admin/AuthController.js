const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { isEmailTaken, authValidate } = require('../../validation/admin/AuthValidation');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

exports.showRegister = async (req, res) => {
    try {
        res.locals.layout = 'layouts/auth';
        res.render('admin/auth/register');
    } catch (error) {
        
    }
}

exports.register = async (req, res) => {
    try {
        const validationErrors = await authValidate(req.body);
        if (validationErrors && Object.keys(validationErrors).length > 0) {
            return res.status(400).json({
                success: false, message: 'Validation failed', error: validationErrors
            });
        }

        /* if (await isEmailTaken(req.body.email)) {
            return res.status(400).json({
                success: false, message: 'User already exists', error: { email: 'User with this email already exists' }
            });
        } */

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        await newUser.save();
        res.json({
            success: true, message: 'Registration successful!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false, message: 'Server error',
        });
    }
};


exports.showLogin = async (req, res) => {
    try {
        res.locals.layout = 'layouts/auth';
        res.render('admin/auth/login');
    } catch (error) {
        
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: { 
                    email: !email ? 'Email is required.' : undefined,
                    password: !password ? 'Password is required.' : undefined 
                } 
            });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });
        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/admin/profile');
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.logout = async(req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/admin/login');
    } catch (error) {
        
    }
}

exports.profile = async(req, res) => {
    logger.log(req.body);
    if (!req.user) {
        return res.redirect('/admin/login');
    }
    res.render('admin/profile', {
        layout: 'layouts/admin'
    });
}