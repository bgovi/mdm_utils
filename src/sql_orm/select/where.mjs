/*
It looks like you may have been close based on your comment to @ebohlman's answer. 
You can use WHERE id = ANY($1::int[]). PostgreSQL will convert the array to the type the parameter is cast to in $1::int[].
So here's a contrived example that works for me:

Is type conversion necessary? probably

https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
*/

/*
This module is used to help assemble the where, order_by and pagination statements for a given get request.
CreateQueryParams is the main modules that returns the query filtering and sorting conditions string that is attached
to the final sql query sent to the database.

Key variables and definitions:
variable_name: this field contains the name of the column sent to the client side and displayed by the client
    side grid
columnMap: The column map object converts the variable_name to its full refrenced name in the sequel query being assembled.
    For example id -> departments.id where id belongs to the departments table. For calculated fields i.e cfte it will
    replace the variable_name with the funciton used to create the value .calculated_field: refers to columns that are generated by calculations 
        and are not actually stored in a table. Each route will have defined functions for creating the variable_name -> calculated filed mapping.

replacements: this is an object that stores the names and values used to replace values in the sql template string.
    i.e. {'ids': [1,2,3]} with 'SELECT * FROM users where id in (:ids)' -> SELECT * FROM users where id in (1,2,3)
    the column is used to designate what should be replaced in the template string with corresponding key value pairs
    in the sql template string.

req_body: this is an object for req.body which is sent from the client during the post request it can have several
objects for get routes it will have the objects:
req.body['rules'] = [{}] //rules contain informations such as include read only.
req.body['where'] = [{}]
req.body['order_by'] = [{}]
req.body['pagination'] = [{}]

and for transactions i.e. insert/update/upsert/delete it will have
req.body['insert'] = [{}]
req.body['update'] = [{}]
req.body['upsert'] = [{}]
req.body['delete'] = [{}]

GET: For get request the four major components are rules, where, order_by and pagination. This data is sent
from the client or generated by there server to create the sql query restraints and filters.

req.body['where'] contains a json list of data used to create the where statement. All json rows in
the where object are joined by an AND statement.
where: json list [{'variable_name': , 'query_type': , 'value':  , 'data_type': ''}]

variable_name: this field contains the name of the column sent to the client side and displayed by the client
    side grid

value: the actual value to insert into the query string. This can be a single value or a list of values.
    if date_type is 'date' the value will be of type {'before_date': YYYY-MM-DD, 'after_date': YYYY-MM-DD}
    the value may contain either before_date or after_date or both dates. for server_query its the full boolean string
    argument.
    for numerical values the value type will be of {'value_1': xx, 'value_2': xx, 'value_list': []}
        value_1 is used by default. value 2 is used for between and not_between.

data_type: string, float, int, etc. Determines what the value type should be in the value object or a list of data.
    used to do a final conversion check?

    //attempt type cast and filter. //data_types // integer, float, date, string, boolean


query_type: this specifies how the row will pe processed to create the binary sql string component.
    types are: in, date, like, equals, quick_filter, server_query, greater_equal, greater, less, less_equal, between, not_between

    in: the in flag is meant to create a statement like id in (1,2,3,4,5). the value should be a list of values
    date: the date field expects the value object to be {'before_date': '2020-11-01', 'after_date':'1999-01-01'}
        the date value is in YYYY-MM-DD format. Either or both before_date and after_date can be present. 
        the output statement will look like "effective_date >=  '1999-01-01' and effective_date <=  '2020-11-01'
    equals: checks 'columnName = value' for string
    quick_filter: this is similar to the like clause, but all columns names in the columnMap are concatenated together
        so that the quick_filter value is compared against all columns in a row.


    like: uses the like operater 'columnName like value or value like columnName'
    greater, greater_equal, less, less_equal: used to compare numerical values. creates bool statement like 'columnName < value'

    server_query: this is a query string generated by the server. If variable_name and value are not null they are added
        to the replacements object. the string is in the query_string object in the where rows.

req.body['order_by']: this contains a json list to determine to order in which to return the data.
    req.body['order_by'] = [{ 'variable_name': 'id', 'sort_order': asc },{ 'variable_name': 'first_name', 'sort_order': desc } ] 
    this would create a statemente as follows
        columnName = columnMap['variable_name']
        'ORDER BY department.id asc, provider.first_name desc'

req.body['rules'] = [{}] used for creating different queries. read_only for example.

req.body['pagination']: this contains values for offset and limit. This creates pagination for the query 
    req.body['pagination']= {'offset': 0, 'limit': 1000} creates statement
        'offset 0 limit 1000'


TRANSACTIONS: INSERT, UPDATE, UPSERT, DELETE
For save request i.e. insert/update/upsert/delete there will be five objects in req.body

//save
req.body['insert'] = [{}]
req.body['update'] = [{}]
req.body['upsert'] = [{}]
req.body['delete'] = [{}]



//output return from server
server_error: {'is_error':true, 'msg': 'what happened'} //for actual server side errors?
get_error: {'is_error':true, 'msg': 'what happened'} //maybe for permissions issues??
output: [{}] //list of id, row_node_id and error_msg: '' add error message and filter on client side.

*/
//user filter. boolean string for user permissions included in where statement?
const moment = require('moment')
const er = require('./extract_req')

