const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LiquidacionSchema = new Schema({
    folio: {type: Number},
    operador: {type: Schema.Types.ObjectId, ref:'Personal'},
    ordenes: [{type: Schema.Types.ObjectId, ref:'Orden'}],
    anticipos: [{type: Schema.Types.ObjectId, ref:'Orden'}],
})

module.exports =  mongoose.model('Liquidacion', LiquidacionSchema)