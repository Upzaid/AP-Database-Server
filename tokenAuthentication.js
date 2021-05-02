const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const token = req.header('auth-token')
    
    if (!token) return res.status(401).json('Acceso denegado')
    
    try {
        req.user = jwt.verify(token, process.env.TOKEN_SECRET)
        next()
         
    } catch (error) {
         res.status(400).json('Credenciales no validas')
    }
}