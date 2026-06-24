const Usuario = require('../models/Usuario');
const catchAsync = require('../utils/catchAsync'); // Importar el wrapper

// GET: Renderizar vista de registro (Síncrono, no cambia)
exports.getRegistro = (req, res) => {
    res.render('registro', { title: 'Registro de Usuario' });
};

// GET: Renderizar vista de login (Síncrono, no cambia)
exports.getLogin = (req, res) => {
    
    res.render('login', { title: 'Iniciar Sesión' });
};

// POST: Procesar el registro (ALTA) - Enuelto en catchAsync
exports.postRegistrar = catchAsync(async (req, res, next) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        // Creamos un error operativo con código 400
        const error = new Error('Todos los campos son obligatorios para el registro.');
        error.statusCode = 400;
        return next(error); // Pasamos el error al manejador global
    }

    // Instanciamos el modelo y guardamos la contraseña
    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save(); // Si esto falla (ej: email duplicado), catchAsync lo atrapa solo

    res.redirect('/login');
});

// POST: Procesar el login (LECTURA SIMPLE) - Enuelto en catchAsync
exports.postLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Buscamos al usuario solo por su email
    const usuario = await Usuario.findOne({ email: email });

    // 2. Si no existe el email o la contraseña hasheada no coincide
    if (!usuario || !(await usuario.compararPassword(password))) {
        return res.status(401).render('login', { 
            title: 'Iniciar Sesión', 
            error: 'Credenciales inválidas. El usuario o la contraseña no coinciden.' 
        });
    }

    // 3. Si es correcto, guardamos su ID y Nombre en la sesión del servidor
    req.session.usuarioId = usuario._id;
    req.session.nombreUsuario = usuario.nombre;

    // 4. Redirigimos al tablero principal
    res.redirect('/inicio');
});

// POST: Procesar el login
exports.postLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email: email });

    if (!usuario || !(await usuario.compararPassword(password))) {
        return res.status(401).render('login', { 
            title: 'Iniciar Sesión', 
            error: 'Credenciales inválidas. El usuario o la contraseña no coinciden.' 
        });
    }

    // Guardamos ID, Nombre Y ROL en la sesión
    req.session.usuarioId = usuario._id;
    req.session.nombreUsuario = usuario.nombre;
    req.session.rolUsuario = usuario.rol; // <-- NUEVA LÍNEA CLAVE

    res.redirect('/inicio');
});