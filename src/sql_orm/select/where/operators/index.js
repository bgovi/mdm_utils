/* 
operator construction

// a BETWEEN x AND y
// a NOT BETWEEN x AND y
// BETWEEN SYMMETRIC (does automatic swap)

*/
let valid_operators = {'=': '=', '!=': '!=', 
    '<>': '<>', '>':'>', '>=': '>=', 
    '<': '<', '<=': '<=', 'in':'in',
    'not_in': "NOT IN", 
    'similar': "SIMILAR TO", 'not_similar': "NOT SIMILAR TO",
    'like': "LIKE",  'not_like': "NOT LIKE", 'ilike': "ILIKE",
    'not_ilike': "NOT ILIKE",
    'between': "BETWEEN SYMMETRIC", 'not_between': "NOT BETWEEN SYMMETRIC" , 'is_null': "IS NULL", 
    'is_not_null': "IS NOT NULL",
    //create in statements with like and ilike 
    'like_in': "LIKE ANY", 'not_like_in': "NOT LIKE ALL",
    'ilike_in': "ILIKE ANY", 'not_ilike_in': "NOT ILIKE ALL",
}
let like_in = ['like_in', 'not_like_in', 'ilike_in', 'not_ilike_in' ]

// const rp = require('../../../route_parser')
// const sutil = require('../../../sutils')

function CreateBooleanStatement(operator, column_name, placeholder_1, placeholder_2 = 'null' ) {
    //check column is valid identifier.
    let ox = operator
    let cn = column_name

    if (valid_operators.hasOwnProperty(ox) ) {
        let oval = valid_operators[ox]
        if ( ox === 'between' || ox === 'not_between'  ) { return `( ${cn} ${oval} ${placeholder_1} AND ${placeholder_2} )` }
        else if ( like_in.includes(ox) ) {
            // `(${columnName} not ilike ALL (ARRAY [${replacementName}] ) )`
            // `(${columnName} ilike ANY (ARRAY [${replacementName}] ) )`

            //check if ARRAY type casted ? for placeholder_1
            return `(${column_name} ${oval} ( ${placeholder_1} ) )`
        }
        else { return `( ${cn} ${oval} ${placeholder_1} )` }
    }
    else { throw new Error(`Invalid Operator: ${ox}`) }
}

function IsArrayString(pholder) {
    //check if string is in array syntax?
    //check starts with and ends with
    return
}

module.exports = {
    "CreateBooleanStatement": CreateBooleanStatement
}