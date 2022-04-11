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
const sutil = require('../../sutils')
// IsReservedColumn


let insert_params = [{
    "default_fields": "",
    "on_conflict": "",
    "on_constraint": "",
    "do_nothing": "", //nothing or update
    "set_fields": ""
}]


function insert_statement(schema_name, table_name, row_data, init_insert_params, return_param = "id", return_options = null) {
    /*
    Batch size?
    */
    //if on conflict or on restraint
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    let values = []
    let insert_params = ParseInsertParams(init_insert_params, row_data)

    let insert_cv_string     = _insert_statement_params(row_data, insert_params, values)
    let constraint_string    = on_contraint(row_data, insert_params)
    let returning_string     = rs.ReturningStr(return_param, return_options)
    let query = `INSERT INTO "${schema_name}"."${table_name}" ${insert_cv_string} ${constraint_string} ${returning_string}`.trim()

    return { "text": query, "values": values } 
}

function ParseInsertParams(init_params, row_data) {
    let insert_params = {
        "default_fields": {},
        "on_conflict": "",
        "on_constraint": "",
        "do_nothing": false, //nothing or update
        "set_fields": []
    }
    if (! sutil.IsObject(init_params) ) { return insert_params }
    ParseDefaultAndSetFields(insert_params, init_params, row_data)
    ParseConflictFields(insert_params, init_params)
}

function ParseDefaultAndSetFields(insert_params, init_params) {
    /*
        Determines values for set. Also determines if default_values can be used as a replacement when
        column value is set to null
    */
    let set_fields = []
    if (init_params.hasOwnProperty('default_fields')) { 
        let dx = init_params['default_fields']
        if (sutil.IsObject(dx) ) {
            insert_params['default_fields'] = rp.DefaultObject(dx)
        } 
    }
    if ( init_params.hasOwnProperty('set_fields')) {
        let sx = update_params['set_fields']
        if (Array.isArray(sx) ) {
            for( var i = 0; i< sx; i++) {
                let cn = String(sx[i])
                rp.IsReservedOrInvalidColumn(cn,true)
                if (row_data.hasOwnProperty(cn)) {
                    set_fields.push(`${cn}`)
                } else {
                    let row_keys = row_data.keys()
                    throw new Error(`${cn} not in row_data fields ${row_keys}`)
                }
            }
            insert_params['set_fields'] = set_fields
        }
    }
}

function _insert_statement_params(row_data, insert_params, values ) {
    let vplaceholder = []
    let columns = []
    let values = []
    let i = 1

    let def_object = insert_params['default_fields']

    for (const column_name of Object.keys(row_data) ) {
        //skip special values
        rp.CheckIdentifierError(column_name)
        let cvalue = row_data[column_name]

        if (def_object.hasOwnProperty(column_name) && cvalue === null ) {
            columns.push(column_name)
            vplaceholder.push(def_object[column_name])
        } else {
            let pholder = `$${i}`
            i += 1
            vplaceholder.push(pholder)
            columns.push(column_name)
            values.push(cvalue)
        }
    }
    let cstring = columns.join(" , ")
    let vstring = vplaceholder.join(" , ")
    return `(${cstring}) VALUES (${vstring})`
}

//upsert
function on_contraint() {
    //if onconflict or on_restraint append set
    let set_str = set_generator(insert_params['set_fields'])
    if (insert_params['on_conflict'] != "") {
        let conflict_name = insert_params['on_conflict']
        rp.CheckIdentifierError(conflict_name)
        let const_str = `ON CONFLICT ("${conflict_name}")`
        return `${const_str} ${set_str}`
    } else if (insert_params['on_constraint'] != "" ) {

        let constraint_name = insert_params['on_constraint']
        rp.CheckIdentifierError(conflict_name)
        let const_str = `ON CONFLICT ON CONSTRAINT "${constraint_name}"`
        return `${const_str} ${set_str}`
    } else if (insert_params['do_nothing']) { return "DO NOTHING" }
    else { return "" }
}

function set_generator(set_fields) {
    let sx = []
    for (var i = 0; i<set_fields.length; i++) {
        let cname = set_fields[i]
        rp.CheckIdentifierError(cname)
        sx.push(`"${cname}" = EXCLUDED."${cname}"`)
    }
    if (sx.length > 0 ) {
        let set_string = "UPDATE SET " + sx.join(" , ")
        return set_string
    } else {
        return "DO NOTHING"
    }
}



module.exports = {
    'insert_statement': insert_statement
}