//module.exports = {}
//columnObject = {columnMap, columnList, columnQuickSortString }

function CreateQueryParamaters(req, columnObject) {
    // var user_id = req_body['user_id']
    // var columnMap = columnObject['columnMap']
    // var columnList = columnObject['columnList']
    // var columnQuickSortString = columnObject['columnQuickSortString']
    //
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

    //add user id
    replacementObject['user_id'] = er.ExtractUserId(req)
    // var query_restraints_string = `${where_string}
    // ${sort_string}
    // ${pagination_string}`

    var query_restraints = {'query_options': {
        'where': where_string,
        'order_by': sort_string,
        'pagination': pagination_string,
        'outer_statement': outer_string,
        'replacements': replacementObject
    } }
    return query_restraints

    //concat where, sort and pagination string??
}

/*
Primary functions for creating assembly strings??
order_statment = {variable_name: , sort_order: 'asc/desc' }
*/
//if (variable_name == 'is_read_only') {continue}
function OuterQuery( where_statements, columnObject, replacementObject ){
    //make aysnc for promise stuff??
    var columnMap = columnObject['columnMap']
    where_list = []
    for (where_statement of where_statements) {
        var query_type = where_statement['query_type']
        var data_type = where_statement['data_type']
        var variable_name = where_statement['variable_name']
        //determine where assembly based on query_type and data_type
        if (['allow_update','allow_delete', 'is_assigned'].includes(variable_name)) {
            var replacementName = ":"+variable_name
            var variableValue = where_statement['value']
            var dataType = where_statement['data_type']
            //typecast variableValue??? for integer array or string array??
            if (typeof variableValue !== "boolean") { continue}
        
            replacementObject[variable_name] = variableValue
            var boolean_string = `(${variable_name} = (${replacementName}) )`
            where_list.push(boolean_string)
        }
    }
    if (where_list.length > 0) {
        var where_string = 'WHERE ' + where_list.join(' AND ') +'\n'
        return where_string
    } else { return '' }

}





function OrderClause(order_statements, columnMap) {

    var order_list = []
    for (order_statement of order_statements) {
        var columnName = ColumnMapReturn(columnMap, order_statement['variable_name'])
        if (columnName == null) { continue }

        var sort_order = order_statement['sort_order'].toUpperCase()
        if (['ASC', 'DESC'].includes(sort_order)) {
            var ox = `${columnName} ${sort_order}`
            order_list.push(ox)
        }
    }
    if (order_list.length > 0 ) {
        var order_string = 'ORDER BY ' + order_list.join(', ') +'\n'
        return order_string
    } else { return '' }
}

