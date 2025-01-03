const express = require('express');
const user = require('../controllers/user');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Routes
router.post('/register', user.register);
router.post('/login', user.login);
router.get('/logout', user.logout);
router.get('/', verifyToken, user.getAllUsers);
module.exports = router;