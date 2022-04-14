function IsObject (x) {
    if (typeof x === 'object' && !Array.isArray(x) && x !== null ) { return true }
    else { return false}
}

function IsString (x) {
    if (typeof x === 'string' || x instanceof String) {return true}
    else { return false }
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
    'DefaultParams': DefaultParams
}