function PaginationClause(pagination_values) {
    //both should be integers?
    var pagination_data = ExtractPaginationData(pagination_values)
    var offset = pagination_data['offset']
    var page_limit = pagination_data['page_limit']
    return `offset ${offset} limit ${page_limit}`
}

function ExtractPaginationData(pagination_values) {
    //both should be integers?
    var offset = pagination_values['offset']
    var page_limit = pagination_values['limit']
    offset = parseInt(offset)
    page_limit = parseInt(page_limit)
    if (isNaN(offset)  ) { offset = 0 }
    if (isNaN(page_limit)  ) { page_limit = 1000 }

    if (offset < 0 ) { offset = 0}
    if (page_limit <= 0) {page_limit = 1000 }
    if (page_limit > 10000) {page_limit = 10000 } //max size
    return {'offset': offset, 'page_limit': page_limit}
}

function ExtractPaginationDataFromReq(req) {
    //both should be integers?
    var req_body = req['body']
    var pagination_values = req_body['pagination']
    if (pagination_values === undefined) {
        return {'offset': 0, 'page_limit': 1000 }        
    }

    var offset = pagination_values['offset']
    var page_limit = pagination_values['limit']
    offset = parseInt(offset)
    page_limit = parseInt(page_limit)
    if (isNaN(offset)  ) { offset = 0 }
    if (isNaN(page_limit)  ) { page_limit = 1000 }

    if (offset < 0 ) { offset = 0}
    if (page_limit <= 0) {page_limit = 1000 }
    if (page_limit > 10000) {page_limit = 10000 } //max size
    return {'offset': offset, 'page_limit': page_limit}
}


//check if json body has all query arguments i.e. where, rules, order_by, pagination
function CheckReqBodyArguments(req_body) {
    CheckWhere(req_body)
    CheckOrderBy(req_body)
    CheckRules(req_body)
    CheckPagniation(req_body)
}

function CheckWhere(req_body) { if (! req_body.hasOwnProperty('where')) {req_body['where'] = [{}]} }
function CheckOrderBy(req_body) { if (! req_body.hasOwnProperty('order_by')) {req_body['order_by'] = [{}]}}
function CheckRules(req_body) { if (! req_body.hasOwnProperty('rules')) {req_body['rules'] = [{}]}}
function CheckPagniation(req_body) { if (! req_body.hasOwnProperty('pagination')) {
    req_body['pagination'] = [{'offset': 0, 'limit': 1000}]}
}

//pass in user filter object???
/*
    types are: in, date, like, equals, quick_filter, server_query, greater_equal, greater, less, less_equal

    in: the in flag is meant to create a statement like id in (1,2,3,4,5). the value should be a list of values
    date: the date field expects the value object to be {'before_date': '2020-11-01', 'after_date':'1999-01-01'}
        the date value is in YYYY-MM-DD format. Either or both before_date and after_date can be present. 
        the output statement will look like "effective_date >=  '1999-01-01' and effective_date <=  '2020-11-01'
    like: uses the like operater 'columnName like value or value like columnName'
    equals: checks 'columnName = value'
    quick_filter: this is similar to the like clause, but all columns names in the columnMap are concatenated together
        so that the quick_filter value is compared against all columns in a row.

    greater, greater_equal, less, less_equal, equal: used to compare numerical values. creates bool statement like 'columnName < value'

    server_query: this is a query string generated by the server. If variable_name and value are not null they are added
        to the replacements object. the string is in the query_string object in the where rows.

*/


//create columnObject = {columnMap, columnList, columnConcat}
//WhereNumicialIn

