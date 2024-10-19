const express = require('express');
const connect = require('../app/dbConnect');
const logger = require('../app/logs/logger');
require('dotenv').config();
const app = express();

app.use(express.json());

const apiRoutes = require('../app/routes/api/ApiRoute');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = { app, connect };
