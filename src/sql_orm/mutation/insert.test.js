const ix = require('./insert.js')

test('valid insert statement', () => 
    {
        let ixs = ix.insert_statement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, {} )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) RETURNING "id"`
        let res_object = { "text": query, "values": ["a","1"] }
        expect(ixs).toStrictEqual(res_object)
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

// insert_statement(schema_name, table_name, row_data, init_insert_params, return_param = "id", return_options = null)
// let insert_params = [{
//     "default_fields": "",
//     "on_conflict": "",
//     "on_constraint": "",
//     "do_nothing": "", //nothing or update
//     "set_fields": ""
// }]