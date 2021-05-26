const express = require('express')
const router = express.Router()

const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const mantenimiento_controller = require('../controllers/mantenimientoController')

// Get all mantenimiento documents
router.get('/list', tokenAuthentication, mantenimiento_controller.mantenimiento_list)

// Create mantenimiento order
router.post('/create', tokenAuthentication, validation.editValidation, mantenimiento_controller.mantenimiento_create)

// Delete mantenimiento order
router.delete('/delete', tokenAuthentication, validation.editValidation, mantenimiento_controller.mantenimiento_delete)

// Edit mantenimiento order
router.put('/edit', tokenAuthentication, validation.editValidation, mantenimiento_controller.mantenimiento_edit)

// Latest mantenimiento order
router.get('/latest', tokenAuthentication, mantenimiento_controller.mantenimiento_latest)

// Find mantenimiento order by folio
router.get('/find/:folio', tokenAuthentication, mantenimiento_controller.mantenimiento_find)

// Search mantenimiento
router.get('/search', tokenAuthentication, mantenimiento_controller.search)

module.exports = router