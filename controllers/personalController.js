const tokenAuthentication = require('../tokenAuthentication')
const validation = require('../validation').personalValidation
const Personal = require('../models/personal')

// List of personal
exports.peronal_list = async (req, res) =>{
    const response = await Personal.find().sort({clave: 1}) 

    res.json(response.map(personal =>{
        const {clave, nombres, primer_apellido, segundo_apellido, telefono, imss, fotografia, identificacion, fecha_inicio, fecha_termino, email} = personal
        return (
            {
                clave,
                nombres,
                primer_apellido,
                segundo_apellido,
                telefono,
                imss,
                fotografia,
                identificacion,
                fecha_inicio,
                fecha_termino,
                email
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
        return res.status(403).json(errors)
    }

    const {clave, nombres, primer_apellido, segundo_apellido, telefono, imss,
        fotografia, identificacion, fecha_inicio, fecha_termino, email} = req.body
    
    const personal = new Personal({
        clave,
        nombres,
        primer_apellido,
        segundo_apellido,
        telefono,
        imss,
        fotografia,
        identificacion,
        fecha_inicio,
        fecha_termino,
        email
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
    res.status(403.).json('Personal no encontrado')
}

// Edit personal

exports.personal_edit = async (req, res) =>{
    try {

        const {clave, nombres, primer_apellido, segundo_apellido, telefono, imss,
            fotografia, identificacion, fecha_inicio, fecha_termino, email} = req.body
        
        const response = await Personal.findOne({clave})
        
            if (response){

                const personal = new Personal({
                    clave,
                    nombres,
                    primer_apellido,
                    segundo_apellido,
                    telefono,
                    imss,
                    fotografia,
                    identificacion,
                    fecha_inicio,
                    fecha_termino,
                    email,
                    _id : response._id
                })
                
                await Personal.findByIdAndUpdate(response._id, personal, {useFindAndModify: false})
                return res.json('Personal actualizado exitosamente')
            }

    } catch (error) {
        return res.send(error)
    }
    res.status(403.).json('Personal no encontrado')
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

    res.send('Personal no encontrado')
}