function WhereClause( where_statements, columnObject, replacementObject ){
    //make aysnc for promise stuff??
    var columnMap = columnObject['columnMap']
    // var columnList = columnObject['columnList']
    var columnQuickSortString = columnObject['columnQuickSortString']
    where_list = []
    for (where_statement of where_statements) {
        var query_type = where_statement['query_type']
        var data_type = where_statement['data_type']
        var variable_name = where_statement['variable_name']
        //determine where assembly based on query_type and data_type
        if (['allow_update','allow_delete', 'is_assigned'].includes(variable_name)) {continue}
        else if (query_type == 'server_query') { WhereServerQuery(where_statement, where_list) }
        else if (query_type == 'quick_filter') { WhereQuickFilter(where_statement,  where_list, replacementObject, columnQuickSortString) }
        else if (data_type == 'integer' || data_type == 'float' ) {
            if (query_type == 'in') {
                WhereNumericalIn(where_statement, columnMap, replacementObject, where_list)
            } else {
                WhereNumericalComparision(where_statement, columnMap, replacementObject, where_list)
            }


        } else if (data_type == 'string') {
            if (query_type == 'in') {
                // WhereIn(where_statement, columnMap, replacementObject, where_list)
                WhereStringIn(where_statement, columnMap, replacementObject, where_list)
            }  else if (query_type == 'not_in') {
                WhereStringNotIn(where_statement, columnMap, replacementObject, where_list)
            } else if (query_type == 'equals') {
                WhereStringEqual(where_statement, columnMap, replacementObject, where_list)
            } 
        } else if (data_type == 'date') {
            WhereDate(where_statement, columnMap, replacementObject, where_list)
        } else if (data_type == 'boolean') {
            WhereBoolean(where_statement, columnMap, replacementObject, where_list)
        }

    }
    if (where_list.length > 0) {
        var where_string = 'WHERE ' + where_list.join(' AND ') +'\n'
        return where_string
    } else { return '' }

}

/*
Where Helper functions.
[{'variable_name': , 'query_type': , 'value':  , 'data_type': ''}]

where_statement
columnMap
replacementObject
where_list
variableValue:


*/
function WhereDate(where_statement, columnMap, replacementObject, where_list) {
    /*
        {'before_date': YYYY-MM-DD, 'after_date': YYYY-MM-DD}
    */
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementBeforeName = "_before_date_"+variable_name
    var replacementAfterName = "_after_date_"+variable_name
    var variableValue = where_statement['value']
    // var data_type = where_statement['data_type']
    //check date type and typecast???
    var query_type = where_statement['query_type']
    //need to change is null..
    if (query_type === 'equals') {
        if (variableValue['before_date'] !== null ) {
            var before_date = TypeCastValues( variableValue['before_date'], 'date')
            if (before_date === null) {return }
            replacementObject[replacementBeforeName] = before_date
            var boolean_string = `(${columnName} = :${replacementBeforeName})`
            where_list.push(boolean_string)
        }    
    }

    else if (variableValue['before_date'] !== null && variableValue['after_date'] !== null ) {
        //date equals use same date
        var before_date = TypeCastValues( variableValue['before_date'], 'date')
        var after_date = TypeCastValues(variableValue['after_date'], 'date' )
        if (before_date === null || after_date === null) {return }

        replacementObject[replacementBeforeName] = before_date
        replacementObject[replacementAfterName]  = after_date
        if (query_type == 'between') {
            var boolean_string = `(  :${replacementBeforeName} <= ${columnName} AND  ${columnName} <= :${replacementAfterName} )`
            where_list.push(boolean_string)
        } else {
        var boolean_string = `(  ${columnName} <= :${replacementBeforeName} OR ${columnName} >= :${replacementAfterName})`
        where_list.push(boolean_string)
        }

    } else if ( variableValue['before_date'] !== null ) {
        var before_date = TypeCastValues( variableValue['before_date'], 'date')
        if (before_date === null) {return }
        replacementObject[replacementBeforeName] = before_date
        if (query_type === 'before') {
            var boolean_string = `(${columnName} < :${replacementBeforeName})`
            where_list.push(boolean_string)
        } else {
            var boolean_string = `(${columnName} <= :${replacementBeforeName})`
            where_list.push(boolean_string)
        }

    } else if ( variableValue['after_date'] !== null ) {
        var after_date = TypeCastValues( variableValue['after_date'], 'date')
        if (after_date === null) {return }
        replacementObject[replacementAfterName] = after_date
        if (query_type === 'after') {
            var boolean_string = `(${columnName} > :${replacementAfterName})`
            where_list.push(boolean_string)     
        } else {
            var boolean_string = `(${columnName} >= :${replacementAfterName})`
            where_list.push(boolean_string)
        }
    }

}

