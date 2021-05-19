const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UnidadSchema = new Schema({
    clave:{type: Number, trim: true},
    motor:{type: String, trim: true},
    placas:{type: String, trim: true},
    modelo:{type: String, trim: true},
    niv:{type: String, trim: true},
    descripcion:{type: String, trim: true}
})

module.exports =  mongoose.model('Unidad', UnidadSchema)