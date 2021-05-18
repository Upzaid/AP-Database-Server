const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrdenSchema = new Schema({
    // Datos de Control
    serie: {type: String},
    folio: {type: Number},
    fecha: {type: Date},
   
    // Datos del Servicio
    estatus: {type: String, enum: ["Activo", "Cancelado", "Concluido"], default:"Activo"},
    ruta: {type: String},
    origen: {type: String},
    tipo_servicio: {type: String},
    destino_agencia: {type: String},
    observaciones: {type: String},
    
    // Datos de la Carga
    consignatario: {type: Schema.Types.ObjectId, ref:'Cliente'},
    naviera: {type: Schema.Types.ObjectId, ref:'Naviera'},
    contenedor: {type: String},
    tamano: {type: String, enum:["40' HC", "20' DC"]},
    sello: {type: String},
    booking: {type: String},
    peso: {type: Number},
    
    // Datos del Operador
    operador: {type: Schema.Types.ObjectId, ref:'Personal'},
    unidad: {type: Schema.Types.ObjectId, ref:'Unidad'}, 
    
    // Datos de Facturacion
    flete: {type: Number},
    maniobra: {type: Number},
    almacenaje: {type: Number},
    flete_falso: {type: Number},
    reexpedicion: {type: Number},
    dif_kilometraje: {type: Number},
    subtotal: {type: Number},
    iva: {type: Number},
    retencion: {type: Number},
    total: {type: Number},
    
    comision: {type: Number}
})

module.exports =  mongoose.model('Orden', OrdenSchema)