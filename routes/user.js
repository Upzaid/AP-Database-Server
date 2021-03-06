const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const user_controller = require('../controllers/userController')

// Get user data
router.get('/active', tokenAuthentication, user_controller.user)  

// List of users
router.get('/list', tokenAuthentication, validation.adminValidation, user_controller.list)

// Register user
router.post('/register', tokenAuthentication, validation.adminValidation, user_controller.registration)

// User login
router.post('/login', user_controller.log_in)

// TODO User delete
router.delete('/delete', tokenAuthentication, validation.adminValidation, user_controller.delete)

module.exports = router