/*
This module handles all of the primary crud operations.
Returns array of crud operations for sequelize or node postgres

CRUD Operations API. Below are common input parameters used for the crud opeartions: Insert, Update, Upsert, Delete. Save is
a wrapper function for these fields

let query_params = [
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.

    {
        "crud_type": "", //only needed for save route 
        "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
        "set_fields": "",  //array that has columns that should be used for set
        "on_conflict": "", //string a-zA-Z0-9
        "on_constraint": "", //string a-zA-Z0-9
        "where": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "offset": "", //should be integer greater or equal to 0
        "limit": "", //should be positive integer
        "search_filter": "", //string or object with quick filter type:
        "search_rank": "", //bool
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
        }
    ]

*/
const rp             = require('../route_parser')
const selectStm      = require('./select')
// const insertStm      = require('./mutation/insert')
// const deleteStm      = require('./mutation/delete')
// const updateStm      = require('./mutation/update')
const transactionStm = require('./trans_stmt')
const dbcon          = require('./dbcon')


function tx (req, res, next) {
    let schema_name = req.params.schema_name
    let table_name  = req.params.table_name
    let crud_type   = req.params.crud_type

}

async function get_select (req, res, next) {
    // res.send('Hello World!')
    console.log('hi')
    let schema_name = req.params.schema_name
    let table_name  = req.params.table_name
    let crud_type   = 'select'
    let qp = {'crud_type': crud_type}
    rp.InputPayloadParser(qp)
    console.log(qp)
    let values = {}
    let x = selectStm.SelectStatement(schema_name, table_name, values, 0, qp)
    let session_params = ParseToken()
    let query = x['text']
    let sqlcmd = transactionStm.CreateTransaction(query, session_params)
    console.log(sqlcmd)
    let out_data   = []
    let error_data = []
    // res.send(schema_name)
    let value = await dbcon.RunQuery(sqlcmd, values)
    // await dbcon.RunQueryAppendData (out_data, error_data, sqlcmd, values)
    res.send(value)
    //for select from get route?
    // { "text": select_str, "values": values, "new_index": new_index }
}

function ParseToken() {
    return {'app.user_id': 1, 'app.is_user_admin': false}
}

//If query_params is array create for loop.
//if crud_type is save if crud_type not available add to server error and continue?
// var output = srf.ReturnOutput(insert_output, update_output, delete_output, upsert_output,table_name, route_name)
// res.json(output)

async function Save(schema_name, table_name, query_params, out_data, error_data){
    /*
    saveParams is a javascript object that contains parameters on how to run the insert, delete, update
    and upsert functions. Its created by using CreateSaveParamsObject in each route. custom arguments and functions
    can be added at the rotue level to specify specialy approaches to crud operations or disable routes entierly
    */

    try{
        let data      = params['data']
        let crud_type = params['crud_type']

        if (crud_type === 'insert') {
            await Promise.all( data.map(row_data => {
                Insert(schema_name, table_name, row_data, query_params, out_data, error_data )
            }) )
        } else if (crud_type === 'update') {
            await Promise.all( data.map(row_data => {
                Update( req, data_row, route_model, table_name,route_name, update_filter, saveParams)
            }) )

        } else if (crud_type === 'delete') {
            await Promise.all( req_body['delete'].map(data_row => {
                Delete( req, data_row, route_model, table_name,route_name, saveParams)
            }) )
        }
    } catch (err) {
        console.log(err) //main error?
    }
}

//Main Crud Functions
async function Insert(schema_name, table_name, row_data, insert_params, out_data, error_data ) {
    //main insert function.
    try {
        let index  = 0
        let values = {}
        let x = insertStm.InsertStatement(schema_name, table_name, row_data,values, index, insert_params )
        let session_params = ParseToken()
        let query = x['text']
        let sqlcmd = transactionStm.CreateTransaction(query, session_params)
        await dbcon.RunQueryAppendData (out_data, error_data, sqlcmd, values)
    } catch (err) { error_data.push(String(err)) }
}

async function Update(schema_name, table_name, row_data, update_params, out_data, error_data ) {
    //main insert function.
    try {
        let index  = 0
        let values = {}
        let x = updateStm.UpdateStatement(schema_name, table_name, row_data,values, index, update_params )
        let session_params = ParseToken()
        let query = x['text']
        let sqlcmd = transactionStm.CreateTransaction(query, session_params)
        await dbcon.RunQueryAppendData (out_data, error_data, sqlcmd, values)
    } catch (err) { error_data.push(String(err)) }
}

async function Delete(schema_name, table_name, row_data, delete_params, out_data, error_data ) {
    //main insert function.
    try {
        let index  = 0
        let values = {}
        let x = deleteStm.DeleteStatement(schema_name, table_name, row_data,values, index, delete_params )
        let session_params = ParseToken()
        let query = x['text']
        let sqlcmd = transactionStm.CreateTransaction(query, session_params)
        await dbcon.RunQueryAppendData (out_data, error_data, sqlcmd, values)
    } catch (err) { error_data.push(String(err)) }
}


module.exports = {get_select}