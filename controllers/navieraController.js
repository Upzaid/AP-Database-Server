const validation = require('../validation').navieraValidation
const Naviera = require('../models/naviera')

// List of navieras

exports.naviera_list = async (req, res) =>{
    
    const response = await Naviera.find().sort({razon_social: 1}) 

    res.json(response.map(naviera =>{
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
    if (error) return res.status(403).json(error.details[0].message)

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
    
    const response = await Naviera.findOne({clave: req.body.clave}, {useFindAndModify: false})
    
    if (response) {
        await Naviera.findByIdAndRemove(response.id)
        return res.json('Naviera borrada exitosamente')
    }

    res.status(403).json('Naviera no existe')
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

    res.status(403).json('Naviera no existe')
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

    res.send('Naviera no encontrado')
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