/*
This module handles all of the primary crud operations.
Returns array of crud operations for sequelize or node postgres

CRUD Operations API. Below are common input parameters used for the crud opeartions: Insert, Update, Upsert, Delete. Save is
a wrapper function for these fields

Crud Return Types:
//insert
create: {row_data}
upsert: [{row_data}, null]
delete: integer
update: [integer]
select
search
help
*/

//return object

/*

Used to assemble transaction string.

combines information from mutations and select statement


BEGIN;
set local app.user_id = 'id from user'

query statement


COMMIT;

//RouteGuard


*/


function CrudNotAllowed(crud_name, table_name, route_name, row_node_id, row_id) {
    //used to return json object when crud operation is not permissiable. used when allow_* is false
    var err_msg = `${crud_name} not allowed for ${table_name} table. in route ${route_name} for client row ${row_node_id}`
    if (crud_name == 'updated' || crud_name == 'delete') {
        err_msg += '. Row can be deactivated  by setting is_active to false to prevent further use and to hide.'
    }
    //if update or delete
    return srf.ModifyFail (row_node_id,  row_id, err_msg)
}

//Search
//Filter
//Help


async function MapsRaw(res, table_name, route_name, sql_string, replacementsObject) {
    /*
    Arguments:
        req, res:
        columnObject: Object sent by route. Contains information on columns to be used in get query.
        CreateQuery: Function sent by route to assemble get string.
    */
   try {
        //check read permissions
        // add columns for allow update and allow_delete
        var rs = await sequelize.query(sql_string,
            {replacements: replacementsObject, type:sequelize.QueryTypes.SELECT } )
        var rs_map = srf.ReturnMaps(table_name, route_name, rs)
        res.json(rs_map)

    } catch (err) {
        var map_error = srf.ReturnMapError(table_name, route_name, [], srf.ProcessError(err) )
        res.json(map_error)
    }
}

function AddUserIdToRow(rowx, req, saveParams) {
    //adds the current users id to the row. Used to track who made the last modification.
    var user_id = er.ExtractUserId(req)
    if (saveParams['append_user_id_as'].length <= 0) {return}
    saveParams['append_user_id_as'].forEach( user_key => rowx[user_key] = user_id)
}

async function Save(req, res, route_model, table_name, route_name, update_filter, saveParams){
    /*
    saveParams is a javascript object that contains parameters on how to run the insert, delete, update
    and upsert functions. Its created by using CreateSaveParamsObject in each route. custom arguments and functions
    can be added at the rotue level to specify specialy approaches to crud operations or disable routes entierly
    */

    try{
        var req_body = req['body']
        var insert_output = await Promise.all( req_body['insert'].map(data_row => {
            return Insert(req, data_row, route_model, table_name, route_name, saveParams)
         }) )
        var update_output = await Promise.all( req_body['update'].map(data_row => {
            return Update( req, data_row, route_model, table_name,route_name, update_filter, saveParams)

        }) )
        var delete_output = await Promise.all( req_body['delete'].map(data_row => {
            return Delete( req, data_row, route_model, table_name,route_name, saveParams)
        }) )
        var upsert_output = await Promise.all( req_body['upsert'].map(data_row => {
            return Upsert( req, data_row, route_model, table_name, route_name, saveParams)
        }) )
        var output = srf.ReturnOutput(insert_output, update_output, delete_output, upsert_output,table_name, route_name)
        res.json(output)
    } catch (err) {
        var err_output = srf.ReturnOutputError(srf.ProcessError(err), insert_rows, update_rows, delete_rows, upsert_rows, table_name, route_name)
        res.json(err_output)
    }
}

async function Insert(req, rowx, route_model, table_name, route_name, saveParams ) {
    //main insert function.
    try {
        var row_node_id = srf.ExtractNodeId(rowx)
        var row_id = -1
        if (! saveParams['insert']['allow_crud']) {return CrudNotAllowed('insert', table_name, route_name, row_node_id, row_id)}
        if (saveParams['insert']['permission_function'] !== null) { await saveParams['insert']['permission_function'](req, row_id, row_node_id, rowx)  } else{
            qp.InsertPermissionsCheck(req)
        }

        if (saveParams['insert']['additional_check'] !== null) { 
            await saveParams['insert']['additional_check'](req, row_id, row_node_id, rowx)
        }
        AddUserIdToRow(rowx, req, saveParams)
        if (saveParams['insert']['crud_function'] !== null) {
            var ix = await saveParams['insert']['crud_function'](req, row_id, row_node_id, rowx)
            row_id = ix.id
        } else {
            var ix = await route_model.create(rowx)
            row_id = ix.id
        }

        return srf.ModifyPass(row_node_id,  row_id)
    } catch (err) {
        return srf.ModifyFail(row_node_id,  -1, srf.ProcessError(err))
    }
}


module.exports = {
    "GetRawString": GetRawString,
    "GetSequelize": GetSequelize,
    "GetRawStringRouter": GetRawStringRouter,
    "Maps": Maps,
    "MapsRaw": MapsRaw,
    "Save": Save,
    "CreateSaveParamsObject": CreateSaveParamsObject
}