/* 
This module is used to create a boolean conditions from a set of filter parameters

filter_parameter: 'quoted_column_name': "col_name1", 'operator': '=', 'value':  '$1' }

returns:
    ( "col_name1" =  $1 )

*/

//var operators = ['in', 'not_in', 'lt','le', 'gt','ge', 'between', 'not_between', 'eq', 'neq', 'like','ilike']

let valid_operators = {'=': '=', '!=': '!=', 
    '<>': '<>', '>':'>', '>=': '>=', 
    '<': '<', '<=': '<=', 
    
    'lt': '<', 'le':'<=' , 'gt': '>',
    'ge': '>=', 'eq': '=', 'neq': '!=',
    'in':'IN',
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
    /*
    combines the input values into a string representing the boolean condition
    */
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
        // replacementObject[repName] = '%'+varx+'%'
        //if use placeholder with % wrap placeholder strings in concatenated %. i.e. '%'||$1||'%', '%'||$2||'%',  
        return `( ${cn} ${oval} ( ARRAY[ ${placeholder} ] ) )`
    } 
    else if ( ox === 'is_not_null' || ox === 'is_null' ) { 
        return `( ${cn} ${oval} )`
    }
    else if ( ox === 'in' || ox == 'not_in') { 
        return `( ${cn} ${oval} ( ${placeholder} ) )`
    }
    else { return `( ${cn} ${oval} ${placeholder} )` }
}

function ParseBetweenPlaceholder (pvalue) {
    //Used to prepare placeholder value for between and not_between operators.
    //These have two placeholders where as other operators only have one
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


module.exports = {
    "CreateBooleanStatement": CreateBooleanStatement
}