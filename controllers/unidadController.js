const validation = require('../validation').unidadValidation
const Unidad = require('../models/unidad')

// Unidad list
exports.unidad_list = async (req, res) =>{
    try {
        const response = await Unidad.find()
        res.json(response.map(unidad =>{
            const {clave, motor, placas, modelo, niv, descripcion} = unidad
            return(
                {clave, motor, placas, modelo, niv, descripcion}
            )
        }))
    } catch (error) {
        res.status(500).send(error)
    }
}

// Create unidad
exports.unidad_create = async (req, res) =>{
    const errors = []
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check if clave is in use
    const response = await Unidad.findOne({clave: req.body.clave})
    if (response) errors.push('Clave de unidad ya existe')
    
    if (errors.length > 0) return res.status(202).json(errors)
    // Add to database
    try {
        const {clave, motor, placas, modelo, niv, descripcion} = req.body
        const unidad = new Unidad({
            clave,
            motor,
            placas,
            modelo,
            niv,
            descripcion
        })
        unidad.save()
        return res.json('Unidad añadida exitosamente')

    } catch (err) {
        return res.status(500).send(err)
    }
}

// Delete unidad
exports.unidad_delete = async (req, res) =>{
    try {
        const response = await Unidad.findOneAndDelete({clave: req.body.clave})
        if (response) return res.json('Unidad borrada exitosamente')
    } catch (error) {
        return res.status(500).sned(error)
    }
    res.status(202).json('Unidad no existe')
}

// Edit unidad
exports.unidad_edit = async (req, res) =>{
    const response = await Unidad.findOne({clave: req.body.clave})
    if(response){
        try {
            const {clave, motor, placas, modelo, niv, descripcion} = req.body
            const unidad = new Unidad ({
                clave,
                motor,
                placas,
                modelo,
                niv,
                descripcion,
                _id: response._id
            })
            await Unidad.findByIdAndUpdate(response.id, unidad, {useFindAndModify: false})
            return res.json('Unidad actulizada exitosamente')
            
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    res.status(202).json('Unidad no existe')
}

// Find unidad by clave
exports.unidad_find = async (req, res) =>{
    try {
        const response = await Unidad.findOne({clave: req.params.clave})
        if (response){
            return res.json(response)
        }
    } catch (error) {
        return res.send(error)
    }

    res.status(202).json('Unidad no existe')
}