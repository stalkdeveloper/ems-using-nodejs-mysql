const express = require("express");
const userController = require('../../controllers/api/UserController');
const router = express.Router();

router.get('/users', userController.index);
router.post('/store', userController.store);
router.get('/user/:id', userController.edit);
router.put('/user/:id', userController.update);
router.delete('user/:id', userController.delete);
router.delete('users/', userController.deleteAll);

module.exports = router;