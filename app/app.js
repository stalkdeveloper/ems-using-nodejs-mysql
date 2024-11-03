require('../app/logs/logger');
const express = require('express');
const connect = require('../app/dbConnect');
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(ejsLayouts);

const apiRoutes = require('../app/routes/api/ApiRoute');
app.use('/api', apiRoutes);

/* const adminRoutes = require('../app/routes/AdminRoute');
app.use('/admin', adminRoutes); */

const authRoutes = require('../app/routes/admin/AuthRoute');

app.use('/admin', authRoutes);

app.use('/admin', (req, res, next) => {
    res.locals.layout = 'layouts/admin';
    next();
});

app.use('/', (req, res, next) => {
    res.locals.layout = 'layouts/auth';
    next();
});

app.get('/', async (req, res) => {
    try {
        await res.render('index');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = { app, connect };
