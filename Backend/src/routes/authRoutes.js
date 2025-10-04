const express = require('express');
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me', auth(), authController.me);

module.exports = router;
