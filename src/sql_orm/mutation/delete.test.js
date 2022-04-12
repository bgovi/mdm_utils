const ds = require('./delete.js')


test('valid delete statement', () => 
    {
        let delete_statement = ds.delete_statement('schema1','test', 1, "" )
        let delete_string = 'DELETE FROM "schema1"."test" WHERE id =$1'
        expect(delete_statement['text']).toBe(delete_string)
    }
);

test('valid delete statement RETURNING "id"', () => 
    {
        let delete_statement = ds.delete_statement('schema1','test', 1 )
        let delete_string = 'DELETE FROM "schema1"."test" WHERE id =$1 RETURNING "id"'
        expect(delete_statement['text']).toBe(delete_string)
    }
);


test('valid delete_at statement', () => 
    {
        let delete_statement = ds.delete_at_statement('schema1','test', 1, "" )
        let delete_string = 'UPDATE "schema1"."test" set _deleted_at = current_timestamp WHERE id =$1'
        expect(delete_statement['text']).toBe(delete_string)
    }  
);

test('invalid schema name', () => 
    {
        let delete_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is schema1$'
        expect(() => { ds.delete_statement('schema1$','test', 1 )}).toThrow(delete_error)
    }
);

test('invalid table name', () => 
    {
        let delete_error = 'schema, table, functions, constraints and column_names may only A-Za-z0-9_ . Your string is test"--'
        expect(() => { ds.delete_statement('schema1','test"--', 1 )}).toThrow(delete_error)
    }  
);