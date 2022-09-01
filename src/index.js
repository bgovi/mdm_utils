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

const express = require('express')
const bodyParser = require("body-parser")
const compression = require('compression')
const port = 3000

const cors = require('cors')
const app = express()       //create express object
app.use(compression() )     //compresses and decompress data being sent back and forth
app.use(bodyParser.json({limit: '1mb'}))  //converts data to json objects for downstream processing

//SetHttps['forwardHttps'](app)
//initialize passport and routes
//PasspportOauth(app)
// testing route always adds user id
//app.use('/', AuthCheck['authCheck'])
// LoadDatabaseRoutes
//LoadRoutes(app)
//StaticRoutes(express, app , cors)

app.use(cors({
    origin: '*'
}));


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


app.get('/data/:schema_name/:table_name/', sqlorm.GetSelectRoute )


app.post('/data/:schema_name/:table_name/:crud_type', sqlorm.SqlOrmRoute )
//all_route here

//for json configurations.
app.get('/grid/:project_name/:table_name/', async (req, res) => {
    /*
    Select string
    */
    try{
        let pn = req.params.project_name
        let tn = req.params.table_name
        let wx = [
            {'column_name': 'project_name', 'value': pn, 'operator': '=' },
            {'column_name': 'table_name',   'value': tn, 'operator': '=' },
        ]
        let config = await sqlorm.GridConfiguration(wx)
        res.send(config)
    } catch (e) {

    }

})

app.get('/route_guard/:schema_name/:table_name/:id', async (req, res) => {
    /*
    Select string
    */
    try{
        let schema_name = req.params.schema_name
        let table_name  = req.params.table_name
        let id = req.params.id

        let wx = [{'column_name': 'id', 'value': id, 'operator': '=' }]

        let vx = await sqlorm.RouteGuard(schema_name, table_name, wx)

        console.log(vx)
        res.send(vx)
    } catch (e) {

    }

})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})