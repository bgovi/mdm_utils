/*
Used to parse optional query arguments from url. Default key value pair in query string
is used as a filter in the where statement. All column names must be check columnName is url_safe [A-Za-z0-9_]

?column_name=value //this gets converted to ('eq':value)
?column_name=json_object (from bellow)

%7B and %7D for {}
%5B and %5D instead of [] for url safe
{'in':[values]} //if from json string use 
{'not_in':[values]}
{'lt':value}
{'gt':value}
{'between':[values]} //must contain 2 values
{'not_between':[values]} //must contain 2 values
{'eq':value}
{'neq':value}

These are special key names that are parsed in a customized way.
.sort.  =[{'column_name': 'asc'},{'column_name': 'desc'} ] //for sorting can use a or d for short
.corder. = ['column1','column2'] //order for grid
.where. =[{'column_name': {'eq':value} ] //for filtering
.param. =[{'column_name': value}]  //for parameters calls
.dval.  = [{'column_name': value}] //default values instead of null
.id. = value  //id of route
.limit.=value //pagination limit
.offset.=value //pagination offset

Converts values from url type safe to values.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent


ParseUrlQuery: expects a query string or object with key value pairs:
Returns:
url_query_object = {'where': where_object,
    'page': page_object,
    'sort': sort_object,
    'config': config_object } //contains param, dval, id

encodeURIComponent
decodeURIComponent
*/
const idk   = require('../indentifier_check')
const RJSON = require('relaxed-json')
const sutil = require('../../sutils')

var restricted_keys = [".sort.",".where.", ".param.",".dval." ,".id.",".limit.",".offset."]
var operators = ['in', 'not_in', 'lt','le', 'gt','ge', 'between', 'not_between', 'eq', 'neq', 'like','ilike']


//for client side need wrapper to parse into req_query form



function ParseUrlQuery(req_query, max_limit=100000) {
    /*
    req_query is object or is string. If object expected to come from payload.
    dont use req_query object parse string directly so uniform between nodejs and javascript


    */
    if (typeof req_query === 'string') {
        req_query = GetJsonFromUrl(req_query)
    }
    //make sure parsed from req query?

    //modify url string to req_query object or do nothing
    let query_keys = Object.keys(req_query)
    let where_object  = []
    let page_object   = {} //id //limit
    let sort_object   = []
    let config_object = {"param":{},"dval": {} ,"id": null, 'corder': [] }  
    for(var i =0; i < query_keys.length; i++) {
        //check valid key
        let qkey  = decodeURIComponent(query_keys[i])
        let qval  = decodeURIComponent(req_query[qkey])
        if (restricted_keys.includes(qkey)) {
            ParseSpecialKeys(qkey, qval,where_object, page_object, sort_object, config_object, max_limit)
        }
        else {
            //if key not valid skip
            if (! idk.ValidIdentifier(qkey)) { continue }
            let qval2 = ParseQval(qval) //returns object
            if (Object.keys(qval2) === 0 ) {continue}
            AssembleWhereQueryObject(where_object, qkey, qval2)
        }
    }
    let url_query_object = {'where': where_object, 'page': page_object, 'sort': sort_object, 'config': config_object }
    return url_query_object
}

function GetJsonFromUrl(url_string) {
    /*
    Parses query string into javascript object
    */
    let q = url_string
    if (q.length === 0) { return {} }
    if (q.charAt(0) === '?') {q = q.substr(1) }

    var result = {};
    q.split("&").forEach(function(part) {
      var item = part.split("=");
      result[decodeURIComponent(item[0])] = decodeURIComponent(item[1])
    });
    return result;
}