//makes where in boolean statement i.e. columnName in (values)
function WhereBoolean(where_statement, columnMap, replacementObject, where_list) {
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementName = ":"+variable_name
    var variableValue = where_statement['value']
    if (typeof variableValue !== 'boolean' ) {return }

    replacementObject[variable_name] = variableValue
    var boolean_string = `(${columnName} = ${replacementName} )`
    where_list.push(boolean_string)
}



//makes where in boolean statement i.e. columnName in (values)
function WhereIn(where_statement, columnMap, replacementObject, where_list) {
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementName = ":"+variable_name
    var variableValue = where_statement['value']
    var dataType = where_statement['data_type']
    //typecast variableValue??? for integer array or string array??
    var processedVariableValue = TypeCastValues(variableValue, dataType )
    //if variableValue empty, null, undefined or '', skip?
    if (IsEmptyStatement(processedVariableValue)) {return }
    //convert to array if single value
    if (! Array.isArray(processedVariableValue)) { processedVariableValue = [processedVariableValue]}
    if (! Array.isArray(processedVariableValue)) { return }

    replacementObject[variable_name] = processedVariableValue
    var boolean_string = `(${columnName} in (${replacementName}) )`
    where_list.push(boolean_string)
}

//makes where in boolean statement i.e. columnName in (values)
function WhereStringIn(where_statement, columnMap, replacementObject, where_list) {
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementName = ":"+variable_name
    var variableValue = where_statement['value']
    var dataType = where_statement['data_type']
    //typecast variableValue??? for integer array or string array??
    var processedVariableValue = TypeCastValues(variableValue, dataType )
    //if variableValue empty, null, undefined or '', skip?
    if (IsEmptyStatement(processedVariableValue)) {return }
    //convert to array if single value
    if (! Array.isArray(processedVariableValue)) { processedVariableValue = [processedVariableValue]}
    if (! Array.isArray(processedVariableValue)) { return }

    replacementObject[variable_name] = processedVariableValue
    var boolean_string = `(${columnName} ilike ANY (ARRAY [${replacementName}] ) )`
    where_list.push(boolean_string)
}

function WhereStringNotIn(where_statement, columnMap, replacementObject, where_list) {
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementName = ":"+variable_name
    var variableValue = where_statement['value']
    var dataType = where_statement['data_type']
    //typecast variableValue??? for integer array or string array??
    var processedVariableValue = TypeCastValues(variableValue, dataType )
    //if variableValue empty, null, undefined or '', skip?
    if (IsEmptyStatement(processedVariableValue)) {return }
    //convert to array if single value
    if (! Array.isArray(processedVariableValue)) { processedVariableValue = [processedVariableValue]}
    if (! Array.isArray(processedVariableValue)) { return }

    replacementObject[variable_name] = processedVariableValue
    var boolean_string = `(${columnName} not ilike ALL (ARRAY [${replacementName}] ) )`
    where_list.push(boolean_string)
}



//Numerical In
function WhereNumericalIn(where_statement, columnMap, replacementObject, where_list) {
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementName = ":"+variable_name
    var variableValue = where_statement['value']['value_list']
    var dataType = where_statement['data_type']
    //typecast variableValue??? for integer array or string array??
    var processedVariableValue = TypeCastValues(variableValue, dataType )
    //if variableValue empty, null, undefined or '', skip?
    if (IsEmptyStatement(processedVariableValue)) {return }
    //convert to array if single value
    if (! Array.isArray(processedVariableValue)) { processedVariableValue = [processedVariableValue]}
    if (! Array.isArray(processedVariableValue)) { return }

    replacementObject[variable_name] = processedVariableValue
    var boolean_string = `(${columnName} in (${replacementName}) )`
    where_list.push(boolean_string)
}

