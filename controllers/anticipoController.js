const validation = require('../validation').anticipoValidation
const Anticipo = require('../models/anticipo')
const Personal = require('../models/personal')
const Liquidacion = require('../models/liquidacion')

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

        if (errors.length > 0) return res.status(202).json(errors)
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

    const errors =[]
    let anticipoID 
    // Check anticipo exists and get its id
    try {
        const anticipo = await Anticipo.findOne({serie: req.body.serie, folio:req.body.folio})
        if (!anticipo) {
            errors.push('Anticipo no existe')
        } else {
            anticipoID = anticipo.id
        }

    } catch (error) {
        return res.status(500).send(error)
    }

    // Check if there are liquidaicones anticipo
    try {
        const liquidacion = await Liquidacion.findOne({anticipos: anticipoID})
        if (liquidacion) errors.push(`Anticipo en la liquidacion ${liquidacion.folio}`)
    } catch (error) {
        return res.status(500).send(error)
    }

    if (errors.length > 0) return res.status(202).json(errors)

    try {
        const response = await Anticipo.findByIdAndDelete(anticipoID)
        if (response) return res.json('Anticipo borrado exitosamente')
        
    } catch (error) {
        return res.status(500).send(error)
    }
}

// Edit anticipo
exports.anticipo_edit = async (req, res) =>{

    try {
        const errors = []
        // Find ID
        const response = await Anticipo.findOne({serie: req.body.serie, folio: req.body.folio})
        
        if (!response) return res.status(202).json('Anticipo no existe')
        
        const {serie, folio, personal, fecha , concepto, importe} = req.body
        
        // Find personal id
        const personalID = await Personal.findOne({clave: personal})
        if (!personalID) return res.status(202).json('Personal no existe')

        
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
        const response = await Anticipo.findOne({serie: req.params.serie, folio: req.params.folio}).populate('personal')
        if (response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
    res.status(202).json('Anticipo no existe')
}

// Get latest anticipo

exports.anticipo_latest = async (req, res) =>{
    try {
        const response = await Anticipo.findOne().sort({serie: 1, folio: -1}).populate('personal')
        if (response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}

// Search Anticipo

exports.search = async (req, res) =>{
    const {field, data} = req.query
    
    const query = {
        [field.replace(' ', '_').toLowerCase()] : data
    }
    console.log(query)
    try {
        res.json(await Anticipo.find(query).populate('personal'))
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.date_range = async (req, res) =>{

    try {
        const response = await Anticipo.find({fecha: {$gte: req.query.start, $lte:req.query.end}}).populate('personal')
        res.json(response)
    } catch (error) {
        res.status(500).send(error)
    }
}
