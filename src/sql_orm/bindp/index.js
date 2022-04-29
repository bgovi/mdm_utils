/*
This is responsible for generating placeholder string and bind parameters

The Main function is AddBindParameters
*/

const sutil = require('../../sutils')

function AddBindParameters(column_name, column_value, default_object, values, index, bind_type, array_type = null) {
    /*
    This function process the column_name and column_value to return a string statement suitable for replacements
    or bind parameters.
    
    Inputs
    column_name: The name of the column. If bind_type is ':' its used as part of the key name
    column_value: The value of the column. This is typed converted into a string. Postgres will convert to necessary
        type during execution. The column_value will be added to the values object. 
    default_object: contains default value for column_name when the column_value is null. If the column_name is not
        in the object the value is left as null. if default value is used nothing is added to values 
    bind_type: They type of placeholder to use
        ':' will generate sequelize replacement holders. values should be an object. The key will be :column_name_index
        '?' uses sequelze replacements. The query will use ? as place holder. values should be an array
        '$' this uses bind parameters. The sql query will contain placeholders like $1, $2, $3 .. where the number is specified
            by the index. All string escaping is handled directly by postgres. This requires 3 round trips to the server to execute. 
    values: if the bind_type is ? or $ this will be an array. Otherwise for : it will be an object where the key will be
        column_name_$i and the value will be a string casted column_value. A colon is added to the key to designate the replacement
        location in the sql string :column_name_$i
    index: The current place holder for each replacement. It starts at 1 and each addition to values increments it by 1. The number component
        in (i) column_name_$i and $i comes from the index value
    array_type: Only for situations where the column_value is a javascript array.
        Example cx = [1,2,3]. cx is column_name and the array is column_value. example index i = 1 and bind_type is $
        if array_type is null returns string $1,$2,$3
        if array_type is 'a' returns ARRAY[ $1,$2,$3 ]
        if array_type is 's' returns ( $1,$2,$3 )

        For replacements
            [ ?, ?, ? ] or [ :column_name_1 , :column_name_2 , :column_name_3  ]

    Modifies:
        values. the replacements values are appened to the values array/object.
    Returns:
        {
            'pholder': string used as placeholder for replacements/bind parameters
            'new_index': current number of replacement_values +1 used to keep track of index for next set of values
        }
    */

    if (IsDefault(column_name, column_value, default_object) ) {
        // let string_value = default_object[column_name]
        let pholder = default_object[column_name]
        let new_index = index
        return {'pholder': pholder, 'new_index': new_index }
    }
    else if (sutil.IsNull(column_value) ) {
        // let string_value = default_object[column_name]
        let pholder = 'null'
        let new_index = index
        return {'pholder': pholder, 'new_index': new_index }
    }
    else if ( sutil.IsBasicType(column_value) ) {
        let string_value = String(column_value)
        let pholder      = CreatePlaceHolder(column_name, index, bind_type)
        let new_index    = index + 1
        AppendValues(values, string_value, pholder, bind_type  )
        return {'pholder': pholder, 'new_index': new_index }
    }
    else if (sutil.IsObject(column_value)) {
        let string_value = JSON.stringify(column_value)
        let pholder      = CreatePlaceHolder(column_name, index, bind_type)
        let new_index    = index + 1
        AppendValues(values, string_value, pholder, bind_type  )
        return {'pholder': pholder, 'new_index': new_index }

    } else if (sutil.IsArray(column_value)) {
        let x = ArrayToStr (column_name, column_value, index, bind_type )
        AppendValues(values, x.string_value, x.pholder, bind_type  )
        return {'pholder': WrapArray(x.pholder, array_type) , 'new_index': x.new_index }

    } else {
        throw new Error (`${column_name} is of unknown type`)
    }
}

function WrapArray(pholders, array_type) {
    let xs = String(pholders)
    if (array_type == null ) { return xs }
    else if (array_type == 'a') { return `ARRAY[ ${xs} ]` }
    else if (array_type == 's' ) { return `( ${xs} )` }
    else { throw new Error (`Invalid array wrapper specified: ${array_type}`) }
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
    for(var i =0; i<x.length; i++) { y.push(String(x[i])) }
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

module.exports = {
    'AddBindParameters': AddBindParameters
}