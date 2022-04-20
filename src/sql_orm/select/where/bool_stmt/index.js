/* 
operator construction

// a BETWEEN x AND y
// a NOT BETWEEN x AND y
// BETWEEN SYMMETRIC (does automatic swap)

//// AND	Logical operator AND
// OR	Logical operator OR

//array of arrays
[
    {}
]


{
 'join_type':
 'data': []
}

'lt','le', 'gt','ge', 'between', 'not_between', 'eq', 'neq',

*/

//var operators = ['in', 'not_in', 'lt','le', 'gt','ge', 'between', 'not_between', 'eq', 'neq', 'like','ilike']
const rp = require('../../../route_parser')

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
let like_in  = ['like_in', 'not_like_in', 'ilike_in', 'not_ilike_in' ]


// const sutil = require('../../../sutils')

function CreateBooleanStatement(quoted_column_name, operator, placeholder ) {
    //check column is valid identifier.
    let ox = operator
    let cn = quoted_column_name

    //split_placholder in CreateBooleanStatement
    InvalidOperatorError(operator)
    let oval = valid_operators[ox]
    if ( ox === 'between' || ox === 'not_between'  ) { 
        let px = ParseBetweenPlaceholder(placeholder)
        return `( ${cn} ${oval} ${px[0]} AND ${px[1]} )`
    }
    else if ( like_in.includes(ox) ) { 
        return `(${cn} ${oval} ( ARRAY[ ${placeholder_1} ] ) )`
    }
    else if ( ox === 'in' || ox == 'not_in') { 
        return `(${cn} ${oval} ( ${placeholder} ) )`
    }
    else { return `( ${cn} ${oval} ${placeholder} )` }
}

function ParseBetweenPlaceholder (pvalue) {
    let x = pvalue.split(",")
    if (x.length >= 2) { return [ x[0].trim(), x[1].trim() ] }
    else if (x.length == 1) { return [ x[0].trim(), 'null' ] }
    else {return ['null', 'null']}
}

function InvalidOperatorError(operator_name) {
    if (! valid_operators.hasOwnProperty(operator_name) ) {  
        throw new Error(`Invalid Operator: ${ox}` )
    }
}

function WhereClause( x, values, index, bind_type ) {
// {'column_name': col_name, 'operator': 'not_in', 'value':  StringifyArray(value) }
// add illegal character array value -1- -2-

    //let x = {}
    //use shift
    let bx = []

    for (var i =0 ; i <x.length; i++) {
        let cn = x.column_name
        let cv = x.value
        let op = x.operator

        rp.CheckIdentifierError(cn)
        let bparams = bindp.AddBindParameters(cn, cv, {}, values, index, bind_type)
        index = bparams.new_index
        let quoted_column_name = `"${column_name}"`
        let placeholder = bparams.pholder
        let y = CreateBooleanStatement(quoted_column_name, op, placeholder)
        bx.push(y)
    }
    let wstring = WhereClauseJoin( bx )
    let z = { "text": query_output, "values": values, "new_index": index }
    return z
}

function WhereClauseJoin( where_list ){
    //make aysnc for promise stuff??
    if (where_list.length > 0) {
        var where_string = 'WHERE ' + where_list.join(' AND ') +'\n'
        return where_string
    } else { return '' }
}

module.exports = {
    "CreateBooleanStatement": CreateBooleanStatement
}