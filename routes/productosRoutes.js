const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { permitirRoles } = require('../middlewares/auth'); 

// Ahora sí, las rutas funcionarán porque el middleware ya está definido
router.get('/nuevo', permitirRoles('administrador'), productosController.getCrearProducto);
router.post('/nuevo', permitirRoles('administrador'), productosController.postCrearProducto);
router.get('/', productosController.getListarProductos);

module.exports = router;