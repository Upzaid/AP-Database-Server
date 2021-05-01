const env = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Route imports

// Initilize express

const app = express()

// Mongo Connection

const mongoDB = process.env.DB
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Database conenction successful'));

// Middleware
app.use(express.json())
app.use(cors())

// Routes

app.get('/', (req, res) => res.json('Conexion exitosa'))


app.listen(process.env.PORT || 5000, ()=> console.log(`Server running on port ${process.env.PORT || 5000}`))