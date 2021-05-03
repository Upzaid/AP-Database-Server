const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const naviera_controller = require('../controllers/navieraController')

// List of all navieras
router.get('/list', tokenAuthentication, naviera_controller.naviera_list)

// Add naviera
router.post('/create', tokenAuthentication, validation.editValidation, naviera_controller.naviera_create)

// Delete naviera
router.delete('/delete', tokenAuthentication, validation.editValidation, naviera_controller.naviera_delete)

// Update naviera
router.put('/edit', tokenAuthentication, validation.editValidation, naviera_controller.naviera_edit)

// Find naviera by clave
router.get('/find/:clave', tokenAuthentication, naviera_controller.naviera_find)

module.exports = router