/*


*/

//url parser
//identifier check

const grids_router_loader = require('./grids/GridsRouterLoader')
const custom_grids_router_loader = require('./custom_grids/CustomGridsRouterLoader')

//specialty_permissiosn
//data_table_permissions
//pcp_panel and pcp_fte

module.exports = (app) => {
    LoadRoutes(app)
}

function LoadRoutes(app) {
    var base_string ='/data'
    grids_router_loader(base_string, app)
    custom_grids_router_loader(base_string, app)
}