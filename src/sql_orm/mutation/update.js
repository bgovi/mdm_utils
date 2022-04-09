/*
For updates

let update_params = [{
    "default_fields": {'column_name': postgres_default},
    "set_fields": [column_name1, column_name2]
}]

*/
const rp = require('../../route_parser')
const rs = require('./return_str.js')

function update_statement(schema_name, table_name, row_data, update_params = null, return_param = "id", return_options = null) {
    /*
    Assembles update_statment
    */
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)

    let update_str_params = create_set_statement(row_data, update_params)
    let returning_string = rs.ReturningStr(return_param, return_options)
    let query = `UPDATE "${schema_name}"."${table_name}" SET ${update_str_params.set_str} WHERE ${update_str_params.where_str} ${returning_string}`.trim()

    let xs = { "text": query, "values": update_str_params.values } 
    return xs

}

function extract_parameters(row_data, update_params) {
    /*
        Determines values for set. Also determines if default_values can be used as a replacement when
        column value is set to null
    */
    let def_object = {}
    let set_fields = []

    if (typeof update_params === 'object' && !Array.isArray(update_params) && update_params !== null)
    {
        if (update_params.hasOwnProperty('default_fields')) { 
            let dx = update_params['default_fields']
            if (typeof dx === 'object' && !Array.isArray(dx) && dx !== null ) {
                def_object = rp.DefaultObject(dx)
            } 
        }
        if ( update_params.hasOwnProperty('set_fields')) {
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
            }
        }
    }
    if (set_fields.length == 0 ) {
        let rx = Object.keys(row_data)
        for( var i = 0; i< rx.length; i++) {
            let cn = String(rx[i])
            if (!rp.IsReservedOrInvalidColumn(cn) ) { set_fields.push(`${cn}`) }
        }
    }
    return {'default_object': def_object, 'set_fields': set_fields}
}



function create_set_statement(row_data, update_params) {
    /*
    Create set_string, where_string and array of values for bind parameters
    */
    let e_param        = extract_parameters(row_data, update_params)
    let set_fields     = e_param['set_fields']
    let default_object = e_param['default_object']

    let placeholder = []
    let set_object = []
    let i = 1
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
            set_object.push( `"${sx}" = $${i}`   )
            placeholder.push(row_data[sx])
            i+=1
        }

    }
    let set_str = set_object.join(" , ")
    if (row_data.hasOwnProperty('id')) {placeholder.push(String(row_data['id']))}
    else { throw new Error ("row_data does not have an id column. Required for update statements") }

    let id_pos = `"id" = $${i}`
    let update_str_params = {'set_str': set_str, 'values': placeholder, 'where_str': id_pos}
    return update_str_params
}
module.exports = {
    'update_statement': update_statement
}