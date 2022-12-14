const { 
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
 } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}


async function httpAddNewLaunch(req, res){
    const launch = req.body

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error: 'Faltan propiedades requeridas del lanzamiento'
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)){//date.valueOf() retorna unix time
        return res.status(400).json({
            error: 'Fecha invalida'
        })
    }

    await scheduleNewLaunch(launch)//muta las propiedades de launch
    return res.status(201).json(launch)
}


async function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id)
    const existsLaunch = await existsLaunchWithId(launchId)

    if(!existsLaunch){
        return res.status(404).json({
            error: 'Lanzamiento no encontrado'
        })
    }

    const aborted = abortLaunchById(launchId)

    if(!aborted){
        return res.status(400).json({
            error: 'Lanzamiento no abortado'
        })
    }

    return res.status(200).json({
        ok: true
    })
} 


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}