function ParseQval(query_value) {
    /*
    query_value can be a string. A string as json or an object
    Parses value component of ?x=value. If json convert to json object
    other wise return value
    */
   let json_object = {}

   if (typeof query_value === 'string') {
       try {
        let json_string = RJSON.transform(query_value)
        let jx = JSON.parse(json_string)
        if (sutil.IsObject(jx)) {
            json_object = jx
        } else {
            json_object = {'eq': String( query_value ) }
        }
       }
       catch (e) { json_object = {'eq': String( query_value ) } }
    }
    else if (typeof query_value === 'number') {
        json_object = {'eq': String( query_value ) }
    } 
    else {
        if (sutil.IsObject(query_value)) { json_object = query_value }
        else { json_object = {'eq': String( query_value ) } }
    }

    let json_object_out = {}
    let query_keys = Object.keys(json_object)
    if (query_keys.length === 0) {return {}}
    for(var i =0; i<query_keys.length; i++) {
        if (! operators.includes(query_keys[i]) ) {continue}

        if (sutil.IsArray(json_object[query_keys[i]])) {
            json_object_out[query_keys[i]] = StringifyArray( json_object[query_keys[i]] )
        } else {
            json_object_out[query_keys[i]] = String( json_object[query_keys[i]] )
        }
    }
    return json_object_out

}


function ParseSpecialKeys(url_key, qval, where_object, page_object, sort_object, config_object, max_limit) {
    /*
    Used to parse url query that uses the special name flags below
    [".sort.",".where.", ".param.",".dval." ,".id.",".limit.",".offset."]
    */
    if (url_key === ".sort." ) { ParseSortUrl(qval, sort_object) }
    else if ( url_key === ".where." ) { ParseWhereUrl(qval, where_object) }
    else if ( url_key === ".param." || url_key === ".dval." ) { ParseParamDvalUrl(url_key,qval, config_object)} 
    else if ( url_key === ".id." ) { ParseIdUrl(qval, config_object) } 
    else if ( url_key === ".limit." || url_key === ".offset." ) { ParsePageUrl(url_key, qval, page_object, max_limit=max_limit) }
    else if (url_key === '.corder.') {ParseColumnOrder(qval, config_object) }
}

function ParseColumnOrder(c_param, config_object){

    try {
        let json_string = RJSON.transform(c_param)
        let jx = JSON.parse(json_string)
        if (! sutil.IsArray(jx)) {return}
        for(var i =0 ; i<jx.length; i++) {
            let cname = String(jx[i])
            if (! idk.ValidIdentifier(cname)) { continue }
            config_object["corder"] = cname
        }
    } catch (e) {
        console.log(e)
    }



}

function ParseWhereUrl(where_parameters, where_object){
    /*
    Used to parse .where.=
    where_parameters = [{'column_name': {'eq':value}, ... ]
    */
    try {
        let json_string = RJSON.transform(where_parameters)
        let jx = JSON.parse(json_string)
        for(var i =0; i < jx.length; i++) {
            let query_keys = Object.keys(jx[i])
            for (var j = 0; j < query_keys.length; j++) {
                let qkey  = query_keys[j]
                let qval  = jx[i][qkey]
                if (! idk.ValidIdentifier(qkey)) { continue }
                //check key is valid
                let qval2 = ParseQval(qval) //returns object
                if (Object.keys(qval2) === 0 ) {continue}
                AssembleWhereQueryObject(where_object, qkey, qval2)
            }
        }
    }

    catch (e) {
        console.log(e)
    }
}

