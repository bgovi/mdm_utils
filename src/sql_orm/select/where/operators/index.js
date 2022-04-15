/* 
operator construction

// a BETWEEN x AND y
// a NOT BETWEEN x AND y
// BETWEEN SYMMETRIC (does automatic swap)

*/
let valid_operators = {'=': '=', '!=': '!=', 
    '<>': '<>', '>':'>', '>=': '>=', 
    '<': '<', '<=': '<=', 'in':'in',
    'not_in': "NOT IN", 
    'similar': "SIMILAR TO", 'not_similar': "NOT SIMILAR TO",
    'like': "LIKE",  'not_like': "NOT LIKE", 'ilike': "ILIKE",
    'not_ilike': "NOT ILIKE",
    'between': "BETWEEN SYMMETRIC", 'not_between': "NOT BETWEEN SYMMETRIC" , 'is_null': "IS NULL", 
    'is_not_null': "IS NOT NULL"
}

const rp = require('../../../route_parser')
const sutil = require('../../../sutils')

function CreateBooleanStatement(operator, column_name, placeholder_1, placeholder_2 = 'null' ) {
    //check column is valid identifier.
    let ox = operator
    let cn = column_name

    if (valid_operators.hasOwnProperty(ox) ) {
        let oval = valid_operators[ox]
        if ( ox === 'between' || ox === 'not_between'  ) { return `( ${cn} ${oval} ${placeholder_1} AND ${placeholder_2} )` }
        else { return `( ${cn} ${oval} ${placeholder_1} )` }
    }
    else { throw new Error(`Invalid Operator: ${ox}`) }
}

let truth_values = [ 't', 'true', 'y', 'yes', 'on', '1', 1, true ]
let false_values = [ 'f', 'false', 'n', 'no', 'off', '0',0,false]



function BooleanDatatypeStatement(filter_params, index, values ) {
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









function IsValidColumnName() {}

module.exports = {
    "CreateBooleanStatement": CreateBooleanStatement
}