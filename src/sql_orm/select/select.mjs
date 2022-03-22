/*
Select statement structure determined by params.

i.e. if search options changes or mapping functions?

value BETWEEN low AND high;

value NOT BETWEEN low AND high;


*/
function returning_str(returning_param) {
    /*
    Creates the Returning string to append to crud operations.

    To skip returning statement use:
        null, [], or ""
    the string count(*) is a special command to return all effected rows.
    Otherwise potential columns are checked for validity and wrapped in double qoutes.

    Returns:
        "" or RETURNING "param1", "param2", ...
    */
    if (returning_param == null) {return ""}


    if (typeof returning_param === 'string') {
        if (returning_param === "") {return "" }

        if (returning_param === "count(*)") {return "RETURNING count(*)"}
        if ( id_check.valid_identifier(returning_param)) { return ' RETURNING ' +'"'+returning_param+'"' }
        else { return "" }

    }
    let rtx = returning_param
    if (! Array.isArray(rtx) ) {return ''}
    if (rtx.length === 0) { return '' }
    let ax = []
    for (var i =0; i < rtx.length; i++) {
        if ( id_check.valid_identifier(rtx[i])) {  ax.push('"'+rtx[i]+'"') }        
    }
    if (ax.length === 0) { return '' }
    return "RETURNING " + ax.join(' , ')
}


function create_page(page_object, max_limit = 100000) {
    /*
    Creates page string from page_object
    page_object = {'limit': limit_value, 'offset': offset_value}
    */

    if (page_object == null) {return ""}
    //if not object
    if ( !( typeof page_object === 'object' && !Array.isArray(page_object) && page_object !== null) ) { return "" }
    let offset = 0
    let xlimit = max_limit
    if (page_object.hasOwnProperty('offset')) {
        let ox = page_object['offset'] 
        if (Number.isInteger(ox) ) {
            ox = parseInt(ox)
            if (ox > 0) {offset = ox}
        }
    }
    if (page_object.hasOwnProperty('limit')) {
        let lx = page_object['limit'] 
        if (Number.isInteger(lx) ) {
            lx = parseInt(lx)
            if (lx < xlimit && lx > 0 ) {xlimit = lx}
        }
    }
    return `OFFSET ${offset} LIMIT ${xlimit}`
}

function create_order_by(order_by) {
    /*
    Creates order_by statement
    order_by = [{'column1','asc}, {'column2':'a'}, {'column3':'desc'}, {'column4':'d'}]
    */
    let ob = order_by

    if (ob == null) {return ""}
    if (! Array.isArray(ob) ) {return ''}
    if (ob.length === 0 ) {return '' }
    let ox = []
    for (var i =0; i<ob.length; i++) {
        let y = ob[i]
        //if not object
        if ( !( typeof y === 'object' && !Array.isArray(y) && y !== null) ) { continue }
        let keys = Object.keys(y)
        if (keys.length === 0) {continue}
        let column_name = String(keys[0])

        if ( ! id_check.valid_identifier(column_name)) { continue }
        let sort_type  = String(y[column_name]).toLowerCase()
        if (sort_type === 'asc' || sort_type === 'ascending' || sort_type === 'a') {
            ox.push(`"${column_name}" ASC` )
        } else if (sort_type === 'desc' || sort_type === 'descending' || sort_type === 'd') {
            ox.push(`"${column_name}" DESC` )
        }
    }
    if (ox.length === 0 ) {return ''}
    return "ORDER BY " + ox.join(' , ')
}