/*
test replacement and bind parameter generation
*/

const bp = require('./index.js')
//BasicType
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

test('? null type', () => 
    {
        let values = []
        let res    = bp.AddBindParameters('cx', null, {}, values, 1, '?', array_type = null)
        res['values'] = values
        let x = { pholder: 'null', new_index: 1, values: [  ] }
        expect(res).toStrictEqual(x)
    }
);



//Array
test(': array type a', () => 
    {
        let values = {}
        let res    = bp.AddBindParameters('cx', ['a','b', 'c'], {}, values, 1, ':', array_type = 'a')
        res['values'] = values
        let x = { pholder: 'ARRAY[ :cx_1,:cx_2,:cx_3 ]', new_index: 4, values: {'cx_1': 'a', 'cx_2': 'b', 'cx_3': 'c'} }
        expect(res).toStrictEqual(x)
    }
);

test('$ array type s', () => 
    {
        let values = []
        let res    = bp.AddBindParameters('cx', ['a','b', 'c'], {}, values, 1, '$', array_type = 's')
        res['values'] = values
        let x = { pholder: '( $1,$2,$3 )', new_index: 4, values: ['a', 'b', 'c'] }
        expect(res).toStrictEqual(x)
    }
);

test('$ array type ?', () => 
    {
        let values = []
        let res    = bp.AddBindParameters('cx', ['a','b', 'c'], {}, values, 1, '?', array_type = 's')
        res['values'] = values
        let x = { pholder: '( ?,?,? )', new_index: 4, values: ['a', 'b', 'c'] }
        expect(res).toStrictEqual(x)
    }
);

//Default
test('Default parameter', () => 
    {
        let values = []
        let res    = bp.AddBindParameters('cx', null , { 'cx': 'default' }, values, 1, '?')
        res['values'] = values
        let x = { pholder: 'default', new_index: 1, values: [] }
        expect(res).toStrictEqual(x)
    }
);

//Object
test('Object Type', () => 
    {
        let values = []
        let res    = bp.AddBindParameters('cx', {'a': '1'} , {  }, values, 1, '?')
        res['values'] = values
        let x = { pholder: '?', new_index: 2, values: ['{"a":"1"}'] }
        expect(res).toStrictEqual(x)
    }
);