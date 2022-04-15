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