const fs = require('fs')
const path = require('path')
const { parse } =  require("csv-parse");

const planets = require('./planets.schema')

//condiciones hechas a partir de datos de la NASA
function isHabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

/**
 const promise = new Promise ((resolve, reject) => {
    resolve(42)
 })
 promise.then((result) => {})
 const result = await promise
 */

function loadPlanetData(){
    return new Promise((resolve, reject) =>{
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')) 
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) =>{
                if (isHabitable(data)){
                    savePlanet(data)
                }
            })
            .on('error', (err) => {
                console.log(error)
                reject(err)
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length
                console.log(`Existen ${countPlanetsFound} planetas habitables`)
                resolve()
            })
    })
}

async function getAllPlanets(){
    return await planets.find({})
}

async function savePlanet(planet){
    try{
        //insert + update = upsert
        await planets.updateOne({
            keplerName: planet.kepler_name,//filter
        }, {
            keplerName: planet.kepler_name//update
        }, {
            upsert: true//solo sera agregado si no existe
        })
    } catch(err) {
        console.log(`No se pudo guardar los planetas: ${err}`)
    }
}

module.exports = {
    getAllPlanets,
    loadPlanetData
}