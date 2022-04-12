
function execute_statement(schema_name, function_name, row_data, is_select=false) {
    /*
    Row data should be converted to json string


    */
    //if on conflict or on restraint
    if (is_select) {
        return { "query": `SELECT * FROM "${schema_name}"."${function_name}"($1)`, "params": [row_data] }
    } else {
        return { "query": `SELECT "${schema_name}"."${function_name}"($1)`, "params": [row_data] }
    }
    //returning?

}