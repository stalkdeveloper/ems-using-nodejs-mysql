const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/admin/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.redirect('/admin/login');
        }

        req.user = user;
        res.locals.isAuthenticated = true;
        res.locals.userInfo = user; 
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.redirect('/login?error=authentication');
    }
}

module.exports = {
    isAuthenticated
};