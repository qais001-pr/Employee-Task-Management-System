const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Register: create new employee user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

module.exports = router;
