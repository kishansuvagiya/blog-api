var express = require('express');
var router = express.Router();
var userController = require('../controller/user')

// ------------- signup api----------------------
router.post('/signup', userController.signUp)

// ------------- login api----------------------
router.post('/login', userController.login)

// ------------- Forgot password api----------------------
router.post('/forgot-password', userController.ForgotPassword)

// ------------- Verify OTP api----------------------
router.post('/verify-otp', userController.verifyOTP)

module.exports = router;
