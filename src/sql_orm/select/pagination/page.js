/*
Creates pagination  limit and offset statements

*/
const sutil = require('../../../sutils')

function PaginationClause(limit_value, offset_value, max_limit = 100000) {
    /*
        limit_value: integer greater than 0 and < max_limit
        offset_value: integer greater than 0
        max_limit: max number of rows that can be returned
    */
    let limit_str  = CreateLimit(limit_value, max_limit)
    let offset_str = CreateOffset(offset_value )
    return  `${limit_str} ${offset_str}`
}


function CreateOffset( offset_value ) {
    let ox = offset_value
    if (sutil.IsInteger(ox) ) {
        ox = parseInt(ox)
        if (ox < 0 ) { ox = 0 }
    } else {ox = 0 }
    let sx = String(ox)
    return `OFFSET ${sx}`
}



function CreateLimit( limit_value, max_limit ) {
    InvalidMaxLimitError(max_limit)
    let lx = parseInt( limit_value)
    if (sutil.IsInteger(lx) ) {
        if (lx < 0 || lx > max_limit ) { lx = max_limit }
    } else {lx = max_limit}
    let sx = String(lx)
    return `LIMIT ${sx}`
}

function InvalidMaxLimitError(max_limit) {
    if (! sutil.IsInteger(max_limit) ) { InvalidPaginaitionValueError(max_limit, 'max LIMIT') }
}

function InvalidPaginaitionValueError(x, pname) {
    if (! sutil.StringIsInteger(x)) {
        throw new Error (`Pagination ${pname} value must be a integer. Your value is: ${x}` )
    }
}

module.exports = { 'PaginationClause': PaginationClause }
