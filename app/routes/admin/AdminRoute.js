const express = require("express");
const userController = require('../../controllers/admin/UserController');
const dashboardController = require('../../controllers/admin/DashboardController');
const authController = require('../../controllers/admin/AuthController');
const { isAuthenticated } = require('../../middleware/AuthMiddleware');
const router = express.Router();

/* after login */
router.use(isAuthenticated);
router.get('/dashboard', dashboardController.dashboard);
router.get('/profile', authController.profile);

module.exports = router;