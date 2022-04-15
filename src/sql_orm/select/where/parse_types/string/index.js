


//equals
//not_equals
//in
//not_in
//like
//ilike

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