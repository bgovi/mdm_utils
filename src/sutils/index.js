function IsObject (x) {
    if (typeof x === 'object' && !Array.isArray(x) && x !== null ) { return true }
    else { return false}
}

function IsString (x) {
    if (typeof myVar === 'string' || myVar instanceof String) {return true}
    else { return false }
}

function IsArray (x) {
    return Array.isArray(x)    
}

//ToPgArray
function ToPgJson (x) {
    return JSON.stringify(x)
}

function ToPgArray (x) {
// ARRAY [ '(408)-589-5846','(408)-589-5555' ]
// '{"(408)-589-5842","(408)-589-58423"}'
    
}

function ArrayToSubQuery (x) {
    //converts to (x,y,z) etc
    //value IN (value1,value2,...)
}


module.exports = {
    'IsObject': IsObject,
    'IsString': IsString,
    'IsArray': IsArray
}