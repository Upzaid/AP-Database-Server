const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ClienteSchema = new Schema({
    razon_social: {type: String, trim: true},    
    rfc: {type: String, trim: true},    
    direccion: {type: String, trim: true},    
    telefono: {type: String, trim: true},    
})

module.exports =  mongoose.model('Cliente', ClienteSchema)