const ix = require('./insert.js')

test('valid insert statement', () => 
    {
        let ixs = ix.insert_statement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, {} )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) RETURNING "id"`
        let res_object = { "text": query, "values": ["a","1"] }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('insert statement with default', () => 
    {

        let insert_params = {
            "default_fields": {'Col2': 'default'},
            "on_conflict": "",
            "on_constraint": "",
            "set_fields": ""
        }

        let ixs = ix.insert_statement('schema_name', 'table_name', {'col1': 'a', 'Col2': null}, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , default) RETURNING "id"`
        let res_object = { "text": query, "values": ["a"] }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('insert on error do nothing', () => 
    {
        let insert_params = {
            "default_fields": {'Col2': 'default'},
            "on_conflict": "",
            "on_constraint": "",
            "set_fields": "",
            "do_nothing": true
        }
        let ixs = ix.insert_statement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) ON CONFLICT DO NOTHING RETURNING "id"`
        let res_object = { "text": query, "values": ["a","1"] }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('upsert statement onconflict with set', () => 
    {
        let insert_params = {
            "default_fields": {'Col2': 'default'},
            "on_conflict": "col1",
            "set_fields": "Col2"
        }
        let ixs = ix.insert_statement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) ON CONFLICT ("col1") UPDATE SET "Col2" = EXCLUDED."Col2" RETURNING "id"`
        let res_object = { "text": query, "values": ["a","1"] }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('upsert statement onconflict DO NOTHING', () => 
    {
        let insert_params = {
            "default_fields": {'Col2': 'default'},
            "on_conflict": "col1"
            // "set_fields": "Col2"
        }
        let ixs = ix.insert_statement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) ON CONFLICT ("col1") DO NOTHING RETURNING "id"`
        let res_object = { "text": query, "values": ["a","1"] }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('upsert statement onconflict with set', () => 
    {
        let insert_params = {
            "default_fields": {'Col2': 'default'},
            "on_constraint": "col1",
            "set_fields": ["Col2"]
        }
        let ixs = ix.insert_statement('schema_name', 'table_name', {'col1': 'a', 'Col2': null}, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , default) ON CONFLICT ON CONSTRAINT "col1" UPDATE SET "Col2" = EXCLUDED."Col2" RETURNING "id"`
        let res_object = { "text": query, "values": ["a"] }
        expect(ixs).toStrictEqual(res_object)
    }
);

/*
Repeat with replacements

*/