function ParseSortUrl(sort_params, sort_object){
    /*
    .sort.  =[{'column_name': 'asc'},{'column_name': 'desc'} ] //for sorting
    */
    try {
        let json_string = RJSON.transform(sort_params)
        let jx = JSON.parse(json_string)
        let x = {}
        for(var i =0 ; i<jx.length; i++) {
            let query_keys = Object.keys(jx[i])
            for(var j =0; j < query_keys.length; j++) {
                let qkey  = query_keys[j]
                let qval  = String(jx[i][qkey])
                //if key not valid skip
                if (! idk.ValidIdentifier(qkey)) { continue }
                if (qval === 'asc' || qval === 'a') {
                    let y = {}
                    y[qkey] = 'asc'
                    sort_object.push(y)
                } else if (qval === 'desc' || qval === 'd') {
                    let y = {}
                    y[qkey] = 'desc'
                    sort_object.push(y)
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

function ParseParamDvalUrl(url_key,p_params, config_object){
    /*
        .param. =[{'column_name': value}]  //for parameters calls
        .dval.  = [{'column_name': value}] //default values instead of null
    */
    try {
        let json_string = RJSON.transform(p_params)
        let jx = JSON.parse(json_string)
        let x = {}
        for(var i =0 ; i<jx.length; i++) {
            let query_keys = Object.keys(jx[i])
            for(var j =0; j < query_keys.length; j++) {
                let qkey  = query_keys[j]
                let qval  = jx[i][qkey]
                //if key not valid skip
                if (! idk.ValidIdentifier(qkey)) { continue }
                x[qkey] = qval
            }

        }
        config_object[url_key.replaceAll(".","")] = x
    } catch (e) {
        console.log(e)
    }
}

function ParseIdUrl(qval, config_object){ config_object['id'] = String(qval) }

function ParsePageUrl(url_key, qval, page_object, max_limit = 100000){
    try {
        let yint = parseInt(qval)
        if (! Number.isInteger(yint)) {yint = -1}
        if (url_key === '.limit.') {
            if (yint < 0 ) { yint = max_limit}
            else if (yint > max_limit) {yint = max_limit}
            page_object[url_key.replaceAll(".","")] = String(yint)
        } else if (url_key === '.offset.') {
            if (yint < 0 ) { yint = 0}
            page_object[url_key.replaceAll(".","")] = String(yint)
        }
    } catch (e) {
        console.log(e)
    }
}


function AssembleWhereQueryObject(where_object, col_name, json_object) {
    /*
    {'variable_name': , 'operator': , value: } how to handle arrays?
    //force everything to a string?

    */
    let key = Object.keys(json_object)[0]
    let value = json_object[key]
    // console.log(key)
    // console.log(value)

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
        if (IsValidArray(value, len_min =2, len_max=2 ) ) {
            where_object.push( {'variable_name': col_name, 'operator': 'between', 'value':  StringifyArray(value) })
        }
    } else if ('not_between' === key ) {
        if (IsValidArray(value, len_min =2, len_max=2 ) ) {
            where_object.push( {'variable_name': col_name, 'operator': 'not_between', 'value':  StringifyArray(value) })
        }
    } else if ('eq' === key ) {
        where_object.push( {'variable_name': col_name, 'operator': 'eq', 'value':  String(value) })
    } else if ('neq' === key ) {
        where_object.push( {'variable_name': col_name, 'operator': 'neq', 'value':  String(value) })
    } else if ('like' === key ) {
        where_object.push( {'variable_name': col_name, 'operator': 'like', 'value':  String(value) })
    } else if ('ilike' === key ) {
        where_object.push( {'variable_name': col_name, 'operator': 'ilike', 'value':  String(value) })
    }
}

function IsValidArray(array_object, len_min = -1, len_max=-1) {
    //checks if object is an array and has the correct size
    if (! sutil.IsArray(array_object) ) {return false}
    else if ( len_min > -1 && len_max > -1 ) {
        if (array_object.length <= len_max && array_object.length >= len_min) {return true}
        else{return false}
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
    //All values in the array are converted to strings
    let new_array = []
    for( var i=0; i<array_object.length; i++) {
        new_array.push(String(array_object[i]))
    }
    return new_array

}


module.exports = {
    'ParseUrlQuery':ParseUrlQuery,
    'ParseSpecialKeys': ParseSpecialKeys,
    'ParseWhereUrl': ParseWhereUrl,
    'ParseSortUrl': ParseSortUrl,
    'ParseParamDvalUrl': ParseParamDvalUrl,
    'ParseIdUrl': ParseIdUrl,
    'ParsePageUrl': ParsePageUrl,
    // 'IsJsonObject': IsJsonObject,
    'AssembleWhereQueryObject': AssembleWhereQueryObject,
    'IsValidArray': IsValidArray,
    'GetJsonFromUrl': GetJsonFromUrl,
    'StringifyArray': StringifyArray
}
