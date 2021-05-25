const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LiquidacionSchema = new Schema({
    folio: {type: Number},
    fecha_inicio: {type: Date},
    fecha_cierre: {type: Date},
    operador: {type: Schema.Types.ObjectId, ref:'Personal'},
    ordenes: [{type: Schema.Types.ObjectId, ref:'Orden'}],
    anticipos: [{type: Schema.Types.ObjectId, ref:'Anticipo'}],
    comprobacion: [{
        concepto: String,
        importe: Number
    }],
    importe: {type: Number}
})

module.exports =  mongoose.model('Liquidacion', LiquidacionSchema)