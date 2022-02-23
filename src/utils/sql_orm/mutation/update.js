/*
For updates

let update_params = [{
    "default_fields": "",
    "set_fields": ""
}]

*/

var ignore_list = ['id', '_created_at_','_updated_at_' ,'_last_user_id_']

function update_statement(schema_name, table_name, row_data, insert_params) {
    /*
    Batch size?
    */
    let update_params = create_set_statement()
    let returning_str = return_str()
    let query = ` UPDATE table_name SET ${update_params.set_str} WHERE ${update_params.where_str} RETURNING ${returning_str} `


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
    set_object.push( "_updated_at = now()" )
    /*
    need to add _last_user_id 
    */
    set_object.push( `_last_user_id = $${i} `)
    placeholder.push(user_id)
    i+=1
    let set_str = set_object.join(" , ")
    let id_pos = `WHERE id = $${i}`

    let update_params = {'set_str': set_str, 'placeholder': placeholder, 'where_str': id_pos}
    return update_params
}