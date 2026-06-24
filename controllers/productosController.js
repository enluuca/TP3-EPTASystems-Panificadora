const Producto = require('../models/Producto');
const catchAsync = require('../utils/catchAsync');

// GET: Renderizar formulario de alta de producto
exports.getCrearProducto = (req, res) => {
    res.render('crearProducto', { title: 'Agregar Nuevo Producto' });
};

// POST: Procesar el formulario e insertar en MongoDB Atlas
exports.postCrearProducto = catchAsync(async (req, res, next) => {
    const { nombre, precio, categoria } = req.body;

    const nuevoProducto = new Producto({ nombre, precio, categoria });
    await nuevoProducto.save();

    // Redirigimos al catálogo para comprobar que impactó en la nube
    res.redirect('/productos');
});

// GET: Listar todos los productos del catálogo oficial
exports.getListarProductos = catchAsync(async (req, res, next) => {
    const productos = await Producto.find({});
    res.render('productos/listado', {
        title: 'Catálogo de Productos - La Espiga de Oro',
        usuario: req.session.nombreUsuario, // Mantenemos el nombre en el header
        productos: productos
    });
});