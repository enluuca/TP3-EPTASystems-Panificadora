const Cliente = require('../models/Cliente');
const catchAsync = require('../utils/catchAsync');

// GET: Renderizar formulario de alta de cliente
exports.getCrearCliente = (req, res) => {
    res.render('crearCliente', { title: 'Registrar Nuevo Cliente' });
};

// POST: Procesar el formulario e insertar en MongoDB Atlas
exports.postCrearCliente = catchAsync(async (req, res, next) => {
    const { nombre, direccion, telefono } = req.body;

    // Instanciamos y guardamos usando el esquema validado
    const nuevoCliente = new Cliente({ nombre, direccion, telefono });
    await nuevoCliente.save();

    // Redirigimos al listado para verificar que se cargó correctamente en Atlas
    res.redirect('/clientes');
});

// GET: Listar todos los clientes extraídos de la nube
exports.getListarClientes = catchAsync(async (req, res, next) => {
    const clientes = await Cliente.find({});
    res.render('clientes/listado', {
        title: 'Gestión de Clientes - La Espiga de Oro',
        usuario: req.session.nombreUsuario, // Pasamos la sesión para el header
        clientes: clientes
    });
});