/*
For updates

let update_params = [{
    "default_fields": {'column_name': postgres_default},
    "set_fields": [column_name1, column_name2]
}]

*/
const rp = require('../../route_parser')
const rs = require('./return_str.js')
const sutil = require('../../sutils')
const bindp = require('../bindp')


//(schema_name, table_name, row_data, values, index, delete_params)
function UpdateStatement(schema_name, table_name, row_data, values, index, update_params ){
    /*
    Assembles update_statment
    */
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    let params = sutil.DefaultParams(update_params)
    sutil.MissingId(row_data, 'update')

    let update_str_params = CreateSetStatement(row_data, params, values, index)
    let returning_string = rs.ReturningStr(params.return_param, params.return_options)
    let query = `UPDATE "${schema_name}"."${table_name}" SET ${update_str_params.set_str} WHERE ${update_str_params.where_str} ${returning_string}`.trim() +';'
    let xs = { "text": query, "values": values, 'new_index': update_str_params.new_index }
    return xs
}

function CreateSetStatement(row_data, params, values, index) {
    /*
    Create set_string, where_string and array of values for bind parameters
    */
    let e_param        = ExtractParameters(row_data, params)
    let set_fields     = e_param['set_fields']
    let default_object = e_param['default_object']

    let set_object = []
    if (set_fields.length == 0) {
        throw new Error('set array is empty. initial array may have contained reserved or illegal names')
    }

    for (var j =0; j<set_fields.length; j++) {
        let sx = set_fields[j]
        if (default_object.hasOwnProperty(sx) && row_data[sx] === null ) {
            let pg_default = default_object[sx]
            set_object.push( `"${sx}" = ${pg_default}`   )
        }
        else {
            let bparams = bindp.AddBindParameters(sx, row_data[sx], {}, values, index, params.bind_type, array_type = params.array_type)
            set_object.push( `"${sx}" = ${bparams.pholder}`   )
            index =  bparams.new_index
        }
    }
    let set_str = set_object.join(" , ")
    let bparams = bindp.AddBindParameters('id', row_data['id'], {}, values, index, params.bind_type, array_type = params.array_type)
    let id_pos = `"id" = ${bparams.pholder}`
    let update_str_params = {'set_str': set_str, 'new_index': bparams.new_index, 'where_str': id_pos}
    return update_str_params
}

function ExtractParameters(row_data, update_params) {
    /*
        Determines values for set. Also determines if default_values can be used as a replacement when
        column value is set to null
    */
    let def_object = {}
    let set_fields = []

    if (sutil.IsObject(update_params))
    {
        if (update_params.hasOwnProperty('default_fields')) { 
            let dx = update_params['default_fields']
            if ( sutil.IsObject(dx) ) { def_object = rp.DefaultObject(dx) } 
        }
        if ( update_params.hasOwnProperty('set_fields')) {
            let sx = update_params['set_fields']
            if (sutil.IsArray(sx) ) {
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
            }
        }
    }
    if (set_fields.length == 0 ) {
        let rx = Object.keys(row_data)
        for( var i = 0; i< rx.length; i++) {
            let cn = String(rx[i])
            if (rp.IsReservedColumn(cn) ) {continue}
            rp.CheckIdentifierError(cn)
            set_fields.push(`${cn}`)
        }
    }
    return {'default_object': def_object, 'set_fields': set_fields}
}

module.exports = {
    'UpdateStatement': UpdateStatement
}