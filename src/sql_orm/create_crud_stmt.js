/*
This module handles all of the primary crud operations.
Returns array of crud operations for sequelize or node postgres

CRUD Operations API. Below are common input parameters used for the crud opeartions: Insert, Update, Upsert, Delete. Save is
a wrapper function for these fields

Crud Return Types:
create: {row_data}
upsert: [{row_data}, null]
delete: integer
update: [integer]

*/

//return object


function CrudNotAllowed(crud_name, table_name, route_name, row_node_id, row_id) {
    //used to return json object when crud operation is not permissiable. used when allow_* is false
    var err_msg = `${crud_name} not allowed for ${table_name} table. in route ${route_name} for client row ${row_node_id}`
    if (crud_name == 'updated' || crud_name == 'delete') {
        err_msg += '. Row can be deactivated  by setting is_active to false to prevent further use and to hide.'
    }
    //if update or delete
    return srf.ModifyFail (row_node_id,  row_id, err_msg)
}

// 'insert': {'crud_function': null, 'permission_function': null, 'additional_check': null, 'allow_crud': false}, 
// 'update': { 'crud_function': null , 'permission_function': null, 'additional_check': null, 'allow_crud': false, 'where_function': null },
// 'delete': { 'crud_function': null , 'permission_function': null, 'additional_check': null, 'allow_crud': false, 'where_function': null},
// 'upsert': {'crud_function': null , 'permission_function': null, 'additional_check': null, 'allow_crud': false} }



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

async function Maps(res, route_model, query_clause, table_name, route_name) {
    /*
    Creates jsonRows that contain values user can enter for autocomplete.

    query_clause: {parameters to send to sequelize} i.e. attribtues: where, raw: true, include

    Model.findAll({
    where: {
        [Op.and]: [
            Sequelize.literal('RAW SQL STATEMENT WHICH WONT BE ESCAPED!!!')
        ]
    }
    })
    */
    try {
        var rs = await route_model.findAll(query_clause) //active users i.e. Admin, User, New
        var rs_map = srf.ReturnMaps(table_name, route_name, rs)
        res.json(rs_map)
    } catch (err) {
        var map_error = srf.ReturnMapError(table_name, route_name, [], srf.ProcessError(err) )
        res.json(map_error)
    }
}

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


function CreateSaveParamsObject(args) {
    /*
    args is a javascript object that has the same strcutre as save_params variable below. It used to overwrite default options.

    Used to assemble the custom params object. Make sure all key values are valid. 
    custom_update = null, custom_insert = null, custom_delete = null, custom_upsert = null,
    custom_update_permission = null, custom_insert_permission = null, custom_delete_permission = false, custom_upsert_permission = null

    async crud_function (req, row_id,row_node_id, rowx): provides a way to create a fully customized crud function for each route.
        for delete return a value where value >= 0. where value referes to the number of rows affected
        update function must return an array [value] where value >= 0. where value referes to the number of rows affected
        for insert and upsert returns json row of the affected row.
    allow_crud: determines if the crud operation should even be considered
    async permissions_function (req, row_id,row_node_id, rowx): custom permissions check to see if crud operation should continue. throw new Error when it
        should be stopped
    async additional_check (req, row_id,row_node_id, rowx): An additionaly permissions check. runs after custom permissions or default permissions have been
        run. throws error if fails.

    where_function (req, row_id, rowx) Returns the sequelize query_parameters for update or delete. Mainly add update and delete protections.

    Crud Return Types:
        create: {row_data}
        upsert: [{row_data}, null]
        delete: integer
        update: [integer]

    append_user_id_as: []. Append is a list of keys for the user_id that are added by the server to rowx rows. This is done the user_id to each
        row before being sent to the database. For example append_user_id_as = ['last_modified_by_user_id']. Will add  req['user_id']} 
        to each rowx row as 'last_modified_by_user_id': req['user_id'] 
    */
    var save_params = {
        'insert': {'crud_function': null, 'permission_function': null, 'additional_check': null, 'allow_crud': false}, 
        'update': { 'crud_function': null , 'permission_function': null, 'additional_check': null, 'allow_crud': false, 'where_function': null },
        'delete': { 'crud_function': null , 'permission_function': null, 'additional_check': null, 'allow_crud': false, 'where_function': null},
        'upsert': {'crud_function': null , 'permission_function': null, 'additional_check': null, 'allow_crud': false} ,
        'append_user_id_as': []
    }
    //loop through if error throw
    for (var crud_operation in args) {
        if (crud_operation == 'append_user_id_as') {continue}
        for (var param in args[crud_operation]) {
            if (save_params[crud_operation][param] === undefined) {
                throw new Error(`the key pair ${crud_operation} and ${param} were not found in save params objeced. use valid keys`)
            }
            if (param == "allow_crud") {
                //check if true or false
                var bx = args[crud_operation][param]
                if (typeof bx !== 'boolean') {throw new Error(`not a boolean`)}
                save_params[crud_operation][param] = bx
            }
            else {
                var func =  args[crud_operation][param]
                if (typeof func !== 'function' ) {throw new Error(`not a function?`)}
                save_params[crud_operation][param] = func    
            }
        }
    }
    if (args.hasOwnProperty('append_user_id_as')) {
        args['append_user_id_as'].forEach(user_key => save_params['append_user_id_as'].push(user_key))
    }

    return save_params
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


module.exports = {
    "GetRawString": GetRawString,
    "GetSequelize": GetSequelize,
    "GetRawStringRouter": GetRawStringRouter,
    "Maps": Maps,
    "MapsRaw": MapsRaw,
    "Save": Save,
    "CreateSaveParamsObject": CreateSaveParamsObject
}