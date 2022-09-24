const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan');

const api = require('./routes/api')

const app = express()

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('combined'))//logging

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))//localiza los archivos estaticos

app.use('/v1', api)

app.get('/*', (req, res) => {//el la pagina / muestra la pagina de react desde index.html
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app//se exporta app para usarlo en test