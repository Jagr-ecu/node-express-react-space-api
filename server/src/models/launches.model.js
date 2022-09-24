const axios = require("axios");

const launches = require("./launches.schema");
const planets = require("./planets.schema");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100, //flight_number - nombre de variable en spacex api
  mission: "Kepler Exploration", //name
  rocket: "Explorer I", //rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", //no aplicable
  customer: ["JAGR", "NASA"], //payload.customers
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);

const SPACE_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  const response = await axios.post(SPACE_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      mission: launchDoc["name"],
      customers: customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };

    console.log(launch.flightNumber, launch.mission);

    await saveLaunch(launch);
  }
}


async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Datos de lanzamientos ya descargados");
  } else {
    console.log("descargando datos de lanzamientos");
    try {
      await populateLaunches();
    } catch (error) {
      console.log(error);
    }
  }
}


async function findLaunch(filter) {
  return await launches.findOne(filter);
}


async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}


async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber"); //con '-variable' sortea por desc

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}


async function getAllLaunches(skip, limit) {
  return await launches
    .find(
      {}, //no filtros
      { _id: 0, __v: 0,} //no envia estas variables que estan en mongodb por defecto
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}


async function saveLaunch(launch) {
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No fue encontrado el planeta del objeto");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["JAGR", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}


async function abortLaunchById(launchId) {
  //retorna metadata de la actualizacion
  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}


module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadLaunchesData,
};
