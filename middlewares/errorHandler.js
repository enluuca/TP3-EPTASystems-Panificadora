const errorHandler = (err, req, res, next) => {
    // Si el error no tiene un código de estado HTTP asignado, por defecto es 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;
    
    // Loggear el error en la consola para el desarrollador
    console.error(`[Error Handler] Ocurrió un error: ${err.message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    // Responder al cliente de forma limpia y unificada
    // Como tu app usa Pug, renderizamos la vista de error centralizadamente
    res.status(statusCode).render('error', {
        title: `Error ${statusCode}`,
        mensaje: err.message || 'Ocurrió un error interno en el sistema de La Espiga de Oro.'
    });
};

module.exports = errorHandler;