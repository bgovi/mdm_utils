/*
Creates function statement

let function_params = {
    "user_id": "",
    "user_name": "",
    "row_data": ""
    "default_object": ""
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
    let params = ParseFunctionParams(function_params)
    let x = CreateFunctionParameters(row_data, params, values, index) 
    if (is_select) {
        let qx = `SELECT * FROM "${schema_name}"."${function_name}"(${JSON.stringify(x.args[0])}, ${x.args[1]}, ${x.args[2]}, ${JSON.stringify(params.default_object)})`
        return { 'text': qx , "values": values, 'new_index': x.new_index }
    } else {
        let qx = `SELECT "${schema_name}"."${function_name}"(${JSON.stringify(x.args[0])}, ${x.args[1]}, ${x.args[2]}, ${JSON.stringify(params.default_object)})`
        return { "query": qx, "values": values, 'new_index': x.new_index }
    }
}

//
function CreateFunctionParameters(row_data, params, values, index) {

    let args = []
    let bparams = bindp.AddBindParameters('row_data', row_data, {}, values, index, params.bind_type, array_type = params.array_type)
    index = bparams.new_index
    args.push(`"${bparams.pholder}"` )

    bparams = bindp.AddBindParameters('user_id', params.user_id, {}, values, index, params.bind_type, array_type = params.array_type)
    index = bparams.new_index
    args.push(`"${bparams.pholder}"` )

    bparams = bindp.AddBindParameters('user_name', params.user_id, {}, values, index, params.bind_type, array_type = params.array_type)
    index = bparams.new_index
    args.push(`"${bparams.pholder}"` )
    return {'args': args, 'new_index': index}
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

    if (dparams.hasOwnProperty('default_object')) { function_params['default_object'] = String(dparams['default_object']) } 
    else {function_params['default_object'] = {}}

    return function_params
}

module.exports = { 'ExecuteStatement': ExecuteStatement }