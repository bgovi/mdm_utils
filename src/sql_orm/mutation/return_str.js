const rp = require('../../route_parser')



// rp.CheckIdentifierError(schema_name)
// rp.CheckIdentifierError(schema_name)

function returning_str(returning_param) {
    /*
    Creates the Returning string to append to crud operations.

    To skip returning statement use:
        null, [], or ""
    the string count(*) is a special command to return all effected rows.
    Otherwise potential columns are checked for validity and wrapped in double qoutes.

    Returns:
        "" or RETURNING "param1", "param2", ...
    */
    if (returning_param === null) {return ""}


    if (typeof returning_param === 'string') {
        if (returning_param === "") {return "" }
        if (returning_param === "count(*)") {return "RETURNING count(*)"}
        if ( rp.ValidIdentifier(returning_param)) { return 'RETURNING ' +'"'+returning_param+'"' }
        else if (returning_param === "*") {return 'RETURNING *'}
        else { return "" }
    }
    let rtx = returning_param
    if (! Array.isArray(rtx) ) {return ''}
    if (rtx.length === 0) { return '' }
    let ax = []
    for (var i =0; i < rtx.length; i++) {
        if ( rp.ValidIdentifier(rtx[i])) {  ax.push('"'+rtx[i]+'"') }        
    }
    if (ax.length === 0) { return '' }
    return "RETURNING " + ax.join(' , ')
}

module.exports = { 'ReturningStr': returning_str }