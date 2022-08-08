/*

Not implemented
//search routes.

return rows

let query_params = [
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.
    {
        "crud_type": "", //only needed for save route 
        "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
        "set_fields": "",  //array that has columns that should be used for set
        "on_conflict": "",
        "on_constraint": "",
        "where": "",
        "page": "", //object {'offset': val, 'limit': val}
        "search_filter": "", //string or object with quick filter type:
        "search_rank": "", //bool
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
}]



*/


//where parameters
//search filter paramters
//order by
const rp = require('../../route_parser')


function AssembleSearchStatement(object_name,search_filter,tsquery_function, where, order_by, page, index, values, bind_type, is_tsvector=false) {
    //object name can be the table_name or column.
    // var user_id = req_body['user_id']
    // var columnMap = columnObject['columnMap']
    // var columnList = columnObject['columnList']
    // var columnQuickSortString = columnObject['columnQuickSortString']
    let cn = object_name
    rp.CheckIdentifierError(cn)
    let bparams = bindp.AddBindParameters(cn, search_filter, {}, values, index, bind_type)
    let placeholder = bparams.pholder
    let quoted_name = `"${cn}"`

    let cfx = CreateFullTextSearch(placeholder, quoted_name, tsquery_function, tsq_name, tsv_name, tsr_name, is_tsvector)
    index = bparams.new_index


    //join where clause to 
    let wx =  CreateBooleanArray()
    // "WhereClauseJoin"
    // "OrderClause(order_statements)"
    // 'PaginationClause'

    //return query_string
}

module.exports = { "AssembleSearchStatement": AssembleSearchStatement }