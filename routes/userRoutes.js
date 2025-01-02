const express = require('express');
const user = require('../controllers/user');
const router = express.Router();

// Routes
router.post('/register', user.register);
router.post('/login', user.login);
router.get('/logout', user.logout);

module.exports = router;