/*
Responsible for creating insert, batch_insert, upsert and batch upsert

pass default values. ignore _updated_at_, _created_at_, _last_modified_by_, id

INSERT INTO schema.table_name (columns) VALUES ( ) RETURNING *;

BatchInsert

Upsert

Batch Insert

set default set null

payload (null as default)

let insert_params = {
    "default_fields": "",
    "on_conflict": "",
    "on_constraint": "",
    "set_fields": ""
}

*/
const rp = require('../../route_parser')
const rs = require('./return_str.js')
const sutil = require('../../sutils')
const bindp = require('../bindp')
// IsReservedColumn

// function UpdateStatement(schema_name, table_name, row_data, values, index, update_params )

//BatchInsert


function InsertStatement(schema_name, table_name, row_data,values, index, insert_params ){
    /*
    Batch size?
    */
    //if on conflict or on restraint
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    let params = ParseInsertParams(insert_params, row_data)

    let insert_cv_string     = InsertStatementParams(row_data, params, index, values)
    let constraint_string    = on_contraint(insert_params)
    let returning_string     = rs.ReturningStr(return_param, return_options)
    let query1 = `INSERT INTO "${schema_name}"."${table_name}" ${insert_cv_string} ${constraint_string}`.trim()
    let query  = `${query1} ${returning_string}`.trim()

    return { "text": query, "values": values } 
}

function ParseInsertParams(init_params, row_data) {
    //assemble parameters
    let dparams = sutil.DefaultParams(init_params)
    let insert_params = {
        "return_param": dparams ["return_param"],
        "return_options": dparams["return_options"] ,
        "bind_type": dparams["bind_type"],
        "array_type": dparams["array_type"],
        "default_fields": {},
        "on_conflict": "",
        "on_constraint": "",
        "do_nothing": false, //nothing or update
        "set_fields": []
    }
    if (! sutil.IsObject(init_params) ) { return insert_params }
    ParseDefaultAndSetFields(insert_params, dparams, row_data)
    ParseConflictFields(insert_params, dparams)
    return insert_params
}

function ParseConflictFields(insert_params, init_params) {
    //assembles informattion for insert params conflict issues
    if (init_params.hasOwnProperty("on_conflict")) { 
        let dx = init_params["on_conflict"]
        if (sutil.IsString(dx) && dx !== "" ) {
            rp.CheckIdentifierError(dx)
            insert_params['on_conflict'] = dx
        } 
    }
    if (init_params.hasOwnProperty("on_constraint")) { 
        let dx = init_params["on_constraint"]
        if (sutil.IsString(dx) && dx !== "" ) {
            rp.CheckIdentifierError(dx)
            insert_params['on_constraint'] = dx
        } 
    }
    if (init_params.hasOwnProperty("do_nothing")) {
        let dx = init_params["do_nothing"]
        if (sutil.IsBoolean(dx) ) { insert_params['do_nothing'] = dx } 
    }
}


function ParseDefaultAndSetFields(insert_params, init_params, row_data) {
    /*
        Determines values for set. Also determines if default_values can be used as a replacement when
        column value is set to null
    */
    let set_fields = []
    if (init_params.hasOwnProperty('default_fields')) { 
        let dx = init_params['default_fields']
        if (sutil.IsObject(dx) ) { insert_params['default_fields'] = rp.DefaultObject(dx) } 
    }
    if ( ! init_params.hasOwnProperty('set_fields')) { return }

    let sx = init_params['set_fields']
    if (sutil.IsString(sx)) {
        if (sx.trim() === "") {
            insert_params['set_fields'] = set_fields
            return
        }
        rp.IsReservedOrInvalidColumn(sx,true)
        if (row_data.hasOwnProperty(sx)) { set_fields.push(`${sx}`)}
        else {
            let row_keys = row_data.keys()
            throw new Error(`${cn} not in row_data fields ${row_keys}`)
        }
    } else if (Array.isArray(sx) ) {
        for( var i = 0; i< sx.length; i++) {
            let cn = String(sx[i])
            rp.IsReservedOrInvalidColumn(cn,true)
            if (row_data.hasOwnProperty(cn)) {
                set_fields.push(`${cn}`)
            } else {
                let row_keys = row_data.keys()
                throw new Error(`${cn} not in row_data fields ${row_keys}`)
            }
        }
    }
    insert_params['set_fields'] = set_fields
}

function InsertStatementParams(row_data, params, index,values ) {
    // let vplaceholder = []
    let columns = []
    let def_object = params['default_fields']
    let insert_values = []

    for (const column_name of Object.keys(row_data) ) {
        rp.CheckIdentifierError(column_name)
        if( rp.IsReservedColumn(column_name) ) { continue }
        let cvalue = row_data[column_name]
        let bparams = bindp.AddBindParameters(column_name, cvalue, def_object, values, index, params.bind_type, array_type = params.array_type)
        index = bparams.new_index
        columns.push(`"${column_name}"`)
        insert_values.push(bparams.pholder)
    }
    let cstring = columns.join(" , ")
    let vstring = vplaceholder.join(" , ")
    return `(${cstring}) VALUES (${vstring})`
}

function on_contraint(insert_params) {
    //if onconflict or on_restraint append set
    let set_str = set_generator(insert_params['set_fields'])
    if (insert_params['on_conflict'] != "") {
        let conflict_name = insert_params['on_conflict']
        rp.CheckIdentifierError(conflict_name)
        let const_str = `ON CONFLICT ("${conflict_name}")`
        return `${const_str} ${set_str}`
    } else if (insert_params['on_constraint'] != "" ) {

        let constraint_name = insert_params['on_constraint']
        rp.CheckIdentifierError(constraint_name)
        let const_str = `ON CONFLICT ON CONSTRAINT "${constraint_name}"`
        return `${const_str} ${set_str}`
    } else if (insert_params['do_nothing']) { return "ON CONFLICT DO NOTHING" }
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