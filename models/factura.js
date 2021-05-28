const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FacturaSchema = new Schema({
    serie: {type: String},
    folio: {type: Number},
    fecha: {type: Date},
    receptor: {type: Schema.Types.ObjectId, ref: 'Cliente'},
    ordenes: [{type: Schema.Types.ObjectId, ref: 'Orden'}],
    total: {type: Number},
    estatus: {type: String, enum: ['Pendiente', 'Pagada', 'Cancelada'], default:'Pendiente'}
})

module.exports =  mongoose.model('Factura', FacturaSchema)