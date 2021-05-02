const Joi = require('joi')

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