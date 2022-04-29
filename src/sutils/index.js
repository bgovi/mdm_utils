function IsObject (x) {
    if (typeof x === 'object' && !Array.isArray(x) && x !== null ) { return true }
    else { return false}
}

function IsString (x) {
    if (typeof x === 'string' || x instanceof String) {return true}
    else { return false }
}

function IsInteger(x) {
    if (Number.isInteger(x)) {return true}
    else if (String(x).match(/^[0-9]+$/) != null ) {return true}
    return false
}

function StringIsInteger(x) {
    if ( x.match(/^[0-9]+$/) != null ) {return true}
    return false
}

function IsNull(x) {
    if (x === null) {return true}
    else{ return false }
}

function IsNumber (x) {
    if (typeof x == "number") { return true }
    else { return false}
}

function IsArray (x) {
    return Array.isArray(x)    
}

function IsBasicType(x) {
    if (IsBoolean(x) || IsString(x) || IsNumber(x)) {return true}
    else { return false }
}

function IsBoolean (x) {

    if (typeof x == "boolean") { return true }
    else { return false}
}

//IsDate
//IsDateTime
//IsTime
//DateConvert
//TimeConvert



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

function HasId (x) {
    if (x.hasOwnProperty('id')) {return true}
    else {return false}
}


function DefaultParams (x) {
    //assembles default params object for crud operations.
    if (! IsObject(x)) {
        return {
            return_param: 'id',
            return_options: null,
            bind_type: '$',
            array_type: null
        }
    }
    if (! x.hasOwnProperty('return_param')) { x['return_param'] = 'id' }
    if (! x.hasOwnProperty('return_option')) { x['return_option'] = null }
    if (! x.hasOwnProperty('bind_type')) { x['bind_type'] = '$' }
    return x
}

function MissingId(row_data, operation) {
    if (! HasId(row_data)) { throw new Error (`${operation} statements require id. No id given in row ${row_data}`) }
}

function ReturnQuotedColumnName(column_name) {
    return `"${column_name}"`
}

module.exports = {
    'IsObject': IsObject,
    'IsString': IsString,
    'IsArray': IsArray,
    'IsBoolean': IsBoolean,
    'IsNumber': IsNumber,
    'IsBasicType': IsBasicType,
    'HasId': HasId,
    'MissingId': MissingId,
    'IsNull': IsNull,
    'IsInteger': IsInteger,
    'StringIsInteger': StringIsInteger,
    'ReturnQuotedColumnName': ReturnQuotedColumnName,
    'DefaultParams': DefaultParams
}