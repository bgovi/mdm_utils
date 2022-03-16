/*
Used to test module
*/
const px = require('./index.js')

let route_object = {
    'route_token': "", //json_web_token (contains accessible route information?)
    'query_params': "", //contains payload 
}

let query_params = [
    /*
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.
    */
    {
    "crud_type": "", //only needed for save route 
    "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
    "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
    "set_fields": "",  //array that has columns that should be used for set
    "on_conflict": "",
    "on_constraint": "",
    "where": "",
    "page": "", //object {'offset': val, 'limit': val}
    "search_filter": "", //string or object with quick filter type:
    "search_rank": "", //bool
    "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
    "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
}]

//is_reserved_column
test('Is not reserved column', () => {expect(px.is_reserved_column('not_reserved')).toBe(false)});
test('Is reserved column', () => {expect(px.is_reserved_column('id')).toBe(true) });
//return_valid_default_value
test('Invalid default name returns default', () => {expect(px.return_valid_default_value('dx1')).toBe('default') });
test('Valid default name returns same name', () => {expect(px.return_valid_default_value('current_timestamp')).toBe('current_timestamp') });
//returning_str

// is_reserved_column,

// returning_str,
// return_valid_default_value,
// return_output,
// default_object