const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const personal_controller = require('../controllers/personalController')
const personal = require('../models/personal')

// List of personal
router.get('/list', tokenAuthentication, personal_controller.peronal_list)

// Add personal
router.post('/create', tokenAuthentication, validation.editValidation, personal_controller.personal_create)

// Delete Personal
router.delete('/delete', tokenAuthentication, validation.editValidation, personal_controller.personal_delete)

// Edit personal
router.put('/edit', tokenAuthentication, validation.editValidation, personal_controller.personal_edit)

// Find personal by clave
router.get('/find/:clave', tokenAuthentication, personal_controller.personal_find)

module.exports = router