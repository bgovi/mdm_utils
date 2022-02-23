/*
Responsible for creating insert, batch_insert, upsert and batch upsert

pass default values. ignore _updated_at_, _created_at_, _last_modified_by_, id

INSERT INTO schema.table_name (columns) VALUES ( ) RETURNING *;

BatchInsert

Upsert

Batch Insert

set default set null

payload (null as default)
*/

function insert_statement(schema_name, table_name, row_data, insert_params) {}

function bulk_insert_statement(schema_name, table_name, row_data, insert_params) {}


//insert_params:
function ax () {

    columns = ""
    values  = ""

    `INSERT INTO "${schema_name}"."${table_name}" (columns) VALUES (  )`
}

//onconflicts?
//1600 columns