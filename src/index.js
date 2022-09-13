/*
This is the main script to run the Provider Effort Express Server. The order 
of the app.use is statement is important so only change if you know what you 
are doing.

Requirement:

Requires client/dist exisits if it does not got to the client directory and
build the program. Instructions in the client README.md

Start:

To start the server run:
NODE_ENV=production sudo node server.js

*/

// https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/

// require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser")
const compression = require('compression')

// console.log('env variables')
// console.log(process.env)

const cors = require('cors')
const app = express()       //create express object
app.use(compression() )     //compresses and decompress data being sent back and forth
app.use(bodyParser.json({limit: '1mb'}))  //converts data to json objects for downstream processing
app.use(bodyParser.urlencoded({ extended: false }))
// const path = require('path')
const cluster = require("cluster")
const os = require("os")
const CreateExpressRoutes = require('./CreateExpressRoutes')


let clusterWorkerSize = os.cpus().length
console.log('number of clusters')
console.log(clusterWorkerSize)
clusterWorkerSize = 1

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
    for (let i=0; i < clusterWorkerSize; i++) {
        cluster.fork()
    }

    cluster.on("exit", function(worker) {
        console.log("Worker", worker.id, " has exitted.")
    })
    } else {
        CreateExpressRoutes(app, express)
    }
} else {
    CreateExpressRoutes(app, express)
}
