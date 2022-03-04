/*
This module contains functions for postgres identifier syntax. The only naming conventions that are allowed
are alpha numeric strings along with underscores.

No special characters are allowed. This requirement must be enforced to prevent sql injection.
*/
function valid_identifier(ident_str) {
    //Test string has no special characters. 
    return ident_str.match(/^[A-Za-z0-9_]+$/) != null
}

function check_identifier_error(ident_str) {
    error_string = `schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is ${ident_str}`
    if (! valid_identifier(ident_str))  {
        throw new Error(error_string)
    }
}

module.exports = {
    'valid_identifier': valid_identifier,
    'check_identifier_error': check_identifier_error
}