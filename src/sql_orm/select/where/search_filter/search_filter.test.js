const sx = require('./index.js')

// InsertStatement(schema_name, table_name, row_data,values, index, insert_params )
// test('Is simple query', () => 
//     { expect(sx.IsSimpleQuery('a')).toBe(true)
//     }
// );

// test('Is default query', () => 
//     { expect(sx.IsSimpleQuery('aabcd')).toBe(false)
//     }
// );

// test('processed query string', () => 
//     { 
//         let query_string = "Brad !sup!    %hola%"
//         let qx = sx.TsQueryStringProcess( query_string )
//         let expect_res = "Brad:* sup:* hola:*"
//         // console.log(qx)
//         expect(qx).toBe(expect_res)
//     }
// );

// test('create row level tsvector', () => 
//     { 
//         let cn = '"Col1"'
//         let x = sx.CreateTsVectorCommand (cn,  variable_name = "", is_tsvector=false)
//         let y = 'to_tsvector("Col1")'
//         expect(x).toBe(y)
//     }
// );

// test('create row level tsvector with name', () => 
//     { 
//         let cn = '"Col1"'
//         let vn = '_tsvector_'
//         let x = sx.CreateTsVectorCommand (cn,  variable_name = vn, is_tsvector=false)
//         let y = `to_tsvector("Col1") ${vn}`
//         expect(x).toBe(y)
//     }
// );

// test('create row level tsvector with name and tsvector', () => 
//     { 
//         let cn = '"Col1"'
//         let vn = '_tsvector_'
//         let x = sx.CreateTsVectorCommand (cn,  variable_name = vn, is_tsvector=true)
//         let y = `to_tsvector("Col1"::text) ${vn}`
//         expect(x).toBe(y)
//     }
// );

// //to_tsquery
// //CreateTsQueryCommand (tsquery_function, query_string_pholder, variable_name = "")
// test('create to_tsquery', () => 
//     { 
//         let fn = 'to_tsquery_simple'
//         let x = sx.CreateTsQueryCommand (fn, "$1")
//         let y = `to_tsquery('simple', $1)`
//         expect(x).toBe(y)
//     }
// );

// test('create to_tsquery simple parameter', () => 
//     { 
//         let fn = 'to_tsquery_simple'
//         let x = sx.CreateTsQueryCommand (fn, "$1", variable_name = "_tsquery_")
//         let y = `to_tsquery('simple', $1) _tsquery_`
//         expect(x).toBe(y)
//     }
// );

// quick filter boolean full row
test('create quickfilter boolean statement', () => 
    { 
        let tsquery_function = 'to_tsquery'
        let quoted_object_name = '"table_name"'
        let cmd = sx.QuickFilterBoolean(  '$1', quoted_object_name, tsquery_function, false  )
        let expected_res = `to_tsquery( $1 ) @@ to_tsvector( ${quoted_object_name} )`
        expect(cmd).toBe(expected_res)
    }
);
