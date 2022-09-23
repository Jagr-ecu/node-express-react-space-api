const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://admin_user:WBuTtnsUDnm8c0Kb@cluster1.vvqlt.mongodb.net/node-tutorial-nasa?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('Conexion con mongodb hecha')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}