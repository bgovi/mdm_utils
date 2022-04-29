/*
Creates pagination  limit and offset statements

*/
const sutil = require('../../sutils')

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
        ox = parseInt(limit_value)
        if (ox < 0 ) { ox = 0 }
    }
    let sx = String(ox)
    InvalidPaginaitionValueError(sx, 'OFFSET')
    return `OFFSET ${sx}`
}



function CreateLimit( limit_value, max_limit ) {
    InvalidMaxLimitError(max_limit)
    let mx = parseInt(mx)
    let lx = mx
    if (sutil.IsInteger(limit_value) ) {
        let tx = parseInt(limit_value)
        if (tx > 0 && tx < mx ) { lx = tx }
    }
    let sx = String(lx)
    InvalidPaginaitionValueError(sx,'LIMIT')
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
