const Factura = require('../models/factura')
const Orden = require('../models/orden')
const Cliente = require('../models/cliente')
const validation = require('../validation').facturaValidation
const cliente = require('../models/cliente')
const factura = require('../models/factura')

// List of facturas
module.exports.factura_list = async (req, res) =>{
    try {
        res.json(await Factura.find().sort({folio: -1}))
    } catch (error) {
        res.status(500).send(error)
    }
}

// Create factura
module.exports.factura_create = async (req, res) =>{
    const errors =[]

    const {serie, folio, fecha, receptor, ordenes, total} = req.body
    
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check receptor (cliente) exists and get id
    try {
        const cliente = await Cliente.findOne({clave: receptor})    
        if (!cliente) errors.push('Receptor no existe')
    } catch (error) {
        res.status(500).send(error)
    }

    // Check ordenes exists and get id
    const ordenesIDs = await Promise.all(ordenes.map(async orden =>{
        try {
            const ordenCheck = await Orden.findOne({serie: orden.serie, folio: orden.folio})
            if (ordenCheck) {
                return ordenCheck.id
            }else {
                errors.push(`Orden ${orden.serie}-${orden.folio} no existe`)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }))
    
    // Check each orden is not in another factura
    ordenesIDs.forEach(async id =>{
        try {
            ordenCheck = await Factura.findOne({ordenes: id})
            if (ordenCheck){
                errors.push(`Orden en la factura ${ordenCheck.serie}-${ordenCheck.folio}`)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    })

    // Check folio and serie are not in use
    const response = await Factura.findOne({serie, folio})
    if (response) errors.push(`Serie y folio asignado`)

    if (errors.length > 0) return res.status(202).json(errors)

    // Save into database
    try {
        const factura = new Factura({
            serie,
            folio,
            fecha,
            receptor: cliente.id,
            ordenes: ordenesIDs,
            total
        })

        await factura.save()
        res.json('Factura creada exitosamente')

    } catch (error) {
        res.status(500).send(error)
    }
}

// Delete factura
module.exports.factura_delete = async (req, res) =>{
    console.log('HOLA');
    try {
        const response = await Factura.findOneAndDelete({serie: req.body.serie, folio: req.body.folio})
        if (response) return res.json('Factura eliminada exitosamente')
    } catch (error) {
        res.status(500).send(error)
    }
    res.status(202).json('Factura no existe')
}

// Edit factura
module.exports.factura_edit = async (req, res) =>{
    const errors =[]

    const {serie, folio, fecha, receptor, ordenes, total} = req.body
    
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check factura exists
    try {
        const factura = await Factura.findOne({serie, folio})
        if (factura){
            facturaID = factura.id
        }else {
            errors.push (`Factura ${serie}-${folio} no existe`)
        }
    } catch (error) {
        res.status(500).send(error)
    }

    // Check receptor (cliente) exists and get id
    try {
        const cliente = await Cliente.findOne({clave: receptor})  
        if (!cliente){
            errors.push('Receptor no existe')
        } else{
            clienteID = cliente.id
        }
            
    } catch (error) {
        res.status(500).send(error)
    }

    // Check ordenes exists and get id
    const ordenesIDs = await Promise.all(ordenes.map(async orden =>{
        try {
            const ordenCheck = await Orden.findOne({serie: orden.serie, folio: orden.folio})
            if (ordenCheck) {
                return ordenCheck.id
            }else {
                errors.push(`Orden ${orden.serie}-${orden.folio} no existe`)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }))
    
    // Check ordenes are not on a different factura
    await Promise.all(ordenesIDs.map(async id =>{
            const ordenCheck = await Factura.findOne({ordenes: id})
            if(ordenCheck){
                if(ordenCheck.id !== facturaID){
                    errors.push(`Orden asignada a la Factura ${ordenCheck.serie}-${ordenCheck.folio}`)
                }
            }
    }))

    if(errors.length > 0) return res.json(errors)
    
    // Save into database
    try {
        const newFactura = new Factura({
            fecha,
            serie,
            folio,
            receptor: clienteID,
            ordenes: ordenesIDs,
            total,
            _id: facturaID
        })
        
        await Factura.findByIdAndUpdate(facturaID, newFactura, {useFindAndModify: false})
        res.json('Factura actualizada exitosamente')
    } catch (error) {
        res.status(500).send(error)
    }
}

// Find latest factura
module.exports.factura_latest = async (req, res) =>{
    try {
        res.json(await Factura.findOne().sort({folio: -1}))
    } catch (error) {
        res.status(500).send(error)
    }
}

// Find factura by folio
module.exports.factura_find = async (req, res) =>{
    try {
        res.json(await Factura.findOne({serie: req.params.serie, folio: req.params.folio}).populate('ordenes'))
    } catch (error) {
        res.status(500).send(error)
    }
}