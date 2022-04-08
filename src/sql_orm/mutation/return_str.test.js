const rs = require('./return_str.js')

test('RETURNING *', () =>  { expect(rs.ReturningStr('*')).toBe("RETURNING *") } );
test('return empty string from invalid identifier', () =>  { expect(rs.ReturningStr('^random')).toBe("") } );
test('RETURNING count(*)', () =>  { expect(rs.ReturningStr('count(*)')).toBe("RETURNING count(*)") } );
test('RETURNING "col1" , "COL2" , "_COL3"', () =>  { expect(rs.ReturningStr(['col1','COL2',"_COL3"])).toBe('RETURNING "col1" , "COL2" , "_COL3"') } );
test('Skip $col0 RETURNING "col1" , "COL2" , "_COL3"', () =>  { expect(rs.ReturningStr(['$col0','col1','COL2',"_COL3"])).toBe('RETURNING "col1" , "COL2" , "_COL3"') } );

//Additonal params array
test('Additional Params col0 RETURNING "col1" , "col0" ', () =>  { expect(rs.ReturningStr(['col1'], ['col0'])).toBe('RETURNING "col1" , "col0"') } );

//Additonal params as object
test('Additional Params Object RETURNING "col1" , "col0" , 1 as "node_id" , col3 as "COL3"', 
    () =>  {
        let return_options = {
            'ra': ['col0'],
            'ro': {'1': "node_id", 'col3': "COL3"}
        }
        expect(rs.ReturningStr(['col1'], return_options)).toBe('RETURNING "col1" , "col0" , 1 as "node_id" , col3 as "COL3"') }         
);