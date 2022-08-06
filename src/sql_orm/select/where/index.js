/*
It looks like you may have been close based on your comment to @ebohlman's answer. 
You can use WHERE id = ANY($1::int[]). PostgreSQL will convert the array to the type the parameter is cast to in $1::int[].
So here's a contrived example that works for me:

Is type conversion necessary? probably

https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query


OPERATORS: 

=	Equal
>	Greater than
<	Less than
>=	Greater than or equal
<=	Less than or equal
<> or !=	Not equal
AND	Logical operator AND
OR	Logical operator OR
IN	Return true if a value matches any value in a list
BETWEEN	Return true if a value is between a range of values
NOT BETWEEN 
LIKE	Return true if a value matches a pattern
IS NULL	Return true if a value is NULL
NOT	Negate the result of other operators

a BETWEEN x AND y
a NOT BETWEEN x AND y
BETWEEN SYMMETRIC (does automatic swap)

https://www.lateral.io/resources-blog/full-text-search-in-milliseconds-with-postgresql
https://stackoverflow.com/questions/22639883/concat-two-postgresql-tsvector-fields-originating-in-separate-tables-into-single

quick_filter: this is similar to the like clause, but all columns names in the columnMap are concatenated together
    so that the quick_filter value is compared against all columns in a row.

//public route probably read only
//public crud_route
//public_insert
//public_update
//public_delete

data_type: string, float, int, etc. Determines what the value type should be in the value object or a list of data.
    used to do a final conversion check?
    //attempt type cast and filter. //data_types // integer, float, date, string, boolean




*/

// function CreateBooleanStatementArray(where_statements, values, bindp) {
//     //filter_parameter: 'quoted_column_name': "col_name1", 'operator': '=', 'value':  '$1' 
//     // CreateBooleanStatement(quoted_column_name, operator, placeholder )

// }

// function AssembleWhereClause( boolean_array) {

// }


// sx.CreateFullTextSearch(query_string_pholder, quoted_object_name, tsquery_function, tsq_name, tsv_name, tsr_name, is_tsvector)

const rp = require('../../../route_parser')
const bindp = require('../../bindp')
const bstmt = require('./bool_stmt')
const sfilt = require('./search_filter')

function WhereStatement( where_statements, values, index, select_params ) {
    let bind_type  = select_params['bind_type']
    let where_data = CreateBooleanArray(where_statements, values, index, bind_type)
    let where_str  = WhereClauseJoin(where_data['boolean_array'])
    return {'where_str': where_str, 'new_index': where_data['new_index']}
}


function CreateBooleanArray( where_statements, values, index, bind_type ) {
    // {'column_name': col_name, 'operator': 'not_in', 'value':  StringifyArray(value) }
    // add illegal character array value -1- -2-
    //let x = {}
    //use shift
    let bx = []

    for (var i =0 ; i < where_statements.length; i++) {
        let cn = where_statements[i].column_name
        let cv = where_statements[i].value
        let op = where_statements[i].operator

        rp.CheckIdentifierError(cn)
        if (op === 'is_not_null' || op === 'is_null' ) {
            let quoted_column_name = `"${cn}"`
            let y = bstmt.CreateBooleanStatement(quoted_column_name, op, "")
            bx.push(y)
        } else {
            let bparams = bindp.AddBindParameters(cn, cv, {}, values, index, bind_type)
            index = bparams.new_index
            let quoted_column_name = `"${cn}"`
            let placeholder = bparams.pholder
            let y = bstmt.CreateBooleanStatement(quoted_column_name, op, placeholder)
            bx.push(y)
        }
    }
    return {'boolean_array': bx, 'new_index': index}
}

function WhereClauseJoin( where_list ){
    //make aysnc for promise stuff??
    if (where_list.length > 0) {
        var where_string = 'WHERE ' + where_list.join(' AND\n')
        return where_string
    } else { return '' }
}

module.exports = {
    "CreateBooleanArray": CreateBooleanArray,
    "WhereClauseJoin": WhereClauseJoin,
    "CreateFullTextSearch": sfilt.CreateFullTextSearch,
    "WhereStatement": WhereStatement
}