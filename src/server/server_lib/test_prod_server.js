/*
This is the main script to run the Provider Effort Express Server. The order 
of the app.use is statement is important so only change if you know what you 
are doing.

Requirement:

Requires client/dist exisits if it does not got to the client directory and
build the program. Instructions in the client README.md

Requires database/providereffort.sqlite If the database is not avaialable follow
the database/README.md instruction on how to generate the initial database.

Start:

To start the server run:
NODE_ENV=production sudo node server.js

main thing for production???

add route guards

add https

add multicore


*/
const express = require('express')
const bodyParser = require("body-parser")
const compression = require('compression')
var LoadRoutes = require('./routes/LoadRoutes')
// const SetHttps = require('./login_auth/setHttps')
// const PasspportOauth = require('./login_auth/authentication')
// const AuthCheck = require('./login_auth/authCheck')
const StaticRoutes = require('./serveStaticFiles')
const cors = require('cors')
const app = express()       //create express object
app.use(compression() )     //compresses and decompress data being sent back and forth
app.use(bodyParser.json({limit: '1mb'}))  //converts data to json objects for downstream processing
const cluster = require("cluster")
const os = require("os")

function CreateExpressApp(app) {
    app.use('/', (req, res, next) => {
        req.body['user_id'] = 5
        next()
    })

    // LoadDatabaseRoutes
    LoadRoutes(app)
    StaticRoutes(express, app , cors)
    app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`))
}



const clusterWorkerSize = os.cpus().length

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
    for (let i=0; i < clusterWorkerSize; i++) {
        cluster.fork()
    }

    cluster.on("exit", function(worker) {
        console.log("Worker", worker.id, " has exitted.")
    })
    } else {
        CreateExpressApp(app)
    }
} else {
    CreateExpressApp(app)
}



// SetHttps['startHttpsServer'](app)