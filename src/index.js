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
// const compression = require('compression')
const port = 3000

// const cors = require('cors')
const app = express()       //create express object
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
const sqlorm = require('./sql_orm')
/*
jwt_check
route_parser
route_guard
run_query
*/

//app.use ? for grid js site
app.get('/', (req, res) => {
    res.send('Hello World!')
})

//app.use ? for grid
// app.get('/data/:schema_name/:table_name/', (req, res) => {
//     /*
//     Select string
//     */
//     let x = req.params.schema_name + ' ' + req.params.table_name + ' ' + req.params.crud_type
//     res.send(x)
// })

app.get('/data/:schema_name/:table_name/', sqlorm.GetSelectRoute )


app.post('/data/:schema_name/:table_name/:crud_type', (req, res) => {
    try{
        let x = req.params.schema_name + ' ' + req.params.table_name + ' ' + req.params.crud_type
        //req.body
        res.send(x)
    } catch (e) {
        //output_payload
        res.send(e)
    }
})

//for json configurations.
app.get('/grid/:project_name/:table_name/', (req, res) => {
    /*
    Select string
    */
    try{
        req.params.crud_type = "SELECT ALL ROWS"
        let x = req.params.project_name + ' ' + req.params.table_name
        res.send(x)
    } catch (e) {

    }

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})