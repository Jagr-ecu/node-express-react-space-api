const launches = new Map()

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

launches.set(launch.flightNumber, launch)

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

function getAllLaunches(){
    return Array.from(launches.values())
}

module.exports = {
    getAllLaunches,
    addNewLaunch
}