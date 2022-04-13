/*
test replacement and bind parameter generation
*/

//BasicType
const bp = require('./index.js')

test('$ basic type', () => 
    {
        let values = []
        let res    = bp.AddBindParameters('cx', 1, {}, values, 1, '$', array_type = null)
        res['values'] = values
        let x = { pholder: '$1', new_index: 2, values: [ '1' ] }
        expect(res).toStrictEqual(x)
    }
);

test('? basic type', () => 
    {
        let values = []
        let res    = bp.AddBindParameters('cx', 1, {}, values, 1, '?', array_type = null)
        res['values'] = values
        let x = { pholder: '?', new_index: 2, values: [ '1' ] }
        expect(res).toStrictEqual(x)
    }
);

test(': basic type', () => 
    {
        let values = {}
        let res    = bp.AddBindParameters('cx', 'abc', {}, values, 2, ':', array_type = null)
        res['values'] = values
        let x = { pholder: ':cx_2', new_index: 3, values: {'cx_2': 'abc'} }
        expect(res).toStrictEqual(x)
    }
);


// test('$ basic type', () => 
//     {

//         let values = []
//         let res    = bp.AddBindParameters('cx', 1, {}, values, 1, '$', array_type = null)
//         res['values'] = values
//         console.log(res)
//         expect(true).toBe(true)
//         .toStrictEqual
//     }
// );