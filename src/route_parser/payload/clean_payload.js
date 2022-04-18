/*
Quick verification of input types
Used to verify payload is of correct types (should use typescript)
// function _CleanseQueryPrams() { //cleans query params
//     //if not clean reject query
//     // let query_params = [
//     //     Array of objects. Contains information for crud operations.
//     //     Operation order is not preserved.
//     //     {
//     //     "crud_type": "", //only needed for save route 
//     //     "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
//     //     "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
//     //     "set_fields": "",  //array that has columns that should be used for set
//     //     "on_conflict": "", //string a-zA-Z0-9
//     //     "on_constraint": "", //string a-zA-Z0-9
//     //     "where": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
//     //     "offset": "", //should be integer greater or equal to 0
//     //     "limit": "", //should be positive integer
//     //     "search_filter": "", //string or object with quick filter type:
//     //     "search_rank": "", //bool
//     //     "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
//     //     "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
//     //     }
//     // ]
// }
*/

const sutil = require('../../sutils')
const id_check   = require('./indentifier_check')

let valid_crud_types = [
    'insert','update','delete', 'execute',
    'save'    
]


function IsValidQueryParams(query_params, deep_scan = false) {
    //throw error if false}
    CrudTypeValid(query_params)
    DataTypeValid(data, deep_scan = false)
    DefaultFieldsTypeValid(def_object)
    SetFieldsTypeValid(set_fields)
}

function CrudTypeValid(query_params) {
    let key = 'crud_type'
    if (!HasKey(query_params, key)) {return}
    if (valid_crud_types.includes(query_params[key])) {return }
    InvalidQueryParamError(key)
}
function DataTypeValid(query_params, deep_scan = false) {
    let key = 'data'
    if (!HasKey(query_params, 'crud_type')) {return}


    if (! sutil.IsArray(data)) {return false }
    if (data.length === 0 ) {return true }
    if (deep_scan) {
        if (sutil.IsObject(data[0]) ) {return true }
    }
    for (var i = 0; i < data.length; i++) {
        if (! sutil.IsObject(data[i]) ) {return false }
    }
    return true
}
function DefaultFieldsTypeValid( query_params ) {
    // "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
    let key = 'def_object'    
    if (!HasKey(query_params, key)) {return} 
    return sutil.IsObject( key )
}
function SetFieldsTypeValid(set_fields) {
    //    "set_fields": "",  //array that has columns that should be used for set
    let key = 'set_fields'
    if (!HasKey(query_params, key)) {return}
    return sutil.IsArray( key )
}
function OnConflictTypeValid(cname) {
    //     "on_conflict": "", //string a-zA-Z0-9
    // "on_constraint": "", //string a-zA-Z0-9
    let key = 'data'
    if (!HasKey(query_params, 'crud_type')) {return}
    return id_check.ValidIdentifier(cname)

}

function WhereTypeValid() {
    /*
    "where": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
    */
    let key = 'data'
    if (!HasKey(query_params, 'crud_type')) {return}

}
function OffsetTypeValid(x) {
    /*
    "offset": "", //should be integer greater or equal to 0
    */
    let key = 'offset'
    if (!HasKey(query_params, 'crud_type')) {return}
    return stuil.IsInteger(x)
}
function LimitTypeValid() {
    /* "limit": "", //should be positive integer */
    let key = 'limit'
    if (!HasKey(query_params, 'crud_type')) {return}
    return stuil.IsInteger(x)
}
function OrderByValid() {
    /*
        "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
    */
    let key = 'order_by'
    if (!HasKey(query_params, 'crud_type')) {return}
}
function SearchFilterTypeValid() {
    /*
    "search_filter": "", //string or object with quick filter type:
    */
    let key = 'search_filter'
    if (!HasKey(query_params, 'crud_type')) {return}
}
function SearchRankTypeValid() {
    /*
    "search_rank": "", //bool
    */
    let key = 'search_rank'
    if (!HasKey(query_params, 'crud_type')) {return}
}
function ReturningValid() {
    /*
    "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
    */
    let key = 'returning'
    if (!HasKey(query_params, 'crud_type')) {return}
}

function InvalidQueryParamError(key_name) { throw new Error (`Invalid datay type for query_params: ${key_name}`) }

function HasKey( query_params, key_name ) { return query_params.hasOwnProperty( key_name ) }