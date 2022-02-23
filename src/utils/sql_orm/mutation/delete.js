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

function delete_statement(schema_name, table_name, row_id) {

    return { "query": `DELETE FROM "${schema_name}"."${table_name}" WHERE id =$1`, "params": [row_id] }

}