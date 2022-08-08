const ix = require('./insert.js')

// InsertStatement(schema_name, table_name, row_data,values, index, insert_params )
test('valid insert statement bind_type: $', () => 
    {
        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, [], 1, {} )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) RETURNING "id";`
        let res_object = { "text": query, "values": ["a","1"], "new_index": 3 }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('valid insert statement bind_type: :', () => 
    {
        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, {}, 1, {'bind_type': ':'} )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES (:col1_1 , :Col2_2) RETURNING "id";`
        let res_object = { "text": query, "values": {"col1_1":"a", "Col2_2":"1"}, "new_index": 3 }
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

        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': null}, [], 1, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , default) RETURNING "id";`
        let res_object = { "text": query, "values": ["a"], "new_index": 2 }
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
        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, [], 1, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) ON CONFLICT DO NOTHING RETURNING "id";`
        let res_object = { "text": query, "values": ["a","1"], "new_index": 3 }
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
        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1},[], 1, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) ON CONFLICT ("col1") UPDATE SET "Col2" = EXCLUDED."Col2" RETURNING "id";`
        let res_object = { "text": query, "values": ["a","1"], "new_index": 3 }
        expect(ixs).toStrictEqual(res_object)
    }
);

test('upsert statement onconflict DO NOTHING', () => 
    {
        let insert_params = {
            "default_fields": {'Col2': 'default'},
            "on_conflict": "col1",
            'bind_type': '?'
            // "set_fields": "Col2"
        }
        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': 1}, [], 1, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES (? , ?) ON CONFLICT ("col1") DO NOTHING RETURNING "id";`
        let res_object = { "text": query, "values": ["a","1"], "new_index": 3 }
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
        let ixs = ix.InsertStatement('schema_name', 'table_name', {'col1': 'a', 'Col2': null},[], 1, insert_params )
        let query = `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , default) ON CONFLICT ON CONSTRAINT "col1" UPDATE SET "Col2" = EXCLUDED."Col2" RETURNING "id";`
        let res_object = { "text": query, "values": ["a"], "new_index": 2 }
        expect(ixs).toStrictEqual(res_object)
    }
);

//test batch inserts
// BatchInsertStatement(schema_name, table_name, row_data_array,values, index, insert_params )
test('valid insert statement bind_type: $', () => 
    {
        let cx = [{'col1': 'a', 'Col2': 1}, {'col3': 'x'}]
        let ixs = ix.BatchInsertStatement('schema_name', 'table_name', cx, [], 1, {} )
        let query_output =[ `INSERT INTO "schema_name"."table_name" ("col1" , "Col2") VALUES ($1 , $2) RETURNING "id";`,
            `INSERT INTO "schema_name"."table_name" ("col3") VALUES ($3) RETURNING "id";`]
        let query = query_output.join('\n')
        let res_object = { "text": query, "values": ["a","1", 'x'], "new_index": 4 }
        expect(ixs).toStrictEqual(res_object)
    }
);