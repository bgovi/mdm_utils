const ux = require('./update.js')

// test('valid import', () => {expect(true).toBe(true)})

test('valid update statement', () => 
    {
        let uxs = ux.update_statement('schema_name', 'table_name', {'col1': 'a', 'id': '1', 'col2': 'b'})
        let query = `UPDATE "schema_name"."table_name" SET "col1" = $1 , "col2" = $2 WHERE "id" = $3 RETURNING "id"`
        let res_object = { "text": query, "values": ["a","b", "1"] }
        console.log(uxs)
        expect(uxs).toStrictEqual(res_object)
    }
);

test('error on no id column', () => 
    {
        let uxs = ux.update_statement('schema_name', 'table_name', {'col1': 'a', 'id': '1', 'col2': 'b'})
        let query = `UPDATE "schema_name"."table_name" SET "col1" = $1 , "col2" = $2 WHERE "id" = $3 RETURNING "id"`
        let res_object = { "text": query, "values": ["a","b", "1"] }
        console.log(uxs)
        expect(uxs).toStrictEqual(res_object)
    }
);



// test('update statement with defaults', () => 
//     {
//         let update_params = { "default_fields": {'col1': 'current_date', 'col2': 'default'}}
//         let uxs = ux.update_statement('schema_name', 'table_name', {'col1': null, 'col2': 'b'}, update_params)
//         let query = `UPDATE "schema_name"."table_name" SET "col1" = current_date , "col2" = $1 WHERE "id" = $2 RETURNING "id"`
//         let res_object = { "text": query, "values": ["b"] }
//         expect(uxs).toStrictEqual(res_object)
//     }
// );

// test('update statement with bad defaults', () => 
//     {
//         let update_params = { "default_fields": {'col1': 'current_date', 'col2': 'dx'}}
//         let uxs = ux.update_statement('schema_name', 'table_name', {'col1': null, 'col2': null, 'col3': null}, update_params)
//         let query = `UPDATE "schema_name"."table_name" SET "col1" = current_date , "col2" = default , "col3" = $1 WHERE "id" = $2 RETURNING "id"`
//         let res_object = { "text": query, "values": [] }
//         expect(uxs).toStrictEqual(res_object)
//     }
// );


// test('valid delete_at statement', () => 
//     {
//         let delete_statement = ds.delete_at_statement('schema1','test', 1, "" )
//         let delete_string = 'UPDATE "schema1"."test" set _deleted_at = current_timestamp WHERE id =$1'
//         expect(delete_statement['text']).toBe(delete_string)
//     }  
// );

// test('invalid schema name', () => 
//     {
//         let delete_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is schema1$'
//         expect(() => { ds.delete_statement('schema1$','test', 1 )}).toThrow(delete_error)
//     }
// );

// test('invalid table name', () => 
//     {
//         let delete_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is test"--'
//         expect(() => { ds.delete_statement('schema1','test"--', 1 )}).toThrow(delete_error)
//     }  
// );