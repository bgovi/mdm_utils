/*
For updates

let update_params = [{
    "default_fields": "",
    "set_fields": ""
}]

*/
const rp = require('../../route_parser')
const rs = require('./return_str.js')

function update_statement(schema_name, table_name, row_data, update_params) {
    /*
    Batch size?
    */
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)


    let update_params = create_set_statement(row_data, update_params)
    let returning_string = rs.ReturningStr(return_param, return_options)
    let query = `UPDATE  "${schema_name}"."${table_name}" SET ${update_params.set_str} WHERE ${update_params.where_str} ${returning_string}`.trim()


    return { "text": query, "values": update_params.values }

}

function extract_parameters() {
    // "IsReservedOrInvalidColumn": IsReservedOrInvalidColumn,
    // "IsReservedColumn": pload.is_reserved_column,
    // 'DefaultObject': pload.default_object,
    // update on id only
    let def_object = rp.DefaultObject()
    let set_fields = []


}



function create_set_statement () {
    /*


    */
    let set_object = []
    let placeholder = []
    let i = 1
    for (const [key, value] of Object.entries(object1)) {
        if (__default__value.hasOwnProperty(key) ) {
            let pg_default = __default__value[key]
            set_object.push( `${key} = ${pg_default}`   )
        }
        else {
            set_object.push( `${key} = $${i}`   )
            placeholder.push(value)
            i+=1
        }
    }
    placeholder.push(user_id)
    i+=1
    let set_str = set_object.join(" , ")
    let id_pos = `WHERE id = $${i}`

    let update_params = {'set_str': set_str, 'values': placeholder, 'where_str': id_pos}
    return update_params
}