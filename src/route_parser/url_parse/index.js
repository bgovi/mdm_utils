/*
Used to parse optional query arguments from url.

Converts values from url type safe to values.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent

check columnName is url_safe

url_query json types
{'in':[values]}
{'not_in':[values]}
{'lt':value}
{'gt':value}
{'between':[values]}
{'not_between':[values]}
{'eq':value}

//boolean?
?column_name={'between':[values]}
?column_name=value

.sort.  =[{'column_name': url_query json types}]
.where. =[{'column_name': url_query json types}]
.param. =[{'column_name': url_query json types}] 
.dval.  = [{'column_name': value}] 
.id. = value
.limit.=value
.offset.=value

encodeURIComponent
decodeURIComponent
*/
const idk = require('../indentifier_check')

var restricted_keys = [".sort.",".where.", ".param.",".dval." ,".id.",".limit.",".offset."]

//for client side need wrapper to parse into req_query form



function ParseUrlQuery(req_query) {
    /*
    req_query is object or is string


    not specialized objects go to where statement

    */
    //modify url string to req_query object or do nothing
    let query_keys = Object.keys(req_query)
    let where_object  = []
    let page_object   = {} //id //limit
    let sort_object   = []
    let config_object = {".param.":{},".dval.": {} ,".id.": {} }  
    for(var i =0; i < query_keys.length; i++) {
        //check valid key
        let qkey  = decodeURIComponent(query_keys[i])
        let qval  = decodeURIComponent(req_query[key])
        if (restricted_keys.includes(qkey)) {
            ParseSpecialKeys(qkey, qval,where_object, page_object, sort_object, config_object)
        }
        else {
            //if key not valid skip
            if (! idk.valid_identifier(qkey)) { continue }
            //check key is valid
            let is_json = IsJsonObject(query_keys[i])
            if (is_json['is_json']) {
                AssembleWhereQueryObject(where_object, qkey,is_json['value']) 
            } else {
                AssembleWhereQueryObject(where_object, qkey,{'eq': String(is_json['value'] ) })
            }
        }
    }
    let url_query_object = {'where': where_object, 'page': page_object, 'sort': sort_object, 'config': config_object }
    return url_query_object
}

function ParseSpecialKeys(url_key, qval, where_object, page_object, config_object) {
    /*
    {'.sort.': jsonObject}
    [".sort.",".where.", ".param.",".dval." ,".id.",".limit.",".offset."]


    */

    let new_key = qval //after parsing
    // if (! idk.valid_identifier(qkey)) { continue }

    if (url_key === ".sort." ) {

    } else if ( url_key === ".where." ) {
        ParseWhereUrl(qval, where_object)


    } else if ( url_key === ".param." ) {

    } else if ( url_key === ".dval." ) {

    } else if ( url_key === ".id." ) {

    } else if ( url_key === ".limit." ) {

    } else if ( url_key === ".offset." ) {

    }

}

function ExtractSpecialKeyJsonObject(qvalue) {

    // [{'column_name': url_query json types}]
    IsJsonObject(qvalue)

}

function ParseWhereUrl(qval, where_object){
    //loop though qval
    let query_keys = Object.keys(req_query)
    for(var i =0; i < query_keys.length; i++) {
        //check valid key
        let qkey  = query_keys[i]
        let qval  = req_query[key]
            //if key not valid skip
            if (! idk.valid_identifier(qkey)) { continue }
            //check key is valid
            let is_json = IsJsonObject(query_keys[i])
            if (is_json['is_json']) {
                AssembleWhereQueryObject(where_object, qkey,is_json['value']) 
            } else {
                AssembleWhereQueryObject(where_object, qkey,{'eq': String(is_json['value'] ) })
            }
    }
}

function ParseSortUrl(){}
function ParseParamUrl(){}
function ParseDvalUrl(){}
function ParseIdUrl(){}
function ParsePageUrl(){}


function IsJsonObject(query_str_value) {
    /*
    Parses value component of ?x=value. If json convert to json object
    other wise return value
    */
    try {
        let json_value = JSON.parse(query_str_value)

        return {'is_json':true, 'value': json_value}
    } catch (e) {
        return {'is_json':false, 'value': query_str_value}
    }
}

function AssembleWhereQueryObject(where_object, col_name, json_object) {
    /*
    {'variable_name': , 'operator': , value: } how to handle arrays?
    //force everything to a string?

    */
   let key = Object.keys(json_object)[0]
   let value = json_object[key]

    if (key === 'in') {
        if (IsValidArray(value), len_min =1 ) {
            where_object.push( {'variable_name': col_name, 'operator': 'in', 'value':  StringifyArray(value) })
        }

    } else if ('not_in' === key) {
        if (IsValidArray(value), len_min =1 ) {
            where_object.push( {'variable_name': col_name, 'operator': 'not_in', 'value':  StringifyArray(value) })
        }
    } else if ('gt' === key) {
        where_object.push( {'variable_name': col_name, 'operator': 'gt', 'value':  String(value) })
    } else if ('ge' === key) {
        where_object.push( {'variable_name': col_name, 'operator': 'ge', 'value':  String(value) })
    } else if ('lt' === key) {
        where_object.push( {'variable_name': col_name, 'operator': 'lt', 'value':  String(value) })        
    } else if ('le' === key) {
        where_object.push( {'variable_name': col_name, 'operator': 'le', 'value':  String(value) })        
    } else if ('between' === key ) {
        if (IsValidArray(value), len_min =2, len_max=2 ) {
            where_object.push( {'variable_name': col_name, 'operator': 'between', 'value':  StringifyArray(value) })
        }
    } else if ('not_between' === key ) {
        if (IsValidArray(value), len_min =2, len_max=2 ) {
            where_object.push( {'variable_name': col_name, 'operator': 'not_between', 'value':  StringifyArray(value) })
        }
    } else if ('eq' === key ) {
        where_object.push( {'variable_name': col_name, 'operator': 'eq', 'value':  String(value) })
    }
}

function IsValidArray(array_object, len_min = -1, len_max=-1) {
    if (! Array.isArray(array_object) ) {return false}
    else if ( len_min > -1 && len_max > -1 ) {

    }

    else if ( len_min > -1 ) {
        if (array_object.length >= len_min) {return true}
        else {return false}

    } else if (len_max > -1) {
        if (array_object.length <= len_max) {return true}
        else {return false}

    }
    return true
}

function StringifyArray(array_object) {
    let new_array = []
    for( var i=0; i<array_object.length; i++) {
        new_array.push(String(array_object[i]))
    }
    return new_array

}



