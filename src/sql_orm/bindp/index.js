/*
This is responsible for generating placeholder string and bind parameters

bind_type: ?, :, $
? 

returns placeholder_string
returns new_index
modifies values object

/*
Used to parse and add bind parameters or ? replacement values for array and json

No Multidemensional array allowed.

*/
const sutil = require('../../sutils')

function AddParameters(column_name, column_value, default_object, values, index, bind_type) {
    /*
    Stringify values

    is_array
    is_query
    return {'pholder':'?', 'index': index+=1}

    //check if default
    */
    //is_default
    if (IsDefault(column_name, column_value, default_object) ) {
        // let string_value = default_object[column_name]
        let pholder = default_object[column_name]
        let new_index = index
        return {'string_value': string_value, 'pholder': pholder, 'new_index': new_index }
    }
    else if ( sutil.IsBasicType(column_value) ) {
        let string_value = String(column_value)
        let pholder      = CreatePlaceHolder(column_name, index, bind_type)
        let new_index    = index + 1
        AppendValues(values, string_value, pholder, bind_type  )
        return {'string_value': string_value, 'pholder': pholder, 'new_index': new_index }
    }
    else if (sutil.IsObject(column_value)) {
        let string_value = String(column_value)
        let pholder      = CreatePlaceHolder(column_name, index, bind_type)
        let new_index    = index + 1
        AppendValues(values, string_value, pholder, bind_type  )
        return {'string_value': string_value, 'pholder': pholder, 'new_index': new_index }

    } else if (sutil.IsArray(column_value)) {
        let x = ArrayToStr (column_name, column_value, index, bind_type )
        AppendValues(values, x.string_values, x.pholders, bind_type  )

        //wrap here
        return {'string_value': x.string_values, 'pholder': x.pholders, 'new_index': x.new_index }

    } else {
        throw new Error (`${column_name} is of unknown type`)
    }
}

function AppendValues(values, string_value, pholders, bind_type) {
    if (sutil.IsArray(string_value) ) {
        if (bind_type === ":") {
            for (var i = 0; i < pholders.length; i++) {
                values[pholders[i].replace(':',"")] = string_value[i]
            }

        } else {
            for (var i = 0; i < string_value.length; i++) {
                values.push(string_value[i])
            }
        }
    } else {
        if (bind_type === ":") { values[pholders.replace(':',"")] = string_value }
        else { values.push(string_value) }
    }

}

function ArrayToStr (column_name, column_value_array, index, bind_type ) {
    let string_values = StringifyArray(column_value_array)
    let pholders = []
    for(let i = 0; i < string_values.length; i++ ) {
        let pholder = CreatePlaceHolder(column_name, index, bind_type)
        pholders.push(pholder)
        index += 1
    }
    return {'string_value': string_values, 'pholder': pholders, 'new_index': index }
}

function StringifyArray (x) {
    let y = []
    for(var i =0; i<x.length; i++) { y.push(JSON.stringify(x[i])) }
    return y
}

function CreatePlaceHolder(column_name, index, bind_type) {
    if (bind_type === ":")      { return `:${column_name}_${index}` } 
    else if (bind_type === "?") { return '?' }
    else if (bind_type === "$") { return `$${index}`} 
    else {
        throw new Error (`bind type is invalid. Options are ?,:,$ you used ${bind_type}`)
    }
}

function IsDefault(column_name, column_value, default_object) {
    if (default_object.hasOwnProperty(column_name) && column_value === null) {return true}
    else {return false}
}