/*


let function_params = {
    "user_id": "",
    "user_name": "",
    "row_data": ""
}
*/
const sutil = require('../../sutils')
const bindp = require('../bindp')

function ExecuteStatement(schema_name, function_name, row_data,values, index, function_params ) {
    /*
    Row data should be converted to json string

    fn(row_data,user_id,user_name)
    */
    //if on conflict or on restraint
    let i = index
    let i2 = index+1
    let i3 = index+1
    if (is_select) {
        return { "query": `SELECT * FROM "${schema_name}"."${function_name}"($1)`, "params": [row_data] }
    } else {
        return { "query": `SELECT "${schema_name}"."${function_name}"($1)`, "params": [row_data] }
    }
    //returning?
}

//
function CreateFunctionParameters() {



}


function ParseFunctionParams(init_params) {
    //assemble parameters
    let dparams = sutil.DefaultParams(init_params)
    let function_params = {
        "return_param": dparams ["return_param"],
        "return_options": dparams["return_options"] ,
        "bind_type": dparams["bind_type"],
        "array_type": dparams["array_type"],
    }
    if (dparams.hasOwnProperty('user_id')) { function_params['user_id'] = String(dparams['user_id'])}
    else { function_params['user_id'] = ""}
    
    if (dparams.hasOwnProperty('user_name')) { function_params['user_name'] = String(dparams['user_name']) } 
    else {function_params['user_name'] = ""}
    
    if (dparams.hasOwnProperty('is_select')) {
        if (sutil.IsBoolean(dparams['is_select'])) { function_params['is_select'] = dparams['is_select'] }
        else { function_params['is_select'] = true }
    } else { function_params['is_select'] = true }
    return function_params
}

module.exports = { 'ExecuteStatement': ExecuteStatement }