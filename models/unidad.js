const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UnidadSchema = new Schema({
    motor:{type: String, trim: true},
    placas:{type: String, trim: true}, 
})

module.exports =  mongoose.model('Unidad', UnidadSchema)