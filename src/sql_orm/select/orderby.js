//handles sort operations
var sort_string  = OrderClause( sort_statements, columnObject['columnMap'] )

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

function ColumnMapReturn(columnMap, variable_name) {
    /*

    */
    if (columnMap.hasOwnProperty(variable_name)) {
        return columnMap[variable_name]
    } else {return null}
}

function create_order_by(order_by) {
    /*
    Creates order_by statement
    order_by = [{'column1','asc}, {'column2':'a'}, {'column3':'desc'}, {'column4':'d'}]
    */
    let ob = order_by

    if (ob == null) {return ""}
    if (! Array.isArray(ob) ) {return ''}
    if (ob.length === 0 ) {return '' }
    let ox = []
    for (var i =0; i<ob.length; i++) {
        let y = ob[i]
        //if not object
        if ( !( typeof y === 'object' && !Array.isArray(y) && y !== null) ) { continue }
        let keys = Object.keys(y)
        if (keys.length === 0) {continue}
        let column_name = String(keys[0])

        if ( ! id_check.valid_identifier(column_name)) { continue }
        let sort_type  = String(y[column_name]).toLowerCase()
        if (sort_type === 'asc' || sort_type === 'ascending' || sort_type === 'a') {
            ox.push(`"${column_name}" ASC` )
        } else if (sort_type === 'desc' || sort_type === 'descending' || sort_type === 'd') {
            ox.push(`"${column_name}" DESC` )
        }
    }
    if (ox.length === 0 ) {return ''}
    return "ORDER BY " + ox.join(' , ')
}




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