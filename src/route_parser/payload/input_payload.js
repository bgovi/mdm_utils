/*
Quick verification of input types
Used to verify payload is of correct types (should use typescript)
Array of objects. Contains information for crud operations.
Operation order is not preserved.

let query_params = 
    {
    "crud_type": "", //only needed for save route 
    "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
    "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
    "set_fields": "",  //array that has columns that should be used for set in upsert
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
*/

const sutil = require('../../sutils')
const idx = require('../indentifier_check')

class InputPayload {
    constructor () {
        this.valid_crud_types = ['insert','update','delete', 'execute','save']
        this.default_values   = [ 'default', 'current_timestamp', 'current_time','null',
            'current_date', 'localtime', 'localtimestamp', ""
        ]
        this.offset = 0
        this.limit  = 100000 
    }
    RunInit(query_params) {
        //should be object add typecheck

    }
    CrudTypeValid(query_params) {
        let key = 'crud_type'
        if (!HasKey(query_params, key)) {return}
        if (valid_crud_types.includes(query_params[key])) {return }
        InvalidQueryParamError(key)
    }
    DefaultFields(default_row_data) {
        /*
        return object with sanitized default values
        default_row_data : {'column_name1': 'default_value1', 'column_name2': 'default_value2'}
    
        Checks if default_value is acceptable. If not returns default. for the column_name
        */
        //typecheck

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
    Data(query_params, deep_scan = false) {
        /*
            row_data : {'column_name1': 'column_value1', 'column_name2': 'column_value2'}
        */
        //add empty array?
        let key = 'data'
        if (!HasKey(query_params, key)) {return}
        if (! sutil.IsArray(data)) {return false }
        if (data.length === 0 ) {return true }
        if (! deep_scan) { if (sutil.IsObject(data[0]) ) {return true } }
        for (var i = 0; i < data.length; i++) { if (! sutil.IsObject(data[i]) ) {return false } }
        return true
    }
    SetFields(set_fields) {
        //    "set_fields": "",  //array that has columns that should be used for set
        let key = 'set_fields'
        if (!HasKey(query_params, key)) {return}
        return sutil.IsArray( key )
    }
    Where() {
        /*
        "", //array of objects: default []
        "where": [{column_name:"valx1", operator:"=", value="value" },
                {column_name:"valx2", operator:"in", value= ["value1", "value2"]}]
        */
        let key = 'data'
        if (!HasKey(query_params, 'crud_type')) {return}
    }
    Offset(x) {
        /*
        "offset": "", //should be integer greater or equal to 0
        */
        let key = 'offset'
        if (!HasKey(query_params, 'crud_type')) {return}
        return stuil.IsInteger(x)
    }
    Limit() {
        /* "limit": "", //should be positive integer */
        let key = 'limit'
        if (!HasKey(query_params, 'crud_type')) {return}
        return stuil.IsInteger(x)
    }
    OrderBy() {
        /*
            "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
        */
        let key = 'order_by'
        if (!HasKey(query_params, 'crud_type')) {return}
    }
    SearchFilter() {
        /*
        "search_filter": "", //string or object with quick filter type:
        */
        let key = 'search_filter'
        if (!HasKey(query_params, 'crud_type')) {return}
    }
    SearchRank() {
        /*
        "search_rank": "", //bool
        */
        let key = 'search_rank'
        if (!HasKey(query_params, 'crud_type')) {return}
    }
    ReturningValid() {
        /*
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        */
        let key = 'returning'
        if (!HasKey(query_params, 'crud_type')) {return}
    }
    ReturnValidDefaultValue(psql_reserved_constant) {
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

    InvalidQueryParamError(key_name) { throw new Error (`Invalid data type for query_params: ${key_name}`) }

    HasKey( query_params, key_name ) { return query_params.hasOwnProperty( key_name )  }
}

module.exports = InputPayload