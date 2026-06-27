require('dotenv').config(); // 1. Cargar variables de entorno
const express = require('express');
const path = require('path');
const session = require('express-session'); // Manejo de sesiones
const mongoose = require('mongoose'); // Requerido para enlazar el cliente de sesión
const { MongoStore } = require('connect-mongo'); // Extraemos la clase nativa v6
const conectarDB = require('./config/db');

// Importación de Rutas Modulares
const authRoutes = require('./routes/authRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const clientesRoutes = require('./routes/clientesRoutes'); 
const productosRoutes = require('./routes/productosRoutes'); 

// Importación de Middlewares Personalizados
const requestLogger = require('./middlewares/logger'); 
const errorHandler = require('./middlewares/errorHandler');
const { requerirAutenticacion, permitirRoles } = require('./middlewares/auth'); // <-- Sumamos permitirRoles

const app = express();
const PORT = process.env.PORT || 3000;

// Setup de la conexión asíncrona a MongoDB Atlas
conectarDB();

// Configuración del engine de vistas (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARES GLOBALES ---
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(requestLogger); 

// CONFIGURACIÓN DE EXPRESS-SESSION (Sintaxis estándar de connect-mongo v6 integrada a Mongoose)
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_super_segura_espiga',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(), // Enlace directo al pool de Mongoose Atlas
        ttl: 14 * 24 * 60 * 60 
    }),
    cookie: {
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// --- RUTAS PÚBLICAS ---
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.use('/', authRoutes);

// --- RUTAS PRIVADAS (PROTEGIDAS CON MIDDLEWARE DE AUTORIZACIÓN) ---
app.get('/inicio', requerirAutenticacion, (req, res) => {
    res.render('index', { 
        title: 'La Espiga de Oro - Sistema de Gestión',
        usuario: req.session.nombreUsuario 
    });
});

// Pedidos: Operaciones permitidas para Vendedores y Administradores
app.use('/pedidos', requerirAutenticacion, pedidosRoutes);

// Clientes y Productos: El ruteo interno se encarga de discriminar accesos con permitirRoles('administrador')
app.use('/clientes', requerirAutenticacion, clientesRoutes); 
app.use('/productos', requerirAutenticacion, productosRoutes); 

// --- CONTROL DE ERRORES Y EXCEPCIONES ---
app.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Error 404',
        mensaje: 'Error 404 - La página que estás buscando no existe en La Espiga de Oro.' 
    });
});

app.use(errorHandler);

// Inicio del servidor backend
app.listen(PORT, () => {
    console.log(`Servidor corriendo de forma segura en http://localhost:${PORT}`);
});


app.use((req, res, next) => {
    // Si el usuario no está logueado, lo mandas al login
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    // Si ya está logueado, le muestras una vista de "Página no encontrada" amigable
    res.status(404).render('404', { mensaje: 'La página no existe' });
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

module.exports = app; // <--- ESTO es lo que necesita Vercel