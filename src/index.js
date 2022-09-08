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
require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser")
const compression = require('compression')
const port = 3000

// console.log('env variables')
// console.log(process.env)

const cors = require('cors')
const app = express()       //create express object
app.use(compression() )     //compresses and decompress data being sent back and forth
app.use(bodyParser.json({limit: '1mb'}))  //converts data to json objects for downstream processing
app.use(bodyParser.urlencoded({ extended: false }))
const path = require('path')

// const localAuth = require('./server_authentication/local_authentication')
// const azureAuth = require('./server_authentication/azure_authentication')


//SetHttps['startHttpsServer'](app)
// const sqlorm = require('./sql_orm')
const { UpdateUser, CreateUser, FindUser, FindUserById } = require('./sql_orm')

// function authCheck (req, res, next) {
//     if(!req.user){ res.redirect('/login') } 
//     else { next() }
// }
// if (process.env.NODE_ENV === 'production') { azureAuth(app) }
// else { localAuth(app) }
// app.all('*', authCheck )

// console.log('enviornment')
// console.log(process.env)

app.get('/',function(req,res) { res.send('hello app oauth') } )

app.get('/user', async function(req,res) { 
    try{
        let user = await FindUserById('22')
        res.send(user) 
    } catch (e) {
        res.send(e)
    }    
})

//Initialize Passport
//if prod

//else if dev
// app.use(cors({
//     origin: '*'
// }));

//adds auth check to all routes below



// const gridPath = path.join(__dirname, '/dist')
// console.log(gridPath)
// app.use(express.static(gridPath) )


// app.get('/data/:schema_name/:table_name/', sqlorm.GetSelectRoute )


// app.post('/data/:schema_name/:table_name/:crud_type', sqlorm.SqlOrmRoute )
// // //all_route here

// // //for json configurations.
// app.get('/grid/:project_name/:table_name/', async (req, res) => {
//     /*
//     Select string
//     */
//     try{
//         let pn = req.params.project_name
//         let tn = req.params.table_name
//         let wx = [
//             {'column_name': 'project_name', 'value': pn, 'operator': '=' },
//             {'column_name': 'table_name',   'value': tn, 'operator': '=' },
//         ]
//         let config = await sqlorm.GridConfiguration(wx, req)
//         res.send(config)
//     } catch (e) {

//     }

// })

// app.get('/route_guard/:schema_name/:table_name/:id', async (req, res) => {
//     /*
//     Select string for user permissions?
//     */
//     try{
//         let schema_name = req.params.schema_name
//         let table_name  = req.params.table_name
//         let id = req.params.id

//         let wx = [{'column_name': 'id', 'value': id, 'operator': '=' }]

//         let vx = await sqlorm.RouteGuard(schema_name, table_name, wx, req)

//         console.log(vx)
//         res.send(vx)
//     } catch (e) {

//     }

// })

// https://stackoverflow.com/questions/31425284/express-static-vs-res-sendfile

//send static file
// console.log(gridPath)
// app.use('/:project_name/:table_name', express.static(gridPath) )
// const gridPath = path.join(__dirname, '/dist')
// console.log(gridPath)

// app.get( '/:project_name/:table_name', function(req,res) { 
//     res.sendFile(gridPath+ '/index.html') } )

// app.use('/:project_name/:table_name',express.static(gridPath) )
// app.use('/',(req,res,next) => {console.log('wtf'); next;}  ,express.static(gridPath))

// app.use(express.static(gridPath) )
// app.use('/',(req,res,next) => {console.log('wtf'); next;}  ,express.static(gridPath))
// app.use(res.sendFile(gridPath))
console.log('main test oauth.')


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})