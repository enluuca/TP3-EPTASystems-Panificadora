const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

router.get('/nuevo', productosController.getCrearProducto);
router.post('/nuevo', productosController.postCrearProducto);
router.get('/', productosController.getListarProductos);

module.exports = router;