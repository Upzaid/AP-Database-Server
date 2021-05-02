const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')

const user_controller = require('../controllers/userController')

router.get('/', tokenAuthentication, user_controller.user)  

router.post('/register', user_controller.registration)

router.post('/login', user_controller.log_in)

module.exports = router