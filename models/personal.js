const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PersonalSchema = new Schema({
    clave: {type: Number, trim: true},
    rfc: {type: String, trim: true},
    nombres: {type: String, trim: true},
    primer_apellido: {type: String, trim: true},    
    segundo_apellido: {type: String, trim: true},    
    telefono: {type: String, trim: true},    
    imss: {type: String, trim: true},    
    fotografia: {data: Buffer, contentType: String},    
    identifiacion: {type: String, trim: true},    
    fecha_alta: {type: Date},    
    fecha_baja: {type: Date},
    email: {type: String, trim: true},
    licencia: {type: String, trim: true},
    identificacion: {type: String, trim: true},
})

module.exports =  mongoose.model('Personal', PersonalSchema)