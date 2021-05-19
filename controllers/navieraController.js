const validation = require('../validation').navieraValidation
const Naviera = require('../models/naviera')
const Orden = require('../models/orden')

// List of navieras

exports.naviera_list = async (req, res) =>{
    
    const response = await Naviera.find().sort({razon_social: 1}) 

    return res.json(response.map(naviera =>{
        const {clave, razon_social, rfc, domicilio, telefono} = naviera
        return (
            {
                clave,
                razon_social,
                rfc,
                domicilio,
                telefono
            }
        )
    }))
}

// Create a naviera

exports.naviera_create = async (req, res) =>{
    
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) return res.status(202).json(error.details[0].message)

    // Verify clave is not already used
    
    const response = await Naviera.findOne({clave: req.body.clave})
    if (!response){
        const {clave, razon_social, rfc, domicilio, telefono} = req.body
        
        const naviera = new Naviera({
            clave,
            razon_social,
            rfc,
            domicilio,
            telefono
        })
        naviera.save()
        return res.json('Naviera creada exitosamente')
    }
    res.status(403).json(`La clave de naviera ${req.body.clave} esta asignada`)
}

// Delete naviera
exports.naviera_delete = async (req, res) =>{
    const errors = []
    let navieraID

    // Check if naviera exists and get id
    try {
        const naviera = await Naviera.findOne({clave: req.body.clave})
        if (!naviera){
            errors.push('Naviera no existe')
        }else {
            navieraID = naviera.id
        }
    } catch (error) {
        return res.status(500).send(error)
    }
    
    // Check if naviera is in a orden
    try {
        const orden = await Orden.findOne({naviera: navieraID})
        if (orden) errors.push(`Naviera utilizada por la Orden ${orden.serie}-${orden.folio}`)
    } catch (error) {
        return res.status(500).send(error)
    }

    if(errors.length > 0) return res.status(202).json(errors)

    try {
        const response = await Naviera.findByIdAndDelete(navieraID)
        if(response) return res.json('Naviera eliminada exitosamente')
    } catch (error) {
        return res.status(500).send(error)
    }
}

// Edit naviera
exports.naviera_edit = async (req, res) =>{
    const response = await Naviera.findOne({clave: req.body.clave})
    
    if (response) {
        const {clave, razon_social, rfc, domicilio, telefono} = req.body
       
        const naviera = new Naviera({
            clave,
            razon_social,
            rfc,
            domicilio,
            telefono,
            _id: response.id
        })
        await Naviera.findByIdAndUpdate(response.id, naviera, {useFindAndModify: false})
        return res.json('Naviera actulizada exitosamente')
    }

    res.status(202).json('Naviera no existe')
}

// Find naviera by clave

exports.naviera_find = async (req, res) =>{
    try {
        const response = await Naviera.findOne({clave: req.params.clave})
        if (response){
            return res.json(response)
        }
    } catch (error) {
        return res.send(error)
    }

    res.status(202).json('Naviera no existe')
}

// Get latest naviera

exports.naviera_latest = async (req, res) =>{
    try {
        const response = await Naviera.findOne().sort({clave: -1})
        if (response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}