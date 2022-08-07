/*
returning_str

Creates the Returning string to append to crud operations.

To skip returning statement use:
    null, [], or ""
the string count(*) is a special command to return all effected rows.
Otherwise potential columns are checked for validity and wrapped in double qoutes.

//returning object?

Returns:
    "" or RETURNING "param1", "param2", ...


returning_param: string or arrray
returning_options: array or {ro: {}, ra: []}

array
if object
ro: return_object
ra: return_array

*/


const rp = require('../../route_parser')

function returning_str(returning_param, returing_options = null) {
    /*
    Creates the Returning string to append to crud operations.
    */
    return AssembleReturning(returning_param, returing_options)
}





function AssembleReturning(returning_param, returning_options){
    let return_array = []
    ParseReturnParam(returning_param, return_array)
    ParseOptions(returning_options, return_array)
    if (return_array.length === 0) { return '' }
    return "RETURNING " + return_array.join(' , ')
}

function ParseOptions(returning_options, return_array) {
    //parses returning_options javascript object
    //used for additional arguments mainly to track which grid node matches crud operation
    if (returning_options === undefined || returning_options === null) { return }
    if (Array.isArray(returning_options)) { ParseArrayValues(returning_options, return_array)}
    else if (typeof returning_options === 'object' && !Array.isArray(returning_options) && returning_options !== null ) {
        if (returning_options.hasOwnProperty('ra')) { ParseArrayValues(returning_options['ra'], return_array) }
        if (returning_options.hasOwnProperty('ro')) { ParseObject(returning_options['ro'], return_array) }
    }
}

function ParseReturnParam(rp, return_array) {
    //parses returning_param
    if (typeof rp === 'string') { ParseStringValue(rp, return_array) }
    else if (Array.isArray(rp)) { ParseArrayValues(rp, return_array)}
    else { return_array.push('*') }
}


function ParseStringValue(input_str, return_array) {
    if (input_str === "") {return }
    else if (input_str === "*") {return_array.push('*')}
    else if (input_str === "count(*)") {return_array.push('count(*)')}
    else if ( rp.ValidIdentifier(input_str)) { return_array.push('"'+input_str+'"') }
}

function ParseArrayValues(input_array, return_array) {
    let rtx = input_array
    if (! Array.isArray(rtx) ) {return }
    if (rtx.length === 0) { return  }
    for (var i =0; i < rtx.length; i++) {
        if ( rp.ValidIdentifier(rtx[i])) {  return_array.push('"'+rtx[i]+'"') }        
    }
}

function ParseObject(input_object, return_array) {
    //key as ""
    if (
        !(typeof input_object === 'object' && !Array.isArray(input_object) && input_object !== null)
    ) { return }
    let keys = Object.keys(input_object)
    for (var i =0; i < keys.length; i++) {
        let key = keys[i]
        let val = input_object[key]
        if ( rp.ValidIdentifier(key) && rp.ValidIdentifier(val) ) {  return_array.push(`${key} as "${val}"`) }        
    }
}


module.exports = { 'ReturningStr': returning_str }


// function returning_str(returning_param, rx = {}) {
//     /*
//     Creates the Returning string to append to crud operations.

//     To skip returning statement use:
//         null, [], or ""
//     the string count(*) is a special command to return all effected rows.
//     Otherwise potential columns are checked for validity and wrapped in double qoutes.

//     //returning object?

//     Returns:
//         "" or RETURNING "param1", "param2", ...
//     */
//     if (returning_param === null) {return ""}


//     if (typeof returning_param === 'string') {
//         if (returning_param === "") {return "" }
//         if (returning_param === "count(*)") {return "RETURNING count(*)"}
//         if ( rp.ValidIdentifier(returning_param)) { return 'RETURNING ' +'"'+returning_param+'"' }
//         else if (returning_param === "*") {return 'RETURNING *'}
//         else { return "" }
//     }
//     let rtx = returning_param
//     if (! Array.isArray(rtx) ) {return ''}
//     if (rtx.length === 0) { return '' }
//     let ax = []
//     for (var i =0; i < rtx.length; i++) {
//         if ( rp.ValidIdentifier(rtx[i])) {  ax.push('"'+rtx[i]+'"') }        
//     }
//     if (ax.length === 0) { return '' }
//     return "RETURNING " + ax.join(' , ')
// }