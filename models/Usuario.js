const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { 
        type: String, 
        required: true, 
        enum: ['vendedor', 'administrador'], 
        default: 'vendedor' // Por defecto todos entran como vendedores
    }
}, { versionKey: false });

// Middleware "pre-save": Se ejecuta ANTES de guardar el documento en la base de datos
// Middleware "pre-save": Se ejecuta ANTES de guardar el documento en la base de datos
usuarioSchema.pre('save', async function() { // <-- Quitamos 'next' de los argumentos
    // Solo hasheamos la contraseña si fue modificada o es nueva
    if (!this.isModified('password')) return; // <-- Quitamos next()
    
    try {
        const salt = await bcrypt.genSalt(10); // Generamos la sal (costo 10)
        this.password = await bcrypt.hash(this.password, salt); // Hasheamos
        // <-- Quitamos el next() de acá, al terminar el try Mongoose sabe que finalizó
    } catch (error) {
        throw error; // <-- En funciones async de Mongoose, lanzar el error reemplaza a next(error)
    }
});

// Método personalizado para comparar contraseñas en el login
usuarioSchema.methods.compararPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);