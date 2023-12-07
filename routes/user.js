var express = require('express');
var router = express.Router();
var userController = require('../controller/user')

// ------------- signup api----------------------
router.post('/signup', userController.signUp)

// ------------- login api----------------------
router.post('/login', userController.login)

module.exports = router;
