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

// Find latest naviera
router.get('/latest', tokenAuthentication, naviera_controller.naviera_latest)

// Search naviera
router.get('/search', tokenAuthentication, naviera_controller.search)

module.exports = router