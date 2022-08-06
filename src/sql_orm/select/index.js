/*
Select statement structure determined by params.




*/
const sutil   = require('../../sutils')
const orderby = require('./pagination/orderby')
const page    = require('./pagination/page')
const where   = require('./where/index')
const rp      = require('../../route_parser')

function SelectStatement(schema_name, table_name, req_body, values, index, select_params) {
    rp.CheckIdentifierError(schema_name)
    rp.CheckIdentifierError(table_name)
    let order_by_stm = orderby.OrderClause(req_body['order_by'] || [])
    let page_stm     = page.PaginationClause(req_body['limit'], req_body['offset'] )
    let where_data   = where.WhereStatement(req_body['where'], values, index, select_params )
    let new_index    = where_data['new_index']
    let where_stm    = where_data['where_str']

    let select_str = `
    SELECT * FROM "${schema_name}"."${table_name}"
    ${where_stm}
    ${order_by_stm}
    ${page_stm}
    `.trim() + ';'
    return { "text": select_str, "values": values, "new_index": new_index } 
}

module.exports = { 'SelectStatement': SelectStatement }