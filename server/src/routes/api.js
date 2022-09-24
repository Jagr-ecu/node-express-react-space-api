const express = require('express')

const launchesRouter = require("./launches/launches.router")
const planetsRouter = require("./planets/planets.router")

const api = express.Router();

app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

module.exports = api