const express = require('express')
const router = express.Router()

const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const factura_controller = require('../controllers/facturaController')

// Get all mantenimiento documents
router.get('/list', tokenAuthentication, factura_controller.factura_list)

// Create factura order
router.post('/create', tokenAuthentication, validation.editValidation, factura_controller.factura_create)

// Delete factura order
router.delete('/delete', tokenAuthentication, validation.editValidation, factura_controller.factura_delete)

// Edit factura order
router.put('/edit', tokenAuthentication, validation.editValidation, factura_controller.factura_edit)

// Latest factura order
router.get('/latest', tokenAuthentication, factura_controller.factura_latest)

// Find factura order by folio
router.get('/find/:serie/:folio', tokenAuthentication, factura_controller.factura_find)

// Search factura
router.get('/search', tokenAuthentication, factura_controller.search)

module.exports = router