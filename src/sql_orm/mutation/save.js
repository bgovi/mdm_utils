/*
This module handles all of the primary crud operations.

CRUD Operations API. Below are common input parameters used for the crud opeartions: Insert, Update, Upsert, Delete. Save is
a wrapper function for these fields

// {
//     "crud_type": "", //only needed for save route 
//     "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
//     "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
//     "set_fields": "",  //array that has columns that should be used for set
//     "on_conflict": "",
//     "on_constraint": "",
//     "where": "",
//     "page": "", //object {'offset': val, 'limit': val}
//     "search_filter": "", //string or object with quick filter type:
//     "search_rank": "", //bool
//     "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
//     "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
// }

*/
const ix = require('./insert.js')
const dx = require('./delete.js')
const ux = require('./update')
const sutil = require('../../sutils')

//values or replacements
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
}

async function Update (req, rowx, route_model, table_name, route_name, update_filter, saveParams) {
    //
}

async function Delete(req, rowx, route_model, table_name, route_name, saveParams) {
    /*
    may add delete conditions to where statement?
    */
}

async function DeleteAt(req, rowx, route_model, table_name, route_name, saveParams) {
    /*
    may add delete conditions to where statement?
    */
}

async function Execute(req, rowx, route_model, table_name, route_name, saveParams) {
    /*
    may add delete conditions to where statement?
    */
}