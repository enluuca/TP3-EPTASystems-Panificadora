const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController'); // <-- OJO ACÁ: Que no diga productosController
const { permitirRoles } = require('../middlewares/auth');

// 1. Formulario de alta de clientes
router.get('/nuevo', permitirRoles('administrador'), clientesController.getCrearCliente);

// 2. Procesar alta de clientes
router.post('/nuevo', permitirRoles('administrador'), clientesController.postCrearCliente);

// 3. Listado de clientes
router.get('/', clientesController.getListarClientes);

module.exports = router;