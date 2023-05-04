const express = require('express');
const router = express.Router();
const { register, login, logout, getLoggedInUser } = require('../controllers/user');
const authenticate = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/loggedin-user', authenticate, getLoggedInUser);

module.exports = router;