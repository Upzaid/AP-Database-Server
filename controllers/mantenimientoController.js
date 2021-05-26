const Mantenimiento = require('../models/mantenimiento')
const Unidad = require('../models/unidad')
const validation = require('../validation').mantenimientoValidation

// Mantenimiento list
module.exports.mantenimiento_list = async (req, res) =>{
    try {
        res.json(await Mantenimiento.find().populate('unidad').sort({folio: -1}))
    } catch (error) {
        res.status(500).send(error)
    }
}

// Create mantenimiento

module.exports.mantenimiento_create = async (req, res) =>{
    const errors = []

    const {folio, fecha_inicio, fecha_cierre, unidad, costo, ubicacion, descripcion} = req.body

    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check folio is not in use
    const response = await Mantenimiento.findOne({folio})
    if (response) errors.push('Folio asignado')

    // Check uniudad exists
    const unidadCheck = await Unidad.findOne({clave: unidad})
    if (!unidadCheck) errors.push('Unidad no existe')

    if (errors.length > 0) return res.status(202).json(errors)

    // Save into database
    const mantenimiento = new Mantenimiento({
        folio,
        fecha_inicio,
        fecha_cierre,
        unidad: unidadCheck.id,
        costo,
        ubicacion, 
        descripcion
    })

    try {
        await mantenimiento.save()
        res.json('Orden de mantenimiento guardada exitosamente')

    } catch (error) {
        res.status(500).send(error)
    }
}

// Edit mantenimiento order
module.exports.mantenimiento_edit = async (req, res)=>{
    const errors = []
    const {folio, fecha_inicio, fecha_cierre, unidad, costo, ubicacion, descripcion} = req.body

    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)
    
    // Check orden de mantenimiento exists
    try {
        const response = await Mantenimiento.findOne({folio})
        if (!response){
            errors.push('Orden de mantenimiento no existe')
        }else {
            mantenimientoID = response.id
        }
    } catch (error) {
        res.status(500).send(error)
    }

    // Check unidad exists
    try {
        const unidadCheck = await Unidad.findOne({clave: unidad})
        if (!unidadCheck) {
            errors.push('Unidad no existe')
        }else{
            unidadID = unidadCheck.id 
        }
    } catch (error) {
        res.status(500).send(error)
    }

    if (errors.length > 0) return res.status(202).json(errors)

    // Save into database
    const mantenimiento = new Mantenimiento({
        folio,
        fecha_inicio,
        fecha_cierre,
        unidad: unidadID,
        costo,
        ubicacion,
        descripcion,
        _id: mantenimientoID
    })

    try {
        await Mantenimiento.findByIdAndUpdate(mantenimientoID, mantenimiento, {useFindAndModify: false})
        res.json('Orden de mantenimiento actulizada exitosamente')
    } catch (error) {
        res.status(500).send(error)
    }
}

// Delete mantenimieto order
module.exports.mantenimiento_delete = async (req, res)=>{
    try {
        const response = await Mantenimiento.findOneAndDelete({folio: req.body.folio})
        if(response) return res.json('Orden de mantenimiento borrada exitosamente')
    } catch (error) {
        res.status(500).send(error)
    }
}

// Find latest mantenimiento order
module.exports.mantenimiento_latest = async (req, res)=>{
    try {
        res.json(await Mantenimiento.findOne().sort({folio: -1}).populate('unidad'))
    } catch (error) {
        res.status(500).send(error)
    }
}

// Find mantenimiento order by folio
module.exports.mantenimiento_find = async (req, res) =>{
    try {
        res.json(await Mantenimiento.findOne({folio: req.params.folio}).populate('unidad'))
    } catch (error) {
        res.status(500).send(error)
    }
}

// Search mantenimiento
exports.search = async (req, res) =>{
    const {field, data} = req.query
    
    const query = {
        [field.replace(' ', '_').toLowerCase()] : data
    }
    
    try {
        res.json(await Mantenimiento.find(query).populate('unidad'))
    } catch (error) {
        res.status(500).send(error)
    }
}