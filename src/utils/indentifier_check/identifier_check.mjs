/*
This module contains functions for validating syntax


*/

export default {
    'valid_identifier': function (ident_str) {
        // "^[A-Za-z0-9]+$"
        return ident_str.match(/^[A-Za-z0-9]+$/)

    }
}