const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrdenSchema = new Schema({
    // Datos Generales
    serie: {type: String},
    folio: {type: Number},
    fecha: {type: Date},
   
    // Datos del Servicio
    ruta: {type: String},
    tipo_servicio: {type: String, enum: []},
    destino_agencia: {type: String}, // Catalago de agencias???
    observaciones: {type: String},
    
    // Datos de la Carga
    consignatario: {type: String},
    naviera: {type: Schema.Types.ObjectId, ref:'Naviera'},
    contenedor: {type: Number},
    tamano: {type: String, enum:["40' HC, 20' DC"]},
    sello: {type: String},
    booking: {type: String},
    
    // Datos del Operador
    operador: {type: Schema.Types.ObjectId, ref:'Naviera'},
    unidad: {type: Schema.Types.ObjectId, ref:'Unidad'}, // Viene con las placas
    
    // Datos de Facturacion
    flete: {type: Number},
    maniobra: {type: Number},
    flete: {type: Number},
    almacenaje: {type: Number},
    flete_falso: {type: Number},
    reexpedicion: {type: Number},
    dif_kilometraje: {type: Number},
    subtotal: {type: Number},
    iva: {type: Number},
    retencion: {type: Number},
    total: {type: Number},
})

module.exports =  mongoose.model('Orden', OrdenSchema)