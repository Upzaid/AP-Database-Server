const validation = require('../validation').personalValidation
const Personal = require('../models/personal')

// List of personal
exports.peronal_list = async (req, res) =>{
    const response = await Personal.find().sort({clave: 1}) 

    res.json(response.map(personal =>{
        const {clave, rfc, nombres, primer_apellido, segundo_apellido, telefono, 
            imss, fotografia, identificacion, fecha_alta, fecha_baja, email, licencia} = personal
        return (
            {
                clave,
                rfc,
                nombres,
                primer_apellido,
                segundo_apellido,
                telefono,
                imss,
                fotografia,
                identificacion,
                fecha_alta,
                fecha_baja,
                email,
                licencia
            }
        )
    }))
}

// Create personal
exports.personal_create = async (req, res) =>{
    const errors =[]
    // Validate inputs
    const {error} = validation.validate(req.body)
    
    if (error) errors.push(error.details[0].message)
    
    // Check clave is not used
    response = await Personal.findOne({clave: req.body.clave})

    if (response){
        errors.push(`Clave de personal ${req.body.clave} esta asignada`)
    }
    if (errors.length > 0){
        return res.status(202).json(errors)
    }

    const {clave, rfc, nombres, primer_apellido, segundo_apellido, telefono, imss,
        fotografia, identificacion, fecha_alta, fecha_baja, email, licencia} = req.body
    
    const personal = new Personal({
        clave,
        rfc,
        nombres,
        primer_apellido,
        segundo_apellido,
        telefono,
        imss,
        fotografia,
        identificacion,
        fecha_alta,
        fecha_baja,
        email,
        licencia
    })

    // Add to database

    try {
        await personal.save()
        res.json("Personal añadido exitosamente")
    } catch (error) {
        res.status(500).send(error)
    }
}

// Delete personal

exports.personal_delete = async (req, res)=>{
    try {
        const response = await Personal.findOne({clave: req.body.clave})
        if (response){   
            await Personal.findByIdAndRemove(response.id, {useFindAndModify: false})
            return res.json('Pesonal borrado exitosamente')
        }

    } catch (error) {
       return res.send(error)
    }
    res.status(202).json('Personal no existe')
}

// Edit personal

exports.personal_edit = async (req, res) =>{
    try {
        const {clave, rfc, nombres, primer_apellido, segundo_apellido, telefono, imss,
            fotografia, identificacion, fecha_alta, fecha_baja, email, licencia} = req.body
        
        const response = await Personal.findOne({clave})
        
            if (response){

                const personal = new Personal({
                    clave,
                    rfc,
                    nombres,
                    primer_apellido,
                    segundo_apellido,
                    telefono,
                    imss,
                    fotografia,
                    identificacion,
                    fecha_alta,
                    fecha_baja,
                    email,
                    licencia,
                    _id : response._id
                })
                
                await Personal.findByIdAndUpdate(response._id, personal, {useFindAndModify: false})
                return res.json('Personal actualizado exitosamente')
            }

    } catch (error) {
        return res.status(500).send(error)
    }
    res.status(202).json('Personal no existe')
}

// Find Personal by clave

exports.personal_find = async (req, res) =>{
    try {
        const response = await Personal.findOne({clave: req.params.clave})
        if (response){
            return res.json(response)
        }
    } catch (error) {
        return res.send(error)
    }

    res.statu(202).json('Personal no existe')
}


// Get latest personal

exports.personal_latest = async (req, res) =>{
    try {
        const response = await Personal.findOne().sort({clave: -1})
        if (response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}