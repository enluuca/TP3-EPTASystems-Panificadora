const requestLogger = (req, res, next) => {
    const inicio = Date.now();

    // Cuando la petición termine, se ejecuta este evento
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        const fecha = new Date().toLocaleString();
        
        console.log(`[${fecha}] ${req.method} ${req.originalUrl} - Estado: ${res.statusCode} (${duracion}ms)`);
    });

    next(); 
};

module.exports = requestLogger;