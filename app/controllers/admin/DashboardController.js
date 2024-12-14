const User = require('../../models/User');

exports.dashboard = async (req, res) => {
    try {
        res.render('admin/dashboard');
    } catch (err) {
        res.status(500).send('Server error');
    }
};