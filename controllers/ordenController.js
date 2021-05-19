const validation = require('../validation').ordenValidation
const Orden = require('../models/orden')
const Naviera = require('../models/naviera')
const Personal = require('../models/personal')
const Unidad = require('../models/unidad')
const Cliente = require('../models/cliente')
const Factura = require('../models/factura')
const Liquidacion = require('../models/liquidacion')

// List of ordenes
exports.orden_list = async (req, res) =>{
    try {
        const response = await Orden.find().populate('naviera').populate('unidad').populate('operador').populate('consignatario').sort({folio: -1})
    
        res.json(response.map(orden=>{
            const {serie, folio, fecha, ruta, origen, tipo_servicio, destino_agencia, observaciones,
                consignatario, naviera, contenedor, tamano, sello, booking, peso, operador, unidad,
                flete, maniobra, almacenaje, flete_falso, reexpedicion, dif_kilometraje, subtotal, iva, retencion, estatus, total, comision} = orden
            
            return(
                {serie, folio, fecha, ruta, origen, tipo_servicio, destino_agencia, observaciones, comision,
                consignatario:{
                    clave: consignatario.clave,
                    razon_social: consignatario.razon_social
                },
                naviera:
                    {
                        clave: naviera.clave,
                        razon_social: naviera.razon_social,
                    }, 
                contenedor, tamano, sello, booking, peso,
                operador:
                    {
                        clave: operador.clave,
                        nombres: operador.nombres,
                        primer_apellido: operador.primer_apellido,
                        segundo_apellido: operador.segundo_apellido,
                    }, 
                unidad:
                {
                    clave: unidad.clave,
                    placas: unidad.placas
                },
                flete, maniobra, almacenaje, flete_falso, reexpedicion, dif_kilometraje, subtotal, iva, retencion, estatus, total
                }
            )
        }))
    } catch (error) {
        return res.status(500).send(error)
    }
}

// Create orden
exports.orden_create = async (req, res) =>{
    const errors = []
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check naviera clave exists
    try {
        const navieraQuery = await Naviera.findOne({clave: req.body.naviera})
        if (navieraQuery) {
            navieraID = navieraQuery.id
        } else {
            errors.push('Naviera no existe')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
    
    // Check operador exists
    try {
        const operadorQuery = await Personal.findOne({clave: req.body.operador})
        if (operadorQuery) {
            operadorID = operadorQuery.id
        } else{
            errors.push('Operador no existe')
        }
    
    } catch (error) {
        return res.status(500).send(error)
    }
    
     // Check cliente exists
     try {
        const clienteQuery = await Cliente.findOne({clave: req.body.consignatario})
        if (clienteQuery) {
            consignatarioID = clienteQuery.id
        } else {
            errors.push('Consignatario no existe')
        }
    } catch (error) {
        return res.status(500).send(error)
    }

    // Check unidad exists
    try {
        const unidadQuery = await Unidad.findOne({clave: req.body.unidad})
        if (unidadQuery) {
            unidadID = unidadQuery.id
        } else{
            errors.push('Unidad no existe')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
   
    // Check folio and serie
    const response = await Orden.findOne({serie: req.body.serie, folio: req.body.folio})
    if (response) errors.push('Serie y folio asignados')

    if (errors.length > 0) return res.status(202).json(errors)
    
    // 
    try {
        const {serie, folio, fecha, ruta, origen, tipo_servicio, destino_agencia, observaciones,
            contenedor, tamano, sello, booking, peso, flete, maniobra, almacenaje, 
            flete_falso, reexpedicion, dif_kilometraje, subtotal, iva, retencion, estatus, total, comision} = req.body
        
        const orden = new Orden(
            {serie, folio, fecha, ruta, origen, tipo_servicio, destino_agencia, observaciones,
            consignatario: consignatarioID, naviera: navieraID, contenedor, tamano, sello, booking, peso, operador: operadorID, unidad: unidadID,
            flete, maniobra, almacenaje, flete_falso, reexpedicion, dif_kilometraje, subtotal, iva, retencion, estatus, total, comision})
            
        orden.save()
        return res.json('Orden guardada exitosamente')
    } catch (error) {
        return res.status(500).send(error)
    }

}

// Delete orden
exports.orden_delete = async (req, res) =>{
    
    const errors =[]
    let ordenID

    // Find orden and get id
    try {
        const orden = await Orden.findOne({serie: req.body.serie, folio: req.body.folio})
        if (!orden){
            errors.push('Orden no existe')
        }else {
            ordenID = orden.id
        }
    } catch (error) {
        return res.status(500).send(error)
    }

    // Check if orden is usend in a factura and/or liquidacion

    try {
        const factura = await Factura.findOne({ordenes: ordenID})
        if (factura) errors.push(`Orden en la Factura ${factura.serie}-${factura.folio}`)
    } catch (error) {
        return res.status(500).send(error)
    }

    try {
        const liquidacion = await Liquidacion.findOne({ordenes: ordenID})
        if (liquidacion) errors.push(`Orden en la Liquidacion ${liquidacion.serie}-${liquidacion.folio}`)
    } catch (error) {
        return res.status(500).send(error)
    }
    
    if(errors.length > 0) return res.status(202).json(errors)

    try {
        const response = await Orden.findByIdAndDelete(ordenID)
        if (response) res.json('Orden eliminada exitosamente')
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

// Edit orden
exports.orden_edit = async (req, res) =>{
    const errors = []
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)

    // Check naviera clave exists
    try {
        const navieraQuery = await Naviera.findOne({clave: req.body.naviera})
        if (navieraQuery) {
            navieraID = navieraQuery.id
        } else {
            errors.push('Naviera no existe')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
    
    // Check operador exists
    try {
        const operadorQuery = await Personal.findOne({clave: req.body.operador})
        if (operadorQuery) {
            operadorID = operadorQuery.id
        } else{
            errors.push('Operador no existe')
        }
    
    } catch (error) {
        return res.status(500).send(error)
    }
    
    // Check unidad exists
    try {
        const unidadQuery = await Unidad.findOne({clave: req.body.unidad})
        if (unidadQuery) {
            unidadID = unidadQuery.id
        } else{
            errors.push('Unidad no existe')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
   
     // Check cliente exists
     try {
        const clienteQuery = await Cliente.findOne({clave: req.body.consignatario})
        if (clienteQuery) {
            consignatarioID = clienteQuery.id
        } else {
            errors.push('Consignatario no existente')
        }
    } catch (error) {
        return res.status(500).send(error)
    }

    // Check folio and serie
    const response = await Orden.findOne({serie: req.body.serie, folio: req.body.folio})
    if (!response) errors.push('Orden no existente')
    
    if (errors.length > 0) return res.status(202).json(errors)
    

    try {
        const {serie, folio, fecha, ruta, origen, tipo_servicio, destino_agencia, observaciones,
            contenedor, tamano, sello, booking, peso, flete, maniobra, almacenaje, 
            flete_falso, reexpedicion, dif_kilometraje, subtotal, iva, retencion, estatus, total, comision} = req.body
        
        const orden = new Orden(
            {_id: response.id,
            serie, folio, fecha, ruta, origen, tipo_servicio, destino_agencia, observaciones,
            consignatario: consignatarioID, 
            naviera: navieraID, contenedor, tamano, sello, booking, peso, 
            operador: operadorID, 
            unidad: unidadID,
            flete, maniobra, almacenaje, flete_falso, reexpedicion, dif_kilometraje, subtotal, iva, 
            retencion, estatus, total, comision})
            
        await Orden.findByIdAndUpdate(response.id, orden, {useFindAndModify: false})
        return res.json('Orden actualizada exitosamente')
    } catch (error) {
        return res.status(500).send(error)
    }

}

// Find orden by serie and folio
exports.orden_find = async (req, res) =>{
    try {
        const response = await Orden.findOne({serie: req.params.serie, folio: req.params.folio}).populate('naviera').populate('unidad').populate('operador').populate('consignatario')
        if(response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
    res.status(202).json('Orden no existe')
}

// Find latest orden
exports.orden_latest = async (req, res) =>{
    try {
        const response = await Orden.findOne().sort({folio: -1})
        if(response) return res.json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
}
