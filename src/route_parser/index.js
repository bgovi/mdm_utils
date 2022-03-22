/*
Need to validate schema and table name

add schema and column name checking here.

Need restricted schema names:
*/

const id_check   = require('./indentifier_check')
const url_parse  = require('./url_parse')
const pload      = require('./payload')
const jwtutil    = require('./jwt_util')


var op_names = [ "help", "map", "search", "select", "insert",
"batch_insert", "upsert", "batch_upsert", "update",
"delete", "delete_at", "execute"
]

var error_string = `crud operation not in list ${op_names} . Your operation name used was `

function is_valid_operation(operation_name) {
    /*
    Check for valid route extension
    route types
    schema_name/table_name/help
    schema_name/table_name/map
    schema_name/table_name/select
    schema_name/table_name/insert
    schema_name/table_name/batch_insert
    schema_name/table_name/upsert
    schema_name/table_name/batch_upsert
    schema_name/table_name/update
    schema_name/table_name/delete
    schema_name/function_name/execute
    schema_name/function_name/help
    */
    if (! op_names.includes(ident_str))  {
        throw new Error(error_string + String(ident_str))
    }
}

function check_restricted_schema(schema_name) {
    return
}

function is_valid_schema_object_crud(schema_name, object_name, operation_name){
    //make sure name only is alphaNumeric and underscore
    check_restricted_schema(schema_name)
    id_check.check_identifier_error(schema_name)
    id_check.check_identifier_error(object_name)
    id_check.check_identifier_error(operation_name)
    is_valid_operation(operation_name)
}


function ExtractNodeId(data_row) {
    try {
        var tmp = parseInt(data_row['node_id'])
        if (isNaN(tmp) ){return -1} else{ return tmp} 
    } catch {
        return -1
    }

}

function IsReservedOrInvalidColumn(column_name) {
    let x = String(column_name)
    if (id_check.valid_identifier(x) && (!pload.is_reserved_column(x)) ) {return true}
    else{return false}
}


//default pagination

module.exports = {
    'ValidIdentifier': id_check.valid_identifier,
    'CheckIdentifierError': id_check.check_identifier_error,
    'is_valid_schema_object_crud':  is_valid_schema_object_crud,
    'UrlQueryParse': url_parse.ParseUrlQuery,
    'JwtIsValid': jwtutil.jwt_is_valid,
    "JwtDecoded": jwtutil.jwt_decoded,
    "JwtCreate": jwtutil.jwt_create,
    "JwtRefresh": jwtutil.jwt_refresh,
    "ExtractNodeId": ExtractNodeId,
    "IsValidSchemaObjectOperation": is_valid_operation,
    "IsReservedOrInvalidColumn": IsReservedOrInvalidColumn,
    "IsReservedColumn": pload.is_reserved_column,
    'DefaultObject': pload.default_object,
    'ReturnOutput': pload.return_output
}