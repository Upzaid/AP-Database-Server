const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FacturaSchema = new Schema({
    serie: {type: Schema.Types.ObjectId},
    folio: {type: Number},
    receptor: {type: Schema.Types.ObjectId},
    importe: {type: Number},
})

module.exports =  mongoose.model('Factura', LiquidacionSchema)