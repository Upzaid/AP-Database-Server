const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MantenimientoSchema = new Schema({
    folio: {type: Number},
    unidad: {type: Schema.Types.ObjectId, ref: 'Unidad'},
    descripcion: {type: String, trim: true},
})

module.exports =  mongoose.model('Mantenimiento', MantenimientoSchema)