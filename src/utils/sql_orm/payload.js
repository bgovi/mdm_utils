/*
This module defines the payload structure for crud operations:

As an example a table has columns x and y

route_token:  contains permissions token for accesible routes for the payload

query_params: object or array of objects: contains data required for payload parsing:
    data: This is an object or an array of objects. 
    default_fields: {'column_name': 'type'} types: "__default__", "__null__", "__now__"
        if column has null value and column name is in default_fields. replace with default info
        if array of field_names will replace null with default or filter out row?



    For update/insert:
        set_fields: fields to include in update set command. If empty and using update route will
            use all fields in data.


    For upsert:
        on_conflict (column_name):
        on conflict on contraint constraint_name:

        action:
            do nothing:
            do update:

    bulk_insert, bulk_update: (create prepared_statement) 1,000 at a time?
        data should be array of objects.

Returning: *
*/

//route_token: ?

let route_object = {
    'route_token': "", //json_web_token (contains accessible route information?)
    'query_params': "",
}

let query_params = [{
    "crud_type": "", //only needed for save route 
    "data": "", //object or array of objects: {x:"valx", y:"valy"} or [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
    "default_fields": "",
    "set_fields": "",
    "on_conflict": "",
    "on_constraint": "",
    "where": "",
    "page": "",
    "search_filter": "", //string or object with quick filter type:
    "search_rank": "", //bool
    "return": "",
    "order_by": ""
}]

//return_object
//need immediate rejection
//need to check column values


let insert_params = [{
    "default_fields": "",
    "on_conflict": "",
    "on_constraint": "",
    "set_fields": ""
}]

var ignore_list = ['id', '_created_at', '_last_user_id']

function ignore_list_fn(column_name) {
    if (column_name in ignore_list) { return true }
}

function returning_str() {
    let returning_string = '*'
    /*
    check statements pass
    */
    return returning_string
}

function default_values() {
    /*
    if name in list return value otherwise return default
    */
}

module.exports = {
    'ignore_list': ignore_list_fn,
    'return_str': returning_str
}