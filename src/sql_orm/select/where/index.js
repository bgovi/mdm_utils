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

function AssembleWhereStatement(post_body, url_params) {
    // var user_id = req_body['user_id']
    // var columnMap = columnObject['columnMap']
    // var columnList = columnObject['columnList']
    // var columnQuickSortString = columnObject['columnQuickSortString']
}

function WhereClause( bool_statements, values, index, bind_type ) {
    // {'column_name': col_name, 'operator': 'not_in', 'value':  StringifyArray(value) }
    // add illegal character array value -1- -2-
    //let x = {}
    //use shift
    let bx = []

    for (var i =0 ; i <x.length; i++) {
        let cn = bool_statements.column_name
        let cv = bool_statements.value
        let op = bool_statements.operator

        rp.CheckIdentifierError(cn)
        if (ox === 'is_not_null' || ox === 'is_null' ) {
            let quoted_column_name = `"${cn}"`
            let y = CreateBooleanStatement(quoted_column_name, op, "")
            bx.push(y)
        } else {
            let bparams = bindp.AddBindParameters(cn, cv, {}, values, index, bind_type)
            index = bparams.new_index
            let quoted_column_name = `"${cn}"`
            let placeholder = bparams.pholder
            let y = CreateBooleanStatement(quoted_column_name, op, placeholder)
            bx.push(y)
        }
    }
    let wstring = WhereClauseJoin( bx )
    let z = { "text": wstring, "values": values, "new_index": index }
    return z
}

function WhereClauseJoin( where_list ){
    //make aysnc for promise stuff??
    if (where_list.length > 0) {
        var where_string = 'WHERE ' + where_list.join(' AND ') +'\n'
        return where_string
    } else { return '' }
}


// function TsVectorAssembly(ts_vector_column, is_table=false ) {
//     //plain text
//     //order by __rank__ desc
//     //append other order by

// }

// function AssembleFromStatements() {
//     // to_tsvector(courses.title || courses.description) document,
//     // to_tsquery('sales') query,
//     // NULLIF(ts_rank(to_tsvector(courses.title), query), 0) rank_title,
// }

// function AssembleOrderByStatements() {

//     //limit 500
// }