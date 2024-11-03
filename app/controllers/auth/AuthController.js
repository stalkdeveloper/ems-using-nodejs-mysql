const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

exports.showRegister = async(req, res) => {
    res.render('admin/auth/register');
}

exports.register = async(req, res) => {
    if(!req.body){
        
    }
    res.render('admin/auth/login');
}