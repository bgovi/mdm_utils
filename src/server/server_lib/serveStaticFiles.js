
/*
This module exports the route for serving the Provider Effort App.
*/

//loging protection function.
const path = require('path')
const appRoot = require('app-root-path')
const srcRoot = appRoot + '/src'


var grid_dir = srcRoot + '/../client/grid/dist'
var land_dir = srcRoot + '/../client/land_page/dist'

//path to the client side build folder. Contains html file for user interface


const landPath = path.join(__dirname, ' /../../../client/land_page/dist')
const gridPath = path.join(__dirname, ' /../../../client/grid/dist')



// const landPath = resolve( '/home/bgovi/Workspace/VuetifyGrid/provider-effort/client/land_page/dist' )
// const gridPath = resolve( '/home/bgovi/Workspace/VuetifyGrid/provider-effort/client/grid/dist' )

// https://stackoverflow.com/questions/5973432/setting-up-two-different-static-directories-in-node-js-express-framework
//exports route protection for / and serves Web App if accepted
module.exports = (express, app , cors) => {
    app.use(express.static(gridPath))
    app.use(express.static(landPath))
}