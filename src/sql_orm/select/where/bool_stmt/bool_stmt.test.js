const ix = require('./insert.js')

// InsertStatement(schema_name, table_name, row_data,values, index, insert_params )
test('valid insert statement bind_type: $', () => 
    {
        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, [], 1, {} )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) RETURNING "id"`
        let res_object = { "text": query, "values": ["a","1"], "new_index": 3 }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('invalid table name', () => 
    {
        let values = []
        let delete_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is test"--'
        expect(() => { ds.DeleteStatement('schema1','test"--', {'id': 1}, values, 1, {'bind_type': '$'} )}).toThrow(delete_error)
    }  
);