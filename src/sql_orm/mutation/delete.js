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
const rp = require('../../route_parser')
const rs = require('./return_str.js')


function delete_statement(schema_name, table_name, row_data, delete_params){ // row_id, return_param = 'id', return_options = null) {
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)

    let returning_string = rs.ReturningStr(return_param, return_options)
    let out_text = `DELETE FROM "${schema_name}"."${table_name}" WHERE id =$1 ${returning_string}`.trim()
    return { "text": out_text, "values": [row_id] }

}

function delete_at_statement(schema_name, table_name, row_data, delete_params){ // row_id, return_param = 'id', return_options = null) {
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    let returning_string = rs.ReturningStr(return_param, return_options)
    let out_text = `UPDATE "${schema_name}"."${table_name}" set _deleted_at = current_timestamp WHERE id =$1 ${returning_string}`.trim()
    return { "text": out_text, "values": [row_id] }
}

function DefaultDeleteParams(delete_params) {

    // row_id, return_param = 'id', return_options = null

}

module.exports = {
    'delete_statement': delete_statement,
    'delete_at_statement': delete_at_statement
}