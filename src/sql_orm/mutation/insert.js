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
const rs = require('./return_str.js')

// IsReservedColumn


let insert_params = [{
    "default_fields": "",
    "on_conflict": "",
    "on_constraint": "",
    "do": "", //nothing or update
    "set_fields": "",
    "returning": ""
}]


function insert_statement(schema_name, table_name, row_data, insert_params) {
    /*
    Batch size?
    */
    //if on conflict or on restraint
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    let place_holder = []
    let columns = []
    let values = []
    let v_index = {'vid': 1}
    let def_object = rp.DefaultObject(insert_params['default_fields'])

    for (const column_name of Object.keys(row_data) ) {
        //skip special values
        rp.CheckIdentifierError(column_name)
        let cvalue = row_data[column_name]
        parameter_generator(column_name, cvalue, place_holder, values, v_index, def_object, columns)
    }

    let set_fields = []
    let return_string = rs.ReturningStr(insert_params['returning'])
    //if onconflict or on_restraint append set
    if (insert_params['on_conflict'] && insert_params['set_fields']) {
        let conflict_name = insert_params['on_conflict']
        rp.CheckIdentifierError(conflict_name)
        `ON CONFLICT ("${conflict_name}")` 


        //onconflict is valid

    } else if (insert_params['on_constraint'] && insert_params['set_fields'] ) {
        //oncontraint is valid

    } else {

    }


    return { "text": `INSERT INTO "${schema_name}"."${table_name}" ${columns} VALUES ${place_holder}`, "values": values }

    //returning

}

function on_conflict (schema_name, table_name, row_data, insert_params) {

}

function on_contratint (schema_name, table_name, row_data, insert_params) {

}


function parameter_generator(column_name, cvalue, place_holder, values, v_index, def_object, columns) {
    if (def_object.hasOwnProperty(column_name) && cvalue === null ) {
        columns.push(column_name)
        place_holder.push(def_object[column_name])
    } else {
        let pholder = `$${v_index.vid}`
        v_index.vid += 1
        place_holder.push(pholder)
        columns.push(column_name)
        values.push(cvalue)
    }
}

function set_generator(row_data) {
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