const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NavieraSchema = new Schema({
    clave: {type: Number, trim: true},    
    razon_social: {type: String, trim: true},    
    rfc: {type: String, trim: true},    
    direccion: {type: String, trim: true},    
    telefono: {type: String, trim: true},    
})

module.exports =  mongoose.model('Naviera', NavieraSchema)