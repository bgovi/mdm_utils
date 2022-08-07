/*
This module defines the payload structure for crud operations

row_data : {'column_name1': 'column_value1', 'column_name2': 'column_value2'}

Also provides functions to process
*/
const idx = require('../indentifier_check')
const InputPayload = require('./input_payload')
const OutputPayload = require('./output_payload')

var reserved_columns = [
    /*
    These are special variables that are expected to be handled a certain way.
    These are filtered out in insert/update/delete routes. _created_at, updated_at
    and _deleted_at should be type timestamp
    
    _created_at and _updated_at set default value now(). _updated_at updated through trigger
    _last_user_id is bigint allow null and updated by a trigger.
    _deleted_at is updated through _deleted_at trigger. If has timestamp value thats when it
    was deleted

    id is not allowed to be set by an insert or update statement
    */
    'id', '_created_at','_updated_at','_deleted_at'  ,'_last_user_id'
]

let default_values = [
    /*
    These are default values that can be direclty entered into crud operations. These
    */
    'default', 'current_timestamp', 'current_time','null',
    'current_date', 'localtime', 'localtimestamp', ""
]


function ReturnValidDefaultValue(psql_reserved_constant) {
    /*
    if name in default_values list return value otherwise return default
    This function sanitizes values as they are direclty entered into sql string

    if empty string return "''"
    */
    for (var i = 0; i < default_values.length; i++) {
        if (default_values[i] === psql_reserved_constant ) {
            return default_values[i]
        }
    }
    return 'default'
}

function DefaultObject(default_row_data) {
    /*
    return object with sanitized default values
    default_row_data : {'column_name1': 'default_value1', 'column_name2': 'default_value2'}

    Checks if default_value is acceptable. If not returns default. for the column_name
    */
    let def_object = {}
    let row_keys = Object.keys(default_row_data)
    for (var i = 0; i < row_keys.length; i++) {
        let rowKey = row_keys[i]
        if ( ! idx.ValidIdentifier(rowKey)) { continue }
        let dval   = default_row_data[ rowKey ]
        let defval = ReturnValidDefaultValue(dval)
        def_object[rowKey] = defval 
    }
    return def_object
}

function IsReservedColumn(column_name) {
    /*
    This funciton checks if input column is reserved. Used to filter out payload
    in crud operations (insert, update, delete) 

    All json data should be passed to a function if used.
    */
    if (reserved_columns.includes(column_name)) { return true }
    return false
}

function IsReservedColumnError(column_name) {
    if (IsReservedColumn(column_name)) {
        throw new Error(`${column_name} is reserved key word. reserved names are ${reserved_columns}`)
    }
}

function InputPayloadParser(query_params) {
    let x = new InputPayload()
    let y = x.RunInit(query_params)
    return y
}

module.exports = {
    'IsReservedColumn': IsReservedColumn,
    'IsReservedColumnError': IsReservedColumnError,
    'ReturnValidDefaultValue': ReturnValidDefaultValue,
    'OutputPayload': OutputPayload,
    'InputPayloadParser': InputPayloadParser,
    'DefaultObject': DefaultObject
}