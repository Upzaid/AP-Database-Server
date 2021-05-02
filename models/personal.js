const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PersonalSchema = new Schema({
    nombre: {type: String, trim: true},
    primer_apellido: {type: String, trim: true},    
    segundo_apellido: {type: String, trim: true},    
    telefono: {type: String, trim: true},    
    imss: {type: String, trim: true},    
    fotografia: {data: Buffer, contentType: String, trim: true},    
    identifiacion: {type: String, trim: true},    
    fecha_inicio: {type: Date},    
    fecha_termino: {type: Date},
    email: {type: String, trim: true}
})

module.exports =  mongoose.model('Personal', PersonalSchema)