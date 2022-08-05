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
const SetHttps = require('./login_auth/setHttps')
const PasspportOauth = require('./login_auth/authentication')
const AuthCheck = require('./login_auth/authCheck')
const StaticRoutes = require('./serveStaticFiles')



const cors = require('cors')

const app = express()       //create express object
app.use(compression() )     //compresses and decompress data being sent back and forth
app.use(bodyParser.json({limit: '1mb'}))  //converts data to json objects for downstream processing



SetHttps['forwardHttps'](app)

//initialize passport and routes
PasspportOauth(app)
// testing route always adds user id
app.use('/', AuthCheck['authCheck'])
// LoadDatabaseRoutes
LoadRoutes(app)
StaticRoutes(express, app , cors)
SetHttps['startHttpsServer'](app)

/*
jwt_check
route_parser
route_guard
run_query



*/