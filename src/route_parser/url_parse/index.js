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

_grid_sort_  =[{'column_name': url_query json types}]
_grid_param_ =[{'column_name': url_query json types}]
_grid_qparam_ =[{'column_name': url_query json types}]
_grid_id_ = value

encodeURIComponent
decodeURIComponent
*/
function ParseReqQuery(req_query) {
    let query_keys = Object.keys(req_query)
    for(var i =0; i < query_keys.length; i++) {
        let key = decodeURIComponent(query_keys[i])
        //check key is valid
        if (key === '_grid_sort_' || key === '_grid_param_' || key === '_grid_id_' || key === '_grid_qparam_') {
            let vx = ReturnGridUrlParam(key, req_query[key] )
        } else {
            let vx = ReturnValueObject(req_query[key]) 
        }
    }
}

function ReturnGridUrlParam(key, query_str_value) {
    let vx = ReturnValueObject(query_str_value)
}

function ReturnValueObject(query_str_value) {
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

function CheckParameters(json_object) {
    /*
    {'variable_name': , 'operator': , value: } how to handle arrays?
    //force everything to a string?

    */

    if (x === 'in') {

    } else if ('not_in' === x) {

    } else if ('gt' === x) {
        
    } else if ('ge' === x) {
        
    } else if ('lt' === x) {
        
    } else if ('le' === x) {
        
    } else if ('between' === x ) {

    } else if ('not_between' === x ) {
        
    } else if ('eq' === x ) {
        
    }
}

function AssembleQueryObject() {

}

function IsValidArray(array_object, len_min = -1, len_max=-1) {
    if (! Array.isArray(array_object) ) {return false}
    else if ( len_min > -1 ) {

    } else if (len_max > -1) {

    }
    return true


}

function StringifyArray() {

}