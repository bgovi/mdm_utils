/*
Creates all the express routes

*/

// https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
const sqlorm = require('./sql_orm')
const localAuth = require('./server_authentication/local_authentication')
const azureAuth = require('./server_authentication/azure_authentication')
const path = require('path')
const port = 3000

function authCheck (req, res, next) {
    if(!req.user){ res.redirect('/login') } 
    else { next() }
}

async function CreateExpressRoutes(app, express, useMulti=false) {
    if (process.env.NODE_ENV === 'production') { await azureAuth(app, useMulti) }
    else { await localAuth(app, useMulti) }
    app.all('*', authCheck )


    let dist_folder = '/dist_dev'
    if (process.env.NODE_ENV === 'production') { dist_filder ='/dist_prod' }

    //adds auth check to all routes below
    const gridPath = path.join(__dirname, dist_folder)
    // console.log(gridPath)


    app.use('/', express.static(gridPath) )

    app.get('/data/:schema_name/:table_name/', sqlorm.GetSelectRoute )


    app.post('/data/:schema_name/:table_name/:crud_type', sqlorm.SqlOrmRoute )
    // //all_route here

    // //for json configurations.
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
            let config = await sqlorm.GridConfiguration(wx, req)
            res.send(config)
        } catch (e) {

        }

    })

    app.get('/route_guard/:schema_name/:table_name/:id', async (req, res) => {
        /*
        Select string for user permissions?
        */
        try{
            let schema_name = req.params.schema_name
            let table_name  = req.params.table_name
            let id = req.params.id

            let wx = [{'column_name': 'id', 'value': id, 'operator': '=' }]

            let vx = await sqlorm.RouteGuard(schema_name, table_name, wx, req)

            console.log(vx)
            res.send(vx)
        } catch (e) {

        }

    })

    // https://stackoverflow.com/questions/31425284/express-static-vs-res-sendfile

    //send static file
    // console.log(gridPath)
    // app.use('/:project_name/:table_name', express.static(gridPath) )
    // const gridPath = path.join(__dirname, '/dist')
    // console.log(gridPath)

    app.get( '/:project_name/:table_name', function(req,res) { 
        res.sendFile(gridPath+ '/index.html') } )


    app.listen(port, () => {
        console.log(`Begin PE app ${port}`)
    })

}

module.exports=CreateExpressRoutes