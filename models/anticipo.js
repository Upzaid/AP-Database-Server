const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AnticipoSchema = new Schema({
    operador: {type: Schema.Types.ObjectId, ref:'Personal'},
    fecha: {type: Date},
    concepto: {type: String},
    importe: {type:Number}

})

module.exports =  mongoose.model('Anticipo', AnticipoSchema)