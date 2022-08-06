const ds = require('./delete.js')


test('valid delete statement bind_type: $', () => 
    {
        let values = []
        let delete_statement = ds.DeleteStatement('schema1','test', {'id': 1}, values, 1, null )
        let ex = { text: 'DELETE FROM "schema1"."test" WHERE id =$1 RETURNING "id";',
            values: [ '1' ], new_index: 2 }
        expect(delete_statement).toStrictEqual(ex)
    }
);

test('valid delete statement bind_type: :', () => 
    {
        let values = {}
        let delete_statement = ds.DeleteStatement('schema1','test', {'id': 1}, values, 1, {'bind_type': ':'} )
        let ex = { text: 'DELETE FROM "schema1"."test" WHERE id =:id_1 RETURNING "id";',
            values: {'id_1': '1'}, new_index: 2 }
        expect(delete_statement).toStrictEqual(ex)
    }
);

test('valid delete statement bind_type: ?', () => 
    {
        let values = []
        let delete_statement = ds.DeleteStatement('schema1','test', {'id': 1}, values, 1, {'bind_type': '?'} )
        let ex = { text: 'DELETE FROM "schema1"."test" WHERE id =? RETURNING "id";',
            values: ['1'], new_index: 2 }
        expect(delete_statement).toStrictEqual(ex)
    }
);


test('valid delete_at statement', () => 
    {
        let values = []
        let delete_statement = ds.DeleteAtStatement('schema1','test', {'id': 1}, values, 1, {'bind_type': '$'} )
        let ex = { text: 'UPDATE "schema1"."test" set _deleted_at = current_timestamp WHERE id =$1 RETURNING "id";',
            values: [ '1' ], new_index: 2 }
        expect(delete_statement).toStrictEqual(ex)
    }
);

test('invalid schema name', () => 
    {
        let values = []
        let delete_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is schema1$'
        expect(() => { ds.DeleteStatement('schema1$','test', {'id': 1}, values, 1, {'bind_type': '$'} )}).toThrow(delete_error)
    }
);

test('invalid table name', () => 
    {
        let values = []
        let delete_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is test"--'
        expect(() => { ds.DeleteStatement('schema1','test"--', {'id': 1}, values, 1, {'bind_type': '$'} )}).toThrow(delete_error)
    }  
);