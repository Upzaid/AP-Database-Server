const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const unidad_controller = require('../controllers/unidadController')


// List of unidades
router.get('/list', tokenAuthentication, unidad_controller.unidad_list)

// Create unidad
router.post('/create', tokenAuthentication, validation.editValidation, unidad_controller.unidad_create)

// Delete unidad
router.delete('/delete', tokenAuthentication, validation.editValidation, unidad_controller.unidad_delete)

// Edit unidad
router.put('/edit', tokenAuthentication, validation.editValidation, unidad_controller.unidad_edit)

// Find unidad by clave
router.get('/find/:clave', tokenAuthentication, unidad_controller.unidad_find)

module.exports = router