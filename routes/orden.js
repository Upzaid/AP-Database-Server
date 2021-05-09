const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const orden_controller = require('../controllers/ordenController')

// List of all ordenes
router.get('/list', tokenAuthentication, orden_controller.orden_list)

// Add orden
router.post('/create', tokenAuthentication, validation.editValidation, orden_controller.orden_create)

// Delete orden
router.delete('/delete', tokenAuthentication, validation.editValidation, orden_controller.orden_delete)

// Update orden
router.put('/edit', tokenAuthentication, validation.editValidation, orden_controller.orden_edit)

// Find orden by folio and serie
router.get('/find/:serie/:folio', tokenAuthentication, orden_controller.orden_find)

// Find latest orden
router.get('/latest', tokenAuthentication, orden_controller.orden_latest)

module.exports = router