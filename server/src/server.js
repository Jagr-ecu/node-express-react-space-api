const http = require('http')

const app = require('./app')

const { loadPlanetData } = require('./models/planets.model')

const PORT = process.env.PORT || 1000

const server = http.createServer(app)

async function startServer(){
    await loadPlanetData()

    server.listen(PORT, () => {
        console.log('puerto en', PORT)
    })
} 

startServer()



