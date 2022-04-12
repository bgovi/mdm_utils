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

function IsValidOperation(operation_name) {
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
    if (! op_names.includes(operation_name.toLowerCase()))  {
        throw new Error(error_string + String(operation_name))
    }
    return operation_name.toLowerCase()
}

//restrict system and administrative views
var restricted_schemas = [
    'pg_toast', 'pg_temp_1', 'pg_toast_temp_1',
    'pg_catalog', 'information_schema',
    'pg_temp_3', 'pg_toast_temp_3', 'pg_temp_2', 'pg_toast_temp_2'
    // 'public'
]



function CheckRestrictedSchema(schema_name) { 
    if (restricted_schemas.includes(schema_name)) {
        throw new Error(String(schema_name) + " is a restricted schema" )
    }
}

function IsValidSchemaObjectCrud(schema_name, object_name, operation_name){
    //make sure name only is alphaNumeric and underscore
    CheckRestrictedSchema(schema_name)
    id_check.CheckIdentifierError(schema_name)
    id_check.CheckIdentifierError(object_name)
    id_check.CheckIdentifierError(operation_name)
    IsValidOperation(operation_name)
    return operation_name.toLowerCase()
}


function ExtractNodeId(data_row) {
    try {
        var tmp = parseInt(data_row['node_id'])
        if (isNaN(tmp) ){return -1} else{ return tmp} 
    } catch {
        return -1
    }

}

function IsReservedOrInvalidColumn(column_name, throw_error = false) {
    let x = String(column_name)
    if (!id_check.ValidIdentifier(x) || (pload.IsReservedColumn(x)) ) {
        
        if (throw_error) {
            id_check.CheckIdentifierError(x)
            pload.IsReservedColumnError(x)
            throw new Error (`${x} is not a valid identifier`)
        } else {
            return true
        }
    }
    else{ return false }
}



//default pagination

module.exports = {
    'ValidIdentifier': id_check.ValidIdentifier,
    'CheckIdentifierError': id_check.CheckIdentifierError,
    'IsValidSchemaObjectCrud':  IsValidSchemaObjectCrud,
    'UrlQueryParse': url_parse.ParseUrlQuery,
    'JwtIsValid': jwtutil.JwtIsValid,
    "JwtDecoded": jwtutil.JwtDecoded,
    "JwtCreate": jwtutil.JwtCreate,
    "JwtRefresh": jwtutil.JwtRefresh,
    "ExtractNodeId": ExtractNodeId,
    "IsValidSchemaObjectOperation": IsValidOperation,
    "IsReservedOrInvalidColumn": IsReservedOrInvalidColumn,
    "IsReservedColumn": pload.IsReservedColumn,
    'DefaultObject': pload.DefaultObject,
    'ReturnOutput': pload.ReturnOutput,
    'CheckRestrictedSchema': CheckRestrictedSchema
}