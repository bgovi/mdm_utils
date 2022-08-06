const ux = require('./update.js')

test('valid update statement', () => 
    {
        let values = []
        let uxs = ux.UpdateStatement('schema_name', 'table_name', {'col1': 'a', 'id': '1', 'col2': 'b'}, values, 1, null)
        let query = `UPDATE "schema_name"."table_name" SET "col1" = $1 , "col2" = $2 WHERE "id" = $3 RETURNING "id";`
        let res_object = { "text": query, "values": ["a","b", "1"], "new_index": 4 }
        expect(uxs).toStrictEqual(res_object)
    }
);

test('valid update statement bind_type :', () => 
    {
        let values = {}
        let uxs = ux.UpdateStatement('schema_name', 'table_name', {'col1': 'a', 'id': '1', 'col2': 'b'}, values, 1, {'bind_type': ':'})
        let query = `UPDATE "schema_name"."table_name" SET "col1" = :col1_1 , "col2" = :col2_2 WHERE "id" = :id_3 RETURNING "id";`
        let res_object = { "text": query, "values": {"col1_1":"a","col2_2":"b", "id_3":"1"}, "new_index": 4 }
        expect(uxs).toStrictEqual(res_object)
    }
);

test('error on no id column', () => 
    {
        expect(() => { ux.UpdateStatement('schema_name', 'table_name', {'col1': 'a','col2': 'b'},{} , 1, {'bind_type': ':'})  }).toThrow()
    }
);

test('update statement with defaults', () => 
    {
        let update_params = { "default_fields": {'col1': 'current_date', 'col2': 'default'}}
        let values = []
        let uxs = ux.UpdateStatement('schema_name', 'table_name', {'col1': null, 'col2': 'b', 'id': 1}, values, 1, update_params)
        let query = `UPDATE "schema_name"."table_name" SET "col1" = current_date , "col2" = $1 WHERE "id" = $2 RETURNING "id";`
        let res_object = { "text": query, "values": ["b", '1'], "new_index": 3 }
        expect(uxs).toStrictEqual(res_object)
    }
);

test('update statement with bad defaults', () => 
    {
        let update_params = { "default_fields": {'col1': 'current_date', 'col2': 'dx'}}
        let uxs = ux.UpdateStatement('schema_name', 'table_name', {'col1': null, 'col2': null, 'col3': null, 'id': 2}, [], 1, update_params)
        let query = `UPDATE "schema_name"."table_name" SET "col1" = current_date , "col2" = default , "col3" = null WHERE "id" = $1 RETURNING "id";`
        let res_object = { "text": query, "values": ["2"], "new_index": 2 }
        expect(uxs).toStrictEqual(res_object)
    }
);

test('invalid schema name', () => 
    {
        let literal_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is schema1$'
        expect(() => { ux.UpdateStatement('schema1$','test', {'col1': null, 'id': 1}, [], 1, {} )}).toThrow(literal_error)
    }
);

test('invalid table name', () => 
    {
        let literal_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is test"--'
        expect(() => { ux.UpdateStatement('schema1','test"--', {'col1': null, 'id': 1}, [], 1, {} )}).toThrow(literal_error)
    }  
);

test('invalid column name', () => 
    {
        let literal_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is col1"'
        expect(() => { ux.UpdateStatement('schema1','test', {'col1"': null, 'id': 1}, [], 1, {} )}).toThrow(literal_error)
    }
);