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


module.exports = {get_select}