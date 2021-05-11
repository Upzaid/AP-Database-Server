const env = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Route imports
const userRouter = require('./routes/user')
const navieraRouter = require('./routes/naviera')
const clienteRouter = require('./routes/cliente')
const personalRouter = require('./routes/personal')
const anticipoRouter = require('./routes/anticipo')
const unidadRouter = require('./routes/unidad')
const ordenRouter = require('./routes/orden')
const liquidacionRouter = require('./routes/liquidacion')
const mantenimientoRouter = require('./routes/mantenimiento')

// Initilize express

const app = express()

// Mongo Connection

const mongoDB = process.env.DB
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Database connection successful'));

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.get('/', (req, res) => res.json('Conexion exitosa'))
app.use('/user', userRouter)
app.use('/naviera', navieraRouter)
app.use('/cliente', clienteRouter)
app.use('/personal', personalRouter)
app.use('/anticipo', anticipoRouter)
app.use('/unidad', unidadRouter)
app.use('/orden', ordenRouter)
app.use('/liquidacion', liquidacionRouter)
app.use('/mantenimiento', mantenimientoRouter)


app.listen(process.env.PORT || 5000, ()=> console.log(`Server running on port ${process.env.PORT || 5000}`))