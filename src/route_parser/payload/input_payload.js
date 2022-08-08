/*
Quick verification of input types
Used to verify payload is of correct types (should use typescript)
Array of objects. Contains information for crud operations.
Operation order is not preserved.

let query_params = 
{
    "crud_type": "", //only needed for save route 
    "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
    "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
    "set_fields": "",  //array that has columns that should be used for set in upsert
    "on_conflict": "", //string a-zA-Z0-9
    "on_constraint": "", //string a-zA-Z0-9
    "do_nothing": false, //nothing or update
    "where": "", //array of objects:  [{column_name:"valx1", operator:"=", value="value" },
        {column_name:"valx2", operator:"in", value= ["value1", "value2"]}]
    "offset": "", //should be integer greater or equal to 0
    "limit": "", //should be positive integer
    "search_filter": "", //string or object with quick filter type:
    "search_rank": "", //bool
    "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
    "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}]
}
*/
const type_check = require('../../sutils')
const idx = require('../indentifier_check')

class InputPayload {
    constructor () {
        this.valid_crud_types = ['insert','update','delete', 'execute','save', 'select']
        this.default_values   = [ 'default', 'current_timestamp', 'current_time','null',
            'current_date', 'localtime', 'localtimestamp', ""
        ]
        this.offset = 0
        this.limit  = 100000
        this.qp = null
    }
    RunInit(query_params) {
        if (  !type_check.IsObject(query_params) ) { throw 'query paramas is not an object' }
        else{ this.qp = query_params }
        this.CrudType()
        this.DefaultFields()
        this.Data()
        this.Where()
        this.Limit()
        this.Offset()
        this.SearchFilter()
        this.SearchRank()
        this.SetFields()
        this.Returning()
        this.OnConflictAndContraint()
        this.BindType()
    }
    CrudType() {
        let qp = this.qp
        if (!qp.hasOwnProperty('crud_type')) {
            qp['crud_type'] = 'select'
            return
        }
        this.InvalidQueryParamError(qp['crud_type'])
    }
    DefaultFields() {
        /*
        return object with sanitized default values
        default_row_data : {'column_name1': 'default_value1', 'column_name2': 'default_value2'}
    
        Checks if default_value is acceptable. If not returns default. for the column_name
        */
        //typecheck
        let default_row_data = this.qp['default_fields'] || {}
        if (! type_check.IsObject(default_row_data)) {default_row_data = {}}
        let def_object = {}
        let row_keys = Object.keys(default_row_data)
        for (var i = 0; i < row_keys.length; i++) {
            let rowKey = row_keys[i]
            if ( ! idx.ValidIdentifier(rowKey)) { continue }
            let dval   = default_row_data[ rowKey ]
            let defval = this.ReturnValidDefaultValue(dval)
            def_object[rowKey] = defval 
        }
        this.qp['default_fields'] = def_object
    }
    Data() {
        /*
            data : [{'column_name1': 'column_value1', 'column_name2': 'column_value2'}]
        */
        if (this.qp.hasOwnProperty('data')) {
            let data = this.qp['data']
            if (! type_check.IsArray(data)) { this.qp['data'] = [] }
        } else { this.qp['data'] = [] }
    }
    SetFields(set_fields) {
        /*
            //    "set_fields": "",  //array that has columns fields that should be used for set should be
            array of strings
        */
        if (this.qp.hasOwnProperty('set_fields')) {
            let x = this.qp['set_fields']
            if (! type_check.IsArray(x)) { this.qp['set_fields'] = [] }
        } else { this.qp['set_fields'] = [] }
    }
    Where() {
        /*
        "", //array of objects: default []
        "where": [{column_name:"valx1", operator:"=", value="value" },
                {column_name:"valx2", operator:"in", value= ["value1", "value2"]}]
        */
        if (this.qp.hasOwnProperty('where')) {
            let x = this.qp['where']
            if (! type_check.IsArray(x)) { this.qp['where'] = [] }
        } else { this.qp['where'] = [] }
    }
    Offset(x) {
        /*
        "offset": "", //should be integer greater or equal to 0
        */
        if (this.qp.hasOwnProperty('offset')) {
            let x = this.qp['offset']
            if (! type_check.IsInteger(x)) { this.qp['offset'] = this.offset }
        } else { this.qp['offset'] = this.offset }
    }
    Limit() {
        /* "limit": "", //should be positive integer */
        if (this.qp.hasOwnProperty('limit')) {
            let x = this.qp['limit']
            if (! type_check.IsInteger(x)) { this.qp['limit'] = this.limit }
        } else { this.qp['limit'] = this.limit }

    }
    OrderBy() {
        /*
            "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
        */
        if (this.qp.hasOwnProperty('order_by')) {
            let x = this.qp['order_by']
            if (! type_check.IsArray(x)) { this.qp['order_by'] = [] }
        } else { this.qp['order_by'] = [] }
    }
    SearchFilter() {
        /*
        "search_filter": "", //string or object with quick filter type:
        */
        this.qp['search_filter'] = ""
    }
    SearchRank() {
        /*
        "search_rank": "", //bool
        */
        this.qp['search_rank'] = false
    }
    Returning() {
        /*
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        */
        if (this.qp.hasOwnProperty('returning') ) { //let x = this.qp['returning']
        } else { this.qp['returning'] = '*' }
    }
    OnConflictAndContraint() {
        /*
        set constraint fields
        "on_conflict": "", //string a-zA-Z0-9
        "on_constraint": "", //string a-zA-Z0-9
        "do_nothing": false, //nothing or update
        */
        if (this.qp.hasOwnProperty('on_conflict')) {
            let x = this.qp['on_conflict']
            if (! type_check.IsString(x)) { this.qp['on_conflict'] = "" }
        } else { this.qp['on_conflict'] = "" }
        if (this.qp.hasOwnProperty('on_constraint')) {
            let x = this.qp['on_constraint']
            if (! type_check.IsString(x)) { this.qp['on_constraint'] = "" }
        } else { this.qp['on_constraint'] = "" }

        if (this.qp.hasOwnProperty('do_nothing')) {
            let x = this.qp['do_nothing']
            if (! type_check.IsBoolean(x)) { this.qp['do_nothing'] = false }
        } else { this.qp['do_nothing'] = false }
    }
    ReturnValidDefaultValue(psql_reserved_constant) {
        /*
        if name in default_values list return value otherwise return default
        This function sanitizes values as they are direclty entered into sql string
    
        if empty string return "''"
        */
        for (var i = 0; i < this.default_values.length; i++) {
            if (this.default_values[i] === psql_reserved_constant ) {
                return this.default_values[i]
            }
        }
        return 'default'
    }
    InvalidQueryParamError(crud_type) { 
        if (this.valid_crud_types.includes(crud_type)) {return}    
        throw `Invalid crud_type for query_params: ${crud_type}`
    }
    BindType() {
        //replacement type for sequelize. options are :, $ or  --? was for nodepg. doesnt work for sequelize.
        //replacement object always use object for values
        this.qp['bind_type'] = ':'
    }
}

module.exports = InputPayload