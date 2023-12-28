var express = require('express');
var router = express.Router();
var adminController = require('../controller/admin')

// ------------- signup api----------------------
router.post('/signup', adminController.signUp)

// ------------- login api----------------------
router.post('/login', adminController.login)

// ------------- All user api----------------------
router.get('/users', adminController.SECURE ,adminController.AllUser)

// ------------- delete user api----------------------
router.delete('/userdelete', adminController.SECURE, adminController.DeleteUser)

module.exports = router;
