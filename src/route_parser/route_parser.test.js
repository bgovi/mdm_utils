/*
Used to test module
*/
const rp = require('./index.js')




test('route_parser library import', () => {
    expect(true).toBe(true);
});

// test.each
//empty space check

// invalid_characters = ["'", '"', "`", "~",  "!", "@",
//   "#","$", "%", "^", "&", "(",")","-","=","+",
//   "{", "}", "[", "]", "|", "\\", ":", ";", "<", ">",
//   ",", ".", "?", "/", "*", "", "test with spaces"]

// test.each(invalid_characters)(
//   'Invalid Character %s',
//   (ident_str) => { expect( ic.valid_identifier(ident_str) ).toBe(false) }
// );


// test('Valid string no error thrown', () => {
//   expect(() => ic.check_identifier_error('random_name')).not.toThrow();
// });

// test.each(invalid_characters)(
//   'Throw Error Invalid Character %s',
//   (ident_str) => { expect(() => ic.check_identifier_error(ident_str)).toThrow() }
// );

// let route_object = {
//     'route_token': "", //json_web_token (contains accessible route information?)
//     'query_params': "", //contains payload 
// }

// let query_params = [
//     /*
//     Array of objects. Contains information for crud operations.
//     Operation order is not preserved.
//     */
//     {
//     "crud_type": "", //only needed for save route 
//     "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
//     "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
//     "set_fields": "",  //array that has columns that should be used for set
//     "on_conflict": "",
//     "on_constraint": "",
//     "where": "",
//     "page": "", //object {'offset': val, 'limit': val}
//     "search_filter": "", //string or object with quick filter type:
//     "search_rank": "", //bool
//     "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
//     "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
// }]