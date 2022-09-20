const launches = require("./launches.schema");
const planets = require("./planets.schema");

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration",
  rocket: "Explorer I",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["JAGR", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launches.findOne({
    flightNumber: launchId
  })
}

async function getLatestFlightNumber(){
    const latestLaunch = await launches.findOne().sort('-flightNumber')//con '-variable' sortea por desc

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

async function getAllLaunches() {
  return await launches.find(
    {},
    {
      "_id": 0,
      __v: 0,
    }
  );
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No fue encontrado el planeta del objeto");
  }

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["JAGR", "NASA"],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
  //retorna metadata de la actualizacion
  const aborted = await launches.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false
  })

  return aborted.modifiedCount === 1
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
