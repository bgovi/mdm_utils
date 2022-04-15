/*
filter_params: [{'column_name': , 'operation': , 'value':  , 'data_type': ''}]


*/
const rp = require('../../../route_parser')
const sutil = require('../../../sutils')

let truth_values = [ 't', 'true', 'y', 'yes', 'on', '1', 1, true ]
let false_values = [ 'f', 'false', 'n', 'no', 'off', '0',0,false]



function BooleanStatement(filter_params, index, values ) {
    let val = filter_params.value
    let column_name = filter_params.column_name
    rp.CheckIdentifierError(column_name)
    if ( sutil.IsNull(val)) { 
        return { "text": "", "values": values, "new_index": index } 
    }
    else if ( truth_values.includes(val) ) {
        return { "text": `"${column_name}" = true`, "values": values, "new_index": index }  
    } else if ( false_values.includes(val) ) {
        return { "text": `"${column_name}" = false`, "values": values, "new_index": index }  
    } else {
        return { "text": "", "values": values, "new_index": index }
    }
}

module.exports = {'BooleanStatement': BooleanStatement}