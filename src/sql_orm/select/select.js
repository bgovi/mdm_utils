/*
Select statement structure determined by params.

i.e. if search options changes or mapping functions?

value BETWEEN low AND high;

value NOT BETWEEN low AND high;


*/


//select
//from
//where
//order by
//limit offset
//get fields from returning?
const rp = require('../../../../route_parser')

function AssembleWhereStatement(post_body, url_params) {
    // var user_id = req_body['user_id']
    // var columnMap = columnObject['columnMap']
    // var columnList = columnObject['columnList']
    // var columnQuickSortString = columnObject['columnQuickSortString']


    // "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
    // used for select fields
}



var req_body = req['body']
CheckReqBodyArguments(req_body)
var where_statements = req_body['where']
var sort_statements = req_body['order_by']
var pagination_values = req_body['pagination']
var replacementObject = {}

//need to parse rules statement. and add to where for is_active.
//and generate read_only statement. Also need a boolean flag for where clause
var where_string = WhereClause(where_statements, columnObject, replacementObject)
var sort_string  = OrderClause( sort_statements, columnObject['columnMap'] )
var pagination_string = PaginationClause(pagination_values)
var outer_string = OuterQuery(where_statements, columnObject, replacementObject)

function AssembleSearchStatement(post_body, url_params) {
    // var user_id = req_body['user_id']
    // var columnMap = columnObject['columnMap']
    // var columnList = columnObject['columnList']
    // var columnQuickSortString = columnObject['columnQuickSortString']
}

//claims?

//CreateOrderByStatement
//Create pagination
//Create From Statements