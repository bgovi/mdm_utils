/*
Responsible for creating insert, batch_insert, upsert and batch upsert

pass default values. ignore _updated_at_, _created_at_, _last_modified_by_, id

INSERT INTO schema.table_name (columns) VALUES ( ) RETURNING *;

BatchInsert

Upsert

Batch Insert

set default set null

payload (null as default)

let insert_params = [{
    "default_fields": "",
    "on_conflict": "",
    "on_constraint": "",
    "set_fields": ""
}]

*/
const rp = require('../../route_parser')


let insert_params = [{
    "default_fields": "",
    "on_conflict": "",
    "on_constraint": "",
    "set_fields": ""
}]


function insert_statement(schema_name, table_name, row_data, insert_params) {
    /*
    Batch size?
    */
    //if on conflict or on restraint

    rp.valid_identifier

    for (const key of Object.keys(row_data) )


    //check_row_data has valid identifier
    //check on_conflict and or on_constraint is valid identifier

    return { "query": `INSERT INTO "${schema_name}"."${table_name}" ${columns} VALUES ${values}`, "params": [row_id] }

    //returning?

}

function upsert_statement (schema_name, table_name, row_data, insert_params) {

    


}


function parameter_generator(row_data) {
    let params = []
    let placeholder = []
    let columns = []
    for (const [key, value] of Object.entries(object1)) {
        columns.push[key]
    }
}

function parameter_generator(row_data) {
    let params = []
    let placeholder = []
    let i = 1
    for (const [key, value] of Object.entries(object1)) {
        console.log(`${key}: ${value}`);
        params.push(value)
        placeholder.push(`${i}`)
        i+=1
      }
}

function append_raw_value() {

}



//create $1 and default values?
//onconflicts?
//1600 columns