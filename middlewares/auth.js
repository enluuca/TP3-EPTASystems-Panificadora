// Middleware básico: Verifica si el usuario inició sesión
exports.requerirAutenticacion = (req, res, next) => {
    if (!req.session.usuarioId) {
        return res.redirect('/login');
    }
    next();
};

// NUEVO Middleware: Permite el acceso solo a ciertos roles
exports.permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        // Si no hay sesión o el rol del usuario no está en la lista de permitidos
        if (!req.session.rolUsuario || !rolesPermitidos.includes(req.session.rolUsuario)) {
            return res.status(403).render('error', {
                title: 'Acceso Denegado',
                mensaje: 'No tenés permisos suficientes (rango de Administrador) para realizar esta acción en La Espiga de Oro.'
            });
        }
        next(); // Tiene el rol, continúa a la ruta
    };
};