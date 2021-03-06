const express = require('express')
const router = express.Router()
const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation')

const cliente_controller = require('../controllers/clienteController')

// List of all clientes
router.get('/list', tokenAuthentication,  cliente_controller.cliente_list)

// Add  cliente
router.post('/create', tokenAuthentication, validation.editValidation,  cliente_controller.cliente_create)

// Delete  cliente
router.delete('/delete', tokenAuthentication, validation.editValidation,  cliente_controller.cliente_delete)

// Update  cliente
router.put('/edit', tokenAuthentication, validation.editValidation,  cliente_controller.cliente_edit)

// Find cliente by clave
router.get('/find/:clave', tokenAuthentication, cliente_controller.cliente_find)

// Find latest cliente
router.get('/latest', tokenAuthentication, cliente_controller.cliente_latest)

// Search anticipo
router.get('/search', tokenAuthentication, cliente_controller.search)

module.exports = router