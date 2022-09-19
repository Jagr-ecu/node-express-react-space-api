const launches =require('./launches.schema')

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration',
    rocket: 'Explorer I',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['JAGR', 'NASA'],
    upcoming: true,
    success: true
}

//launches.set(launch.flightNumber, launch)

function getAllLaunches(){
    return Array.from(launches.values())
}

function addNewLaunch(launch){
    latestFlightNumber++
    launches.set(
        latestFlightNumber, 
        Object.assign(launch, {            
        flightNumber: latestFlightNumber,
        customers: ['JAGR', 'NASA'],
        upcoming: true,
        success: true,
    })
    )
}
    
function existLaunchWithId(launchId){
    return launches.has(launchId)
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
        
    return aborted
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById
}