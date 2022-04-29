/*
Test assembly of where clause

Add order by assembly?
*/
const { AddBindParameters } = require('../../bindp/index.js');
const wx = require('./index.js')


// // CreateFullTextSearch(query_string_pholder, quoted_object_name, tsquery_function, tsq_name, tsv_name, tsr_name, is_tsvector=false)
test('create full text search creation', () => 
    {
        let where_statements = [
            {'column_name': 'col_name_1', 'operator': '=', 'value':  1 },
            {'column_name': 'col_name_2', 'operator': 'is_null', 'value':  "" },
            {'column_name': 'col_name_3', 'operator': '!=', 'value':  'a' },
        ]
        let values = []
        let index = 1

        let res = wx.CreateBooleanArray( where_statements, values, index, '?' )
        res['values'] = values
        let exp = {
            boolean_array: [
              '( "col_name_1" = ? )',
              '( "col_name_2" IS NULL )',
              '( "col_name_3" != ? )'
            ],
            new_index: 3,
            values: [ '1', 'a' ]
          }
        expect(res).toStrictEqual(exp)
    }
);

test('assemble where statement', () => {

    let where_statements = [
        {'column_name': 'col_name_1', 'operator': '=', 'value':  1 },
        {'column_name': 'col_name_2', 'operator': 'is_null', 'value':  "" },
        {'column_name': 'col_name_3', 'operator': '!=', 'value':  'a' },
    ]
    let values = []
    let index = 1

    let bool_array = wx.CreateBooleanArray( where_statements, values, index, ':' )
    let res = wx.WhereClauseJoin( bool_array['boolean_array'] )

    let exp =`WHERE ( "col_name_1" = :col_name_1_1 ) AND\n( "col_name_2" IS NULL ) AND\n( "col_name_3" != :col_name_3_2 )`
    expect(res).toBe(exp)
})

// WhereClauseJoin( where_list )