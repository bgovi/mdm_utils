/*handles sort operations
    order_statements = [{'column1','asc}, {'column2':'a'}, {'column3':'desc'}, {'column4':'d'}]
*/

const rp    = require('../../../route_parser')
const sutil = require('../../../sutils')

function OrderClause(order_statements) {

    if (! sutil.IsArray(order_statements) ) { throw new Error('order_statements must be an array of objects') }

    var order_list = []
    for (var i = 0; i < order_statements.length; i++) {
        let ox = order_statements[i]
        if (! sutil.IsObject(ox) ) { throw new Error('order_statement value must be an object with key value pair') }
        let cnames = Object.keys(ox)
        for(var j =0; j< cnames.length; j++) {
            let cn = cnames[j]
            rp.CheckIdentifierError(cn)
            let cv = ox[cn]
            order_list.push( CreateOrderByString(cn, cv)  )
        }
    }
    if (order_list.length > 0 ) {
        let order_string = 'ORDER BY ' + order_list.join(' , ')
        return order_string
    } else { return '' }
}

function CreateOrderByString(column_name, column_order_value) {
    /*
    Creates order_by statement
    column_name
    column_order
    order_by = [{'column1','asc}, {'column2':'a'}, {'column3':'desc'}, {'column4':'d'}]
    */
    let sort_type  = String(column_order_value).toLowerCase()
    if (sort_type === 'asc' || sort_type === 'ascending' || sort_type === 'a') { return `"${column_name}" ASC` } 
    else if (sort_type === 'desc' || sort_type === 'descending' || sort_type === 'd') { return `"${column_name}" DESC`  }   
    else {
        throw new Error ()
    }
}




module.exports = {
    'OrderClause': OrderClause,
    'CreateOrderByString': CreateOrderByString,
}