//handles page operations.
var pagination_string = PaginationClause(pagination_values)

function PaginationClause(pagination_values) {
    //both should be integers?
    var pagination_data = ExtractPaginationData(pagination_values)
    var offset = pagination_data['offset']
    var page_limit = pagination_data['page_limit']
    return `offset ${offset} limit ${page_limit}`
}

function ExtractPaginationData(pagination_values) {
    //both should be integers?
    var offset = pagination_values['offset']
    var page_limit = pagination_values['limit']
    offset = parseInt(offset)
    page_limit = parseInt(page_limit)
    if (isNaN(offset)  ) { offset = 0 }
    if (isNaN(page_limit)  ) { page_limit = 1000 }

    if (offset < 0 ) { offset = 0}
    if (page_limit <= 0) {page_limit = 1000 }
    if (page_limit > 10000) {page_limit = 10000 } //max size
    return {'offset': offset, 'page_limit': page_limit}
}

function ExtractPaginationDataFromReq(req) {
    //both should be integers?
    var req_body = req['body']
    var pagination_values = req_body['pagination']
    if (pagination_values === undefined) {
        return {'offset': 0, 'page_limit': 1000 }        
    }

    var offset = pagination_values['offset']
    var page_limit = pagination_values['limit']
    offset = parseInt(offset)
    page_limit = parseInt(page_limit)
    if (isNaN(offset)  ) { offset = 0 }
    if (isNaN(page_limit)  ) { page_limit = 1000 }

    if (offset < 0 ) { offset = 0}
    if (page_limit <= 0) {page_limit = 1000 }
    if (page_limit > 10000) {page_limit = 10000 } //max size
    return {'offset': offset, 'page_limit': page_limit}
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



module.exports = {
    'CreateQueryParamaters': CreateQueryParamaters,
    'ExtractPaginationDataFromReq': ExtractPaginationDataFromReq,
    'OrderClause': OrderClause,
    'PaginationClause': PaginationClause,
    'ExtractPaginationData': ExtractPaginationData,
    'WhereClause': WhereClause,
    'WhereDate': WhereDate,
    'WhereIn': WhereIn,
    'WhereQuickFilter': WhereQuickFilter,
    'WhereStringEqual': WhereStringEqual,
    'WhereServerQuery': WhereServerQuery,
    'WhereNumericalComparision': WhereNumericalComparision,
    'IsEmptyStatement': IsEmptyStatement
}