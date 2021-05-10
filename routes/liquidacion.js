const express = require('express')
const router = express.Router()

const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const liquidacion_controller = require('../controllers/liquidacionController')

// List of all liquidaciones
router.get('/list', tokenAuthentication, liquidacion_controller.liquidacion_list)

// Add liquidacion
router.post('/create', tokenAuthentication, validation.editValidation, liquidacion_controller.liquidacion_create)

// Delete liquidacion
router.delete('/delete', tokenAuthentication, validation.editValidation, liquidacion_controller.liquidacion_delete)

// Update liquidacion
router.put('/edit', tokenAuthentication, validation.editValidation, liquidacion_controller.liquidacion_edit)

// Find liquidacion by folio
router.get('/find/:folio', tokenAuthentication, liquidacion_controller.liquidacion_find)

// Find latest liquidacion
router.get('/latest', tokenAuthentication, liquidacion_controller.liquidacion_latest)

module.exports = router