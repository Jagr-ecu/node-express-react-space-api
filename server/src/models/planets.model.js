const fs = require('fs')
const path = require('path')
const { parse } =  require("csv-parse");

const habitablePlanets = []

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
            .on('data', (data) =>{
                if (isHabitable(data)){
                    habitablePlanets.push(data)
                }
            })
            .on('error', (err) => {
                console.log(error)
                reject(err)
            })
            .on('end', () => {
                console.log(`Existen ${habitablePlanets.length} planetas habitables`)
                resolve()
            })
    })
}


module.exports = {
    planets: habitablePlanets,
    loadPlanetData
}