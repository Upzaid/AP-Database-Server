const validation = require('../validation').unidadValidation
const Unidad = require('../models/unidad')
const Mantenimiento = require('../models/mantenimiento')
const Orden = require('../models/orden')

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
    const errors =[]
    let unidadID

    // Check if unidad exists and get id
    try {
        const unidad = await Unidad.findOne({clave: req.body.clave})
        if(!unidad) {
            errors.push('Uniadad no existe')
        }else {
            unidadID = unidad.id
        }
    } catch (error) {
        return res.status(500).send(error)
    }

    // Check if unidad is in mantenimiento and/or orden
    try {
        const mantenimiento = await Mantenimiento.findOne({unidad: unidadID})
        if (mantenimiento) errors.push(`Unidad en Orden de Mantenimiento ${mantenimiento.folio}`)
    } catch (error) {
        return res.status(500).send(error)
    }

    try {
        const orden = await Orden.findOne({unidad: unidadID})
        if (orden) errors.push(`Unidad en Orden ${orden.serie}-${orden.folio}`)
    } catch (error) {
        return res.status(500).send(error)
    }

    if (errors.length > 0) return res.status(202).json(errors)

    try {
        const response = await Unidad.findByIdAndDelete(unidadID)
        
        if(response) res.json('Unidad eliminada exitosamente')
    } catch (error) {
        return res.status(500).send(error)
    }

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

// Search unidad
exports.search = async (req, res) =>{
    const {field, data} = req.query
    
    const query = {
        [field.replace(' ', '_').toLowerCase()] : data
    }
    
    try {
        res.json(await Unidad.find(query))
    } catch (error) {
        res.status(500).send(error)
    }
}