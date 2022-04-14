const ux = require('./update.js')

// test('valid import', () => {expect(true).toBe(true)})

test('valid update statement', () => 
    {
        //UpdateStatement(schema_name, table_name, row_data, values, index, update_params )
        let values = []
        let uxs = ux.UpdateStatement('schema_name', 'table_name', {'col1': 'a', 'id': '1', 'col2': 'b'}, values, 1, null)
        let query = `UPDATE "schema_name"."table_name" SET "col1" = $1 , "col2" = $2 WHERE "id" = $3 RETURNING "id"`
        let res_object = { "text": query, "values": ["a","b", "1"], "new_index": 4 }
        expect(uxs).toStrictEqual(res_object)
    }
);

// test('error on no id column', () => 
//     {
//         let args = {'col1': 'a', 'col2': 'b'}
//         expect(() => { ux.update_statement('schema_name', 'table_name', args)}).toThrow()
//     }
// );



// test('update statement with defaults', () => 
//     {
//         let update_params = { "default_fields": {'col1': 'current_date', 'col2': 'default'}}
//         let uxs = ux.update_statement('schema_name', 'table_name', {'col1': null, 'col2': 'b', 'id': 1}, update_params)
//         let query = `UPDATE "schema_name"."table_name" SET "col1" = current_date , "col2" = $1 WHERE "id" = $2 RETURNING "id"`
//         let res_object = { "text": query, "values": ["b", '1'] }
//         expect(uxs).toStrictEqual(res_object)
//     }
// );

// test('update statement with bad defaults', () => 
//     {
//         let update_params = { "default_fields": {'col1': 'current_date', 'col2': 'dx'}}
//         let uxs = ux.update_statement('schema_name', 'table_name', {'col1': null, 'col2': null, 'col3': null, 'id': 2}, update_params)
//         let query = `UPDATE "schema_name"."table_name" SET "col1" = current_date , "col2" = default , "col3" = $1 WHERE "id" = $2 RETURNING "id"`
//         let res_object = { "text": query, "values": [null, "2"] }
//         expect(uxs).toStrictEqual(res_object)
//     }
// );

// test('invalid schema name', () => 
//     {
//         let literal_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is schema1$'
//         expect(() => { ux.update_statement('schema1$','test', 1 )}).toThrow(literal_error)
//     }
// );

// test('invalid table name', () => 
//     {
//         let literal_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is test"--'
//         expect(() => { ux.update_statement('schema1','test"--', 1 )}).toThrow(literal_error)
//     }  
// );

// test('invalid column name', () => 
//     {
//         let literal_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is col1"'
//         expect(() => { ux.update_statement('schema1','test', {'col1"': null} )}).toThrow(literal_error)
//     }  
// );
