

//timestamp, TIMESTAMP WITH TIME ZONE
//

/*
Y	Years
M	Months (in the date part)
W	Weeks
D	Days
H	Hours
M	Minutes (in the time part)
S	Seconds
date
time
exists?

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