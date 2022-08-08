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
const insertStm      = require('./mutation/insert')
const deleteStm      = require('./mutation/delete')
const updateStm      = require('./mutation/update')
const transactionStm = require('./trans_stmt')
const dbcon          = require('./dbcon')
const type_check     = require('../sutils')

async function SqlOrmRoute(req, res, next) {
    //main route for post. diverts to select or mutation query based on
    //crud_type
    try{
        let crud_type   = req.params.crud_type
        if (crud_type === 'select') { await Select(req, res, next)}
        else { await Mutation (req, res, next) }
    } catch (e) {
        let schema_name = req.params.schema_name || ""
        let table_name  = req.params.table_name  || ""
        let crud_type   = req.params.crud_type   || ""
        let error_msg   = String(e)
        let output      = rp.ReturnOutput(schema_name, table_name,crud_type,[], [], error_msg)
        res.json(output) 
    }
}

async function Select(req, res, next) {
    /*
    Main select function parses req.body which should be a json object or
    json array.
    */
    let out_data   = []
    let error_data = []
    try{
        let schema_name = req.params.schema_name
        let table_name  = req.params.table_name
        let crud_type   = 'select'
        let query_params = req.body
        let qp_array = ReturnQueryParamsArray(query_params)
        let qp = qp_array[0]
        rp.InputPayloadParser(qp)
        let values = {}
        let x = selectStm.SelectStatement(schema_name, table_name, values, 0, qp)
        let session_params = ParseToken()
        let query = x['text']
        let sqlcmd = transactionStm.CreateTransaction(query, session_params)

        let value = await dbcon.RunQuery(sqlcmd, values)
        if (typeof value === 'string' || value instanceof String ) { error_data.push(value) }
        else {out_data = value}
        let output = rp.ReturnOutput(schema_name, table_name,crud_type,out_data, error_data, "")
        res.json(output)
    } catch (e) {
        let schema_name = req.params.schema_name
        let table_name  = req.params.table_name
        let crud_type   = 'select'
        let error_msg = String(e)
        console.log(e)
        let output = rp.ReturnOutput(schema_name, table_name,crud_type,out_data, error_data, error_msg)
        console.log(output)
        console.log(e)
        res.json(output)
    }
}


async function Mutation (req, res, next) {
    /*
        Handles insert, update, delete.
        truncate and execute are not implemented yet
    */
    let out_data   = []
    let error_data = []
    try {
        let schema_name = req.params.schema_name
        let table_name  = req.params.table_name
        let crud_type   = req.params.crud_type
        let query_params = req.body
        let qp_array = ReturnQueryParamsArray(query_params)
        for (let i =0; i < qp_array.length; i++) {
            let qp = qp_array[i]
            rp.InputPayloadParser(qp)
            if (crud_type === 'insert' || crud_type === 'update' || crud_type === 'delete' ) { qp['crud_type'] = crud_type }
            await Save(schema_name, table_name, qp, out_data, error_data)
        }
        let output = rp.ReturnOutput(schema_name, table_name,crud_type,out_data, error_data, "")
        res.json(output)
    } catch (e) {
        let schema_name = req.params.schema_name
        let table_name  = req.params.table_name
        let crud_type   = req.params.crud_type
        let error_msg = String(e)
        console.log(e)
        let output = rp.ReturnOutput(schema_name, table_name,crud_type,out_data, error_data, error_msg)
        console.log(output)
        console.log(e)
        res.json(output)
    }
}

function ReturnQueryParamsArray(query_params) {
    //makes query_params an array of objects
    let qp_array = null
    if (type_check.IsArray(query_params) ) {
        qp_array = query_params
    } else if ( type_check.IsObject(query_params) ) {
        qp_array = [query_params]  
    } else { throw 'Invalid body data type. Must be Array of objects or object'}
    return qp_array
}


async function GetSelectRoute (req, res, next) {
    //runs select command for get route
    let out_data   = []
    let error_data = []
    try {
        let schema_name = req.params.schema_name
        let table_name  = req.params.table_name
        let crud_type   = 'select'
        //optional index
        let qp = {'crud_type': crud_type}


        rp.InputPayloadParser(qp)
        let values = {}
        let x = selectStm.SelectStatement(schema_name, table_name, values, 0, qp)
        let session_params = ParseToken()
        let query = x['text']
        let sqlcmd = transactionStm.CreateTransaction(query, session_params)

        // res.send(schema_name)
        let value = await dbcon.RunQuery(sqlcmd, values)
        if (typeof value === 'string' || value instanceof String ) { error_data.push(value) }
        else {out_data = value}
        let output = rp.ReturnOutput(schema_name, table_name,crud_type,out_data, error_data, "")
        res.json(output)

    } catch (e) {
        let schema_name = req.params.schema_name
        let table_name  = req.params.table_name
        let crud_type   = 'select'
        console.log(e)
        let error_msg = String(e)
        let output = rp.ReturnOutput(schema_name, table_name,crud_type,out_data, error_data, error_msg)
        console.log(output)
        console.log(e)
        res.json(output)
    }
}

function ParseToken() {
    //placeholder for req.user
    return {'app.user_id': 1, 'app.is_user_admin': false}
}

//If query_params is array create for loop.
//if crud_type is save if crud_type not available add to server error and continue?
// var output = srf.ReturnOutput(insert_output, update_output, delete_output, upsert_output,table_name, route_name)
// res.json(output)

async function Save(schema_name, table_name, query_params, out_data, error_data){
    /*
        Main function for handling mutations.
    */

    try{
        let data      = query_params['data']
        let crud_type = query_params['crud_type']
        // console.log(query_params)
        // console.log(data)

        if (crud_type === 'insert') {
            await Promise.all( data.map(row_data => {
                return Insert(schema_name, table_name, row_data, query_params, out_data, error_data )
            }) )
        } else if (crud_type === 'update') {
            await Promise.all( data.map(row_data => {
                return Update(schema_name, table_name, row_data, query_params, out_data, error_data )
            }) )

        } else if (crud_type === 'delete') {
            await Promise.all( data.map(row_data => {
                return Delete(schema_name, table_name, row_data, query_params, out_data, error_data )
            }) )
        }
        else {error_data.push(`Invalid schema, table, or crud_type: ${schema_name} ${table_name} ${crud_type}` )}
    } catch (err) { error_data.push(String(err) ) }
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
        // console.log(sqlcmd)
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


module.exports = {GetSelectRoute, SqlOrmRoute}