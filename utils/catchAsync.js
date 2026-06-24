// Esta función recibe tu controlador asíncrono y le añade un .catch(next) automático.
// Si ocurre un error en el await, Express lo enviará directamente al errorHandler.
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};