const Liquidacion = require('../models/liquidacion')
const Personal = require('../models/personal')
const Orden = require('../models/orden')
const Anticipo = require('../models/anticipo')
const validation = require('../validation').liquidacionValidation

// Liquidacion list
module.exports.liquidacion_list = async (req, res) =>{
    try {
        const response = await Liquidacion.find().sort({folio: -1}).populate('ordenes').populate('anticipos').populate('operador')
        res.json(response)
    } catch (error) {
        res.statu(500).send(error)
    }
}

// Create liquidacion
module.exports.liquidacion_create = async (req, res) =>{
    const errors = []
    const {fecha, folio, operador, ordenes, anticipos, comprobacion} = req.body
    
    // Validate inputs

    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check operador exists
    try {
        const personal = await Personal.findOne({clave: operador})
        if (personal) {
            personalID = personal.id
        } else{
            errors.push('Operador inexistente')
        }
        
    } catch (error) {
        res.status(500).send(error)
    }
    
    // Check each anticipo exists if it does get its id
    const anticiposIDs = await Promise.all(anticipos.map(async anticipo =>{
        try {
            const anticipoCheck = await Anticipo.findOne({serie: anticipo.serie, folio:anticipo.folio})
            if (anticipoCheck){
                return anticipoCheck.id
            } else {
                errors.push(`Anticipo ${anticipo.serie}-${anticipo.folio} no existe`)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }))
    
    // Check each anticipo is not on another liquidacion
    anticiposIDs.forEach(async id => {
        const anticipoCheck = await Liquidacion.findOne({anticipos: id})
        if (anticipoCheck){
            errors.push(`Anticipo asignado a la liquidacion ${anticipoCheck.folio}`)
        }
    });
    
    // Check each orden exists if it does get its id
    const ordenesIDs = await Promise.all(ordenes.map(async orden =>{
        try {
            const ordenCheck = await Orden.findOne({serie: orden.serie, folio: orden.folio})
            if (ordenCheck){
                return ordenCheck.id
            } else {
                errors.push(`Orden ${orden.serie}-${orden.folio} no existe`)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }))

    // Check each orden is not in another liquidacion
    ordenesIDs.forEach(async id => {
        const ordenCheck = await Liquidacion.findOne({ordenes: id})
        if (ordenCheck){
            errors.push(`Orden asignada a la liquidacion ${ordenCheck.folio}`)
        }
    });

    // Check folio is not in use
    try {
        const response = await Liquidacion.findOne({folio: req.body.folio})
        if (response) errors.push('Numero de folio asignado')
    } catch (error) {
        res.status(500).send(error)
    }

    if (errors.length > 0) return res.status(202).json(errors)

    // Save into database
    try {
        const liquidacion = new Liquidacion({
            folio,
            fecha,
            operador: personalID,
            ordenes: ordenesIDs,
            anticipos: anticiposIDs,
            comprobacion
        })
        await liquidacion.save()
        res.json(`Liquidacion guardada exitosamente`)

    } catch (error) {
        res.status(500).send(error)
    } 
}

// Delete liquidacion
module.exports.liquidacion_delete = async (req, res) =>{

    // Check liquidacion exists

    try {
        const response = await Liquidacion.findOneAndDelete({folio: req.body.folio})
        if (response) return res.json(`Liquidacion borrada exitosamente`)
    } catch (error) {
        res.status(500).send(error)
    }
    res.status(202).json('Liquidacion no existe')
}

// Edit liquidacion
module.exports.liquidacion_edit = async (req, res) =>{
    const errors = []
    const {fecha, folio, operador, ordenes, anticipos, comprobacion} = req.body
    
    // Validate inputs

    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check operador exists
    try {
        const personal = await Personal.findOne({clave: operador})
        if (personal) {
            personalID = personal.id
        } else{
            errors.push('Operador inexistente')
        }
        
    } catch (error) {
        res.status(500).send(error)
    }
    
    // Get liquidacion ID
    try {
        const response = await Liquidacion.findOne({folio: folio})
        if (response) {
            liquidacionID = response.id
        }else{
            errors.push(`Liquidacion ${folio} no existe`)
        }
    } catch (error) {
        res.status(500).send(error)
    }

    // Check each anticipo exists if it does get its id
    const anticiposIDs = await Promise.all(anticipos.map(async anticipo =>{
        try {
            const anticipoCheck = await Anticipo.findOne({serie: anticipo.serie, folio:anticipo.folio})
            if (anticipoCheck){
                return anticipoCheck.id
            } else {
                errors.push(`Anticipo ${anticipo.serie}-${anticipo.folio} no existe`)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }))
    
    // Check each anticipo is not on a different liquidacion
    await Promise.all(anticiposIDs.map(async id => {
        const anticipoCheck = await Liquidacion.findOne({anticipos: id})
        if (anticipoCheck){
            if (anticipoCheck.id !== liquidacionID){
                errors.push(`Anticipo asignado a la liquidacion ${anticipoCheck.folio}`)
            }
        }
    }))
    
    // Check each orden exists if it does get its id
    const ordenesIDs = await Promise.all(ordenes.map(async orden =>{
        try {
            const ordenCheck = await Orden.findOne({serie: orden.serie, folio: orden.folio})
            if (ordenCheck){
                return ordenCheck.id
            } else {
                errors.push(`Orden ${orden.serie}-${orden.folio} no existe`)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }))

    // Check each orden is not on a different liquidacion
    await Promise.all(ordenesIDs.map(async id => {
        const ordenCheck = await Liquidacion.findOne({ordenes: id})
        if (ordenCheck){
            if(ordenCheck.id !== liquidacionID){
                errors.push(`Orden asignada a la liquidacion ${ordenCheck.folio}`)
            }
        }
    }))

    if (errors.length > 0) return res.status(202).json(errors)

    // Save into database
    try {
        const liquidacion = new Liquidacion({
            folio,
            fecha,
            operador: personalID,
            ordenes: ordenesIDs,
            anticipos: anticiposIDs,
            comprobacion,
            _id : liquidacionID
        })
        
        await Liquidacion.findByIdAndUpdate(liquidacionID, liquidacion, {useFindAndModify: false})
        res.json(`Liquidacion actualizada exitosamente`)

    } catch (error) {
        res.status(500).send(error)
    } 
}

// Find liquidacion by folio
module.exports.liquidacion_find = async (req, res) =>{
    try {
        const response = await Liquidacion.findO({serie: req.params.folio})
        res.json(response)
    } catch (error) {
        res.status(500).send(error)
    }
}

// Latest liquidacion
module.exports.liquidacion_latest = async (req, res) =>{
    try {
        const response = await Liquidacion.findOne({serie: req.params.serie}).sort({serie: -1})
        res.json(response)
    } catch (error) {
        res.status(500).send(error)
    }
}