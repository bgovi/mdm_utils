/*
filter_params: [{'column_name': , 'operation': , 'value':  , 'data_type': ''}]


*/
const rp = require('../../../route_parser')
const sutil = require('../../../sutils')

let truth_values = [ 't', 'true', 'y', 'yes', 'on', '1', 1, true ]
let false_values = [ 'f', 'false', 'n', 'no', 'off', '0',0,false]



function BooleanStatement(filter_params, index, values ) {
    let val = filter_params.value
    let column_name = filter_params.column_name
    rp.CheckIdentifierError(column_name)
    if ( sutil.IsNull(val)) { 
        return { "text": "", "values": values, "new_index": index } 
    }
    else if ( truth_values.includes(val) ) {
        return { "text": `"${column_name}" = true`, "values": values, "new_index": index }  
    } else if ( false_values.includes(val) ) {
        return { "text": `"${column_name}" = false`, "values": values, "new_index": index }  
    } else {
        return { "text": "", "values": values, "new_index": index }
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


module.exports = {'BooleanStatement': BooleanStatement}