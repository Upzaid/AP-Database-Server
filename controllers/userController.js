const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const validation = require('../validation').userValidation
const { response } = require('express')

// Get active user

exports.user = async (req, res) =>{
    res.json({user: req.user.username, permissions: req.user.permissions})
}

// User registration

exports.registration = async (req, res) =>{
    
    const errors = []
    
    // Validate inputs
    const {error} = validation.validate(req.body)
    if (error) errors.push(error.details[0].message)
    
    // Check if the user already exists
    const response = await User.findOne({username: req.body.username})
    
    if (response){
        errors.push('El usuario ya existe')
    } 
    
    if (errors.length > 0) return res.status(401).json(errors)

    // Encrypt password
    const encPassword = await bcrypt.hash(req.body.password, 10)

    // Insert user into the database
    const user = new User({
        username: req.body.username,
        password: encPassword,
        permissions: req.body.permissions
    })

    user.save()
    res.json('Usuario creado exitosamente')
}

// User log in

exports.log_in = async (req, res) =>{
    const errors = []
    
    // Query for user
    const user = await User.findOne({username: req.body.username})
    if (!user) return res.status(401).json('Nombre de usuario o contraseña invalidos')

    // Compare encrypted passwords
    const passwordCheck = await bcrypt.compare(req.body.password, user.password)
    
    // Sign and send JWT
    if (passwordCheck){
        return res.json(jwt.sign({
            username: user.username,
            permissions: user.permissions
        }, process.env.TOKEN_SECRET))
    }

    res.status(401).json('Nombre de usuario y/o contraseña no valido')
}

// Delete user

exports.delete = async (req, res) =>{
    // Make sure the user exists
    const user = await User.findOne({username: req.body.username})
    
    // Delete
    if (user) {
        user.deleteOne({username: req.body.username})
        return res.json('Usuario borrado exitosamente')
    }
    
    res.status(400).json('Usuario no existe')
}