function WhereQuickFilter(where_statement,  where_list, replacementObject, quickFilterColumnString) {
    //loops through all values in variableValue and compares against columns in quickFilterColumnString
    var variable_value = where_statement['value'] //this will contain the like values as a list.
    var processedVariableValue = TypeCastValues(variable_value, 'string' )
    //if variableValue empty, null, undefined or '', skip?
    if (IsEmptyStatement(processedVariableValue)) {return }
    //convert to array if single value
    if (! Array.isArray(processedVariableValue)) { 
        processedVariableValue = [processedVariableValue]
        if (! Array.isArray(processedVariableValue)) { return }    
    }

    if (processedVariableValue.length == 0) {return}

    var likeJoinList = []
    var i = 0
    // console.log(processedVariableValue)
    for (varx of processedVariableValue) {
        // console.log(varx)
        varx = varx.trim()
        // console.log(varx)
        if (varx == '') { continue }
        var repName = "quick_sort_" + String(i)
        // console.log(repName)
        // console.log(varx)
        // console.log(replacementObject)
        replacementObject[repName] = '%'+varx+'%'
        likeJoinList.push(`${quickFilterColumnString} ilike :${repName}`  )
        i+=1
    }
    if (likeJoinList.length > 0) {
        var like_string = likeJoinList.join(' OR ')
        var boolean_string = ` ( ${like_string}  ) `
        where_list.push(boolean_string)
    }
}


function WhereStringEqual(where_statement, columnMap, replacementObject, where_list) {
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementName = ":"+variable_name
    var variableValue = where_statement['value']
    //typecast variableValue??? for integer array or string array??
    var processedVariableValue = TypeCastValues(variableValue, 'string' )
    //if variableValue empty, null, undefined or '', skip?
    if (IsEmptyStatement(processedVariableValue)) {return }
    if (Array.isArray(processedVariableValue)) { return }

    replacementObject[variable_name] = processedVariableValue
    var boolean_string = `(${columnName} ilike ${replacementName} )`
    where_list.push(boolean_string)
}

// server_query: this is a query string generated by the server. If variable_name and value are not null they are added
// to the replacements object. the string is in the query_string object in the where rows.
function WhereServerQuery(where_statement, where_list) {
    /*
    Query string must be completed before entering in?

    */
    var sql_string = '(' + where_statement['value'] +')'
    where_list.push(sql_string)
}

function WhereNumericalComparision(where_statement, columnMap, replacementObject, where_list) {
    //variableValue: {greater: , less: , greater_equal, after_equal}
    //greater, greater_equal, less, less_equal
    var variable_name = where_statement['variable_name']
    // var columnName =  columnMap[variable_name]
    var columnName = ColumnMapReturn(columnMap, variable_name)
    if (columnName == null) {return}
    var replacementName = ":"+variable_name+'_1'
    var variableValue = where_statement['value']['value_1']
    var dataType = where_statement['data_type']
    var query_type = where_statement['query_type']
    //add two values to replacement object??

    var processedVariableValue = TypeCastValues(variableValue, dataType )
    if (Array.isArray(processedVariableValue)) {return }
    if (IsEmptyStatement(processedVariableValue)) {return }
    //need to type cast and extract values.
    var numericalJoinList = []
    if ( query_type == 'greater' ) {
        numericalJoinList.push(`${columnName} > ${replacementName}`)
    } else if ( query_type == 'less' ) {
        numericalJoinList.push(`${columnName} < ${replacementName}`)
    } else if ( query_type == 'greater_equal' ) {
        numericalJoinList.push(`${columnName} >= ${replacementName}`)
    } else if ( query_type == 'less_equal' ) {
        numericalJoinList.push(`${columnName} <= ${replacementName}`)
    } else if ( query_type == 'equals' ) {
        numericalJoinList.push(`${columnName} = ${replacementName}`)
    } 
    
    //include value_1 and value_2
    else if ( query_type == 'between' || query_type == 'not_between' ) {
        var variableValue_2 = where_statement['value']['value_2']
        //add two values to replacement object??
        var processedVariableValue_2 = TypeCastValues(variableValue_2, dataType )
        if (Array.isArray(processedVariableValue_2)) {return }
        if (IsEmptyStatement(processedVariableValue_2)) {return }
        var replacementName_2 = ":"+variable_name+'_2'
        replacementObject[variable_name+"_2"] = processedVariableValue_2
        if (query_type == 'between') {
            numericalJoinList.push(`${columnName} >= ${replacementName} AND ${columnName} <= ${replacementName_2}`)
        } else {
            numericalJoinList.push(`${columnName} < ${replacementName} OR ${columnName} > ${replacementName_2}`)
        }
    }

    if (numericalJoinList.length > 0) {
        where_list.push( '( ' + numericalJoinList.join('') + ' )' )
    }
    replacementObject[variable_name +"_1"] = processedVariableValue

}

function IsEmptyStatement(processedValue) {
    /*
    Checks if a value is null or array is empty. If either true return true
    else return false
    */
    if (processedValue === null) { return true }
    if (Array.isArray(processedValue)) {
        if (processedValue.length == 0 ) {
            return true
        } else {
            return false
        }
    }
    if (typeof processedValue === 'string' || processedValue instanceof String  ) {
        if (processedValue.trim() == '') {return true}
    }
    return false
}

function TypeCastValues(variable_values, variable_type) {
    /*
    This make sure the variable type is correct. Does type conversion to a single value
    or an array of values
    variable_value: this is the value to be modified. Can be a single value or an array of values.
    variable_type: The required type of the value. Can be //integer, float, date, string

    if value cant be converted return null. or an empty list. Skip addition to array
    if empty list?
    */
    if (variable_type == 'integer') {
        if (IsArray(variable_values)) {
            let mixedArray = variable_values.map(el=>parseInt(el))
            let integerArray = mixedArray.filter( (value) => !isNaN(value) )
            return integerArray
        } else {
            return parseInt(variable_values)
        }

    } else if (variable_type == 'float') {
        if (IsArray(variable_values)) {
            let mixedArray = variable_values.map(el=>parseFloat(el))
            let floatArray = mixedArray.filter( (value) => !isNaN(value) )
            return floatArray
        } else {
            return parseFloat(variable_values)
        }

    } else if (variable_type == 'string') {
        if (IsArray(variable_values)) {
            let stringArray = variable_values.map(el=> String(el))
            return stringArray
        } else {
            return String(variable_values)
        }

    } else if (variable_type == 'date') {
        //only checks for single value. No array conversion
        var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
        var moment_date = moment(variable_values, date_formats, true)
        if (moment_date.isValid()) {
            return moment_date.format('YYYY-MM-DD')
        } else {
            return null
        }
    }
}

function ColumnMapReturn(columnMap, variable_name) {
    /*

    */
    if (columnMap.hasOwnProperty(variable_name)) {
        return columnMap[variable_name]
    } else {return null}
}

function IsArray(variable_values) {
    return Array.isArray(variable_values)
}


//
module.exports = {
    'CreateQueryParamaters': CreateQueryParamaters,
    'ExtractPaginationDataFromReq': ExtractPaginationDataFromReq,
    'OrderClause': OrderClause,
    'PaginationClause': PaginationClause,
    'ExtractPaginationData': ExtractPaginationData,
    'WhereClause': WhereClause,
    'WhereDate': WhereDate,
    'WhereIn': WhereIn,
    'WhereQuickFilter': WhereQuickFilter,
    'WhereStringEqual': WhereStringEqual,
    'WhereServerQuery': WhereServerQuery,
    'WhereNumericalComparision': WhereNumericalComparision,
    'IsEmptyStatement': IsEmptyStatement
}