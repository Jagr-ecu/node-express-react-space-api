const http = require('http')
const mongoose = require('mongoose')

const app = require('./app')

const { loadPlanetData } = require('./models/planets.model')

const PORT = process.env.PORT || 1000

const MONGO_URL = 'mongodb+srv://admin_user:WBuTtnsUDnm8c0Kb@cluster1.vvqlt.mongodb.net/node-tutorial-nasa?retryWrites=true&w=majority'

const server = http.createServer(app)

mongoose.connection.once('open', () => {
    console.log('Conexion con mongodb hecha')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function startServer(){
    await mongoose.connect(MONGO_URL)
    
    await loadPlanetData()

    server.listen(PORT, () => {
        console.log('puerto en', PORT)
    })
} 

startServer()



