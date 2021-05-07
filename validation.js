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

    ruta: Joi.string(),
    origen: Joi.string(),
    tipo_servicio: Joi.string(),
    destino_agencia: Joi.string(),
    observaciones: Joi.string(),

    consignatario: Joi.string(),
    naviera: Joi.number().integer(),
    contenedor: Joi.string(),
    tamano: Joi.string(),
    sello: Joi.string(),
    booking: Joi.string(),
    peso: Joi.number(),

    operador: Joi.number().integer(),
    unidad: Joi.number().integer(),

    flete: Joi.number(),
    maniobra: Joi.number(),
    almacenaje: Joi.number(),
    flete_falso: Joi.number(),
    reexpedicion: Joi.number(),
    dif_kilometraje: Joi.number(),
    subtotal: Joi.number(),
    iva: Joi.number(),
    retencion: Joi.number(),
    total: Joi.number(),

    estatus: Joi.string(),
})