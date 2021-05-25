const Joi = require('joi')

exports.adminValidation =  (req, res, next)=>{
    try {
        if (req.user.permissions == 'admin'){
            return next()
        }
    } catch (error) {
        res.status(500).json(error)
    }
    res.status(403).json('Acceso no autorizado')
}

exports.editValidation =  (req, res, next)=>{
    try {
        if (req.user.permissions == ('admin' || 'editor')){
            return next()
        }
    } catch (error) {
        res.status(500).json(error)
    }
    res.status(403).json('Acceso no autorizado')
}
    
exports.userValidation = Joi.object({
    username: Joi.string().min(4).required().messages({
        'string.empty': 'Nombre de usuario requerido',
        'string.min': 'Nombre de usuario debe contener un minimo de 4 caracteres',
        
    }),
    password: Joi.string().min(4).required().messages({
        'string.empty': 'Contraseña requerida',
        'string.min': 'Contraseña debe contener un minimo de 4 caracteres'
    }),
    permissions: Joi.string().required()
})

exports.navieraValidation = Joi.object({
    clave: Joi.number().required().integer().min(1),
    razon_social: Joi.string().required(),
    rfc: Joi.string().required(),
    domicilio: Joi.string().allow(''),
    telefono: Joi.string().allow('')
})

exports.personalValidation = Joi.object({
    clave: Joi.number().required().integer(),
    nombres: Joi.string().required(),
    primer_apellido: Joi.string().required(),
    segundo_apellido: Joi.string().required(),
    imss: Joi.string().allow(''),
    telefono: Joi.string().allow(''),
    licencia: Joi.string().allow(''),
    fotografia: Joi.binary(),
    identificacion: Joi.string().allow(''),
    fecha_alta: Joi.date().allow(''),
    fecha_baja: Joi.date().allow(''),
    email: Joi.string().allow(''),
    rfc: Joi.string().allow('')
})

exports.anticipoValidation = Joi.object({
    serie: Joi.string().required(),
    folio: Joi.number().required().integer(),
    personal: Joi.number().required().integer(),
    fecha: Joi.date(),
    concepto: Joi.string().required(),
    importe: Joi.number().required()
})

exports.unidadValidation = Joi.object({
    clave: Joi.number().required().integer(),
    motor: Joi.string().required(),
    placas: Joi.string().required(),
    modelo: Joi.string().required(),
    niv: Joi.string().required(),
    descripcion: Joi.string(),
})

exports.ordenValidation = Joi.object({
    serie: Joi.string().required(),
    folio: Joi.number().required().integer(),
    fecha: Joi.date().required(),

    ruta: Joi.string().allow(''),
    origen: Joi.string().allow(''),
    tipo_servicio: Joi.string().allow(''),
    destino_agencia: Joi.string().allow(''),
    observaciones: Joi.string().allow(''),

    consignatario: Joi.number().integer(),
    naviera: Joi.number().integer(),
    contenedor: Joi.string().required(),
    tamano: Joi.string(),
    sello: Joi.string(),
    booking: Joi.string(),
    peso: Joi.number(),

    operador: Joi.number().integer(),
    unidad: Joi.number().integer(),

    flete: Joi.number().allow(''),
    maniobra: Joi.number().allow(''),
    almacenaje: Joi.number().allow(''),
    flete_falso: Joi.number().allow(''),
    reexpedicion: Joi.number().allow(''),
    dif_kilometraje: Joi.number().allow(''),
    subtotal: Joi.number().allow(''),
    iva: Joi.number().allow(''),
    retencion: Joi.number().allow(''),
    total: Joi.number().allow(''),

    estatus: Joi.string(),
    comision: Joi.number().allow(''),
})

// Liquidacion
const anticipo = Joi.object().keys({
    serie: Joi.string().required(),
    folio: Joi.number().required().integer(),
})

const orden = Joi.object().keys({
    serie: Joi.string().required(),
    folio: Joi.number().required().integer(),
})

const comprobacion = Joi.object().keys({
    concepto: Joi.string().required(),
    importe: Joi.number().required(),
})

exports.liquidacionValidation = Joi.object({
    folio: Joi.number().required().integer(),
    fecha_inicio: Joi.date().required(),
    fecha_cierre: Joi.date().required(),
    operador: Joi.number().required().integer(),
    importe: Joi.number().required(),
    anticipos: Joi.array().items(anticipo),
    ordenes: Joi.array().items(orden),
    comprobacion: Joi.array().items(comprobacion),
})

// Mantenimiento

exports.mantenimientoValidation = Joi.object({
    folio: Joi.number().required().integer(),
    fecha_inicio: Joi.date().required(),
    fecha_cierre: Joi.date().allow(''),
    unidad: Joi.number().required(),
    costo: Joi.number().allow(''),
    ubicacion: Joi.string().allow(''),
    descripcion: Joi.string().allow(''),
})

// Factura
exports.facturaValidation = Joi.object({
    serie: Joi.string().required(),
    folio: Joi.number().required().integer(),
    fecha: Joi.date().required(),
    receptor: Joi.number().required().integer(),
    ordenes: Joi.array().items(orden),
    total: Joi.number().required(),
})