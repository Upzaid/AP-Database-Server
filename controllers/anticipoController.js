const validation = require('../validation').anticipoValidation
const Anticipo = require('../models/anticipo')
const Personal = require('../models/personal')

// List of anticipos
exports.anticipo_list = async (req, res) =>{
    try {
        const response = await Anticipo.find().sort({serie: 1, folio: -1, fecha: -1}).populate('personal')
        
        res.json(response.map(anticipo =>{
            const {serie, folio, fecha, concepto, importe} = anticipo
            const {clave, nombres, primer_apellido, segundo_apellido} = anticipo.personal
            return(
                {
                    serie,
                    folio,
                    fecha,
                    concepto,
                    importe,
                    personal :{
                        clave,
                        nombres,
                        primer_apellido,
                        segundo_apellido
                    }
                }
            )
        }))
    } catch (error) {
        return res.status(500).send(error)
    }
}

// Create anticipo
exports.anticipo_create = async (req,res) =>{
    const errors =[]
    
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)
    
    // Check if serie and folio are not in use
    try {
        const response = await Anticipo.findOne({serie: req.body.serie, folio: req.body.folio})
        if (response) errors.push('Folio y serie ya asignados')

    } catch (error) {
        return res.status(500).send(error)
    }
    
    // Find personal id
    try {
        const {id} = await Personal.findOne({clave: req.body.personal})
        if (!id) errors.push(`Personal con clave ${req.body.clave} no existe`)

        if (errors.length > 0) return res.send(errors)
        // Save anticipo in database
        
        const {serie, folio, fecha, concepto, importe} = req.body
        
        const anticipo = new Anticipo({
            serie,
            folio,
            fecha,
            concepto,
            importe,
            personal: id
        })
    
        anticipo.save()
        return res.json('Anticipo creado exitosamente')

    } catch (error) {
        return res.status(500).send(error)
    }
}

// Delete anticipo
exports.anticipo_delete = async (req,res) =>{
    
    try {
        const response = await Anticipo.findOneAndDelete({serie: req.body.serie, folio: req.body.folio})
        if (response) return res.json('Anticipo borrado exitosamente')
        
    } catch (error) {
        return res.status(500).send(error)
    }
    return res.status(500).json('Anticipo no existente')
}

// Edit anticipo
exports.anticipo_edit = async (req,res) =>{
    try {
        // Find ID
        const response = await Anticipo.findOne({serie: req.body.serie, folio: req.body.folio})
        
        if (!response) return res.status(500).json('Anticipo no existente')
        
        const {serie, folio, personal, fecha , concepto, importe} = req.body
        
        // Find personal id
        const personalID = await Personal.findOne({clave: personal})
        if (!personalID) return res.status(500).json('Personal no existente')

        const anticipo = new Anticipo({
            serie,
            folio,
            fecha,
            concepto,
            importe,
            personal : personalID.id,
            _id: response.id
        })

        await Anticipo.findByIdAndUpdate(response.id, anticipo, {useFindAndModify: false})
        return res.json('Anticipo actulizada exitosamente')

    } catch (error) {
        return res.status(500).send(error)
    }
}

// Find anticipo by folio and serie
exports.anticipo_find = async (req,res) =>{
    try {
        const response = await Anticipo.findOne({serie: req.params.serie, folio: req.params.folio})
        if (response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
    res.status(500).json('Anticipo no existente')
}