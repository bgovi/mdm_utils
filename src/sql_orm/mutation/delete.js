/*
Responsible for creating delete statement with replacement operations. 
Each row is required to have an id column.

DeleteStatement: Actual delete statement
DeleteAtStatement: Uses update to set a _deleted-at timestamp. Represents paranoid mode.
*/
const rp = require('../../route_parser')
const rs = require('./return_str.js')
const sutil = require('../../sutils')
const bindp = require('../bindp')


function DeleteStatement(schema_name, table_name, row_data, values, index, delete_params){ 
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    sutil.MissingId(row_data, 'delete')
    let params = sutil.DefaultParams(delete_params)

    let returning_string = rs.ReturningStr(params.return_param, params.return_options)

    let bparams = bindp.AddBindParameters('id', row_data['id'], {}, values, index, params.bind_type, array_type = params.array_type)
    let out_text = `DELETE FROM "${schema_name}"."${table_name}" WHERE id =${bparams.pholder} ${returning_string}`.trim() + ';'
    return { "text": out_text, "values": values, 'new_index': bparams.new_index }

}

function DeleteAtStatement(schema_name, table_name, row_data, values, index, delete_params){ 
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    sutil.MissingId(row_data, 'delete')
    let params = sutil.DefaultParams(delete_params)
    let returning_string = rs.ReturningStr(params.return_param, params.return_options)
    let bparams = bindp.AddBindParameters('id', row_data['id'], {}, values, index, params.bind_type, array_type = params.array_type)
    let out_text = `UPDATE "${schema_name}"."${table_name}" set _deleted_at = current_timestamp WHERE id =${bparams.pholder} ${returning_string}`.trim() +';'
    return { "text": out_text, "values": values, 'new_index': bparams.new_index   }
}

module.exports = {
    'DeleteStatement': DeleteStatement,
    'DeleteAtStatement': DeleteAtStatement
}