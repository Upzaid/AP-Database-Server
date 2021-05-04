const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const anticipo_controller = require('../controllers/anticipoController')

// List of anticipos
router.get('/list', tokenAuthentication, anticipo_controller.anticipo_list)

// Create anticipo
router.post('/create', tokenAuthentication, validation.editValidation, anticipo_controller.anticipo_create)

// Delete anticipo
router.delete('/delete', tokenAuthentication, validation.editValidation, anticipo_controller.anticipo_delete)

// Edit anticipo
router.put('/edit', tokenAuthentication, validation.editValidation,  anticipo_controller.anticipo_edit)

// Find anticipo
router.get('/find/:serie/:folio', tokenAuthentication, anticipo_controller.anticipo_find)

module.exports = router