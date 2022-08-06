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
const express = require('express')
const bodyParser = require("body-parser")
const compression = require('compression')


// const cors = require('cors')
// const app = express()       //create express object
// app.use(compression() )     //compresses and decompress data being sent back and forth
// app.use(bodyParser.json({limit: '1mb'}))  //converts data to json objects for downstream processing

//SetHttps['forwardHttps'](app)
//initialize passport and routes
//PasspportOauth(app)
// testing route always adds user id
//app.use('/', AuthCheck['authCheck'])
// LoadDatabaseRoutes
//LoadRoutes(app)
//StaticRoutes(express, app , cors)


//SetHttps['startHttpsServer'](app)

/*
jwt_check
route_parser
route_guard
run_query



*/