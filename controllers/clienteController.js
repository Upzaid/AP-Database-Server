const validation = require('../validation').navieraValidation
const Cliente = require('../models/cliente')

// List of clientes

exports.cliente_list = async (req, res) =>{
    
    const response = await Cliente.find().sort({razon_social: 1}) 

    return res.json(response.map(cliente =>{
        const {clave, razon_social, rfc, domicilio, telefono} = cliente
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

// Create a cliente

exports.cliente_create = async (req, res) =>{
    
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) return res.status(202).json(error.details[0].message)

    // Verify clave is not already used
    
    const response = await Cliente.findOne({clave: req.body.clave})
    if (!response){
        const {clave, razon_social, rfc, domicilio, telefono} = req.body
        
        const cliente = new Cliente({
            clave,
            razon_social,
            rfc,
            domicilio,
            telefono
        })
        cliente.save()
        return res.json('Cliente creado exitosamente')
    }
    res.status(202).json(`La clave de cliente ${req.body.clave} esta asignada`)
}

// Delete cliente
exports.cliente_delete = async (req, res) =>{
    
    const response = await Cliente.findOne({clave: req.body.clave}, {useFindAndModify: false})
    
    if (response) {
        await Cliente.findByIdAndRemove(response.id)
        return res.json('Cliente borrada exitosamente')
    }

    res.status(202).json('Cliente no existe')
}

// Edit cliente
exports.cliente_edit = async (req, res) =>{
    const response = await Cliente.findOne({clave: req.body.clave})
    
    if (response) {
        const {clave, razon_social, rfc, domicilio, telefono} = req.body
       
        const cliente = new Cliente({
            clave,
            razon_social,
            rfc,
            domicilio,
            telefono,
            _id: response.id
        })
        await Cliente.findByIdAndUpdate(response.id, cliente, {useFindAndModify: false})
        return res.json('Cliente actulizada exitosamente')
    }

    res.status(202).json('Cliente no existe')
}

// Find cliente by clave
exports.cliente_find = async (req, res) =>{
    try {
        const response = await Cliente.findOne({clave: req.params.clave})
        if (response){
            return res.json(response)
        }
    } catch (error) {
        return res.send(error)
    }

    res.statu(202).json('Cliente no encontrado')
}

// Get latest cliente
exports.cliente_latest = async (req, res) =>{
    try {
        const response = await Cliente.findOne().sort({clave: -1})
        if (response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}