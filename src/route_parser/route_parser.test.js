/*
Used to test module
*/
const rp = require('./index.js')

test('route_parser library import', () => {
    expect(true).toBe(true);
});

// IsReservedOrInvalidColumn(column_name, throw_error = false)
test('Is reserved column', () => 
    {
        let column_name = '_created_at'
        expect(rp.IsReservedOrInvalidColumn(column_name)).toBe(true)
    }  
);

test('Is not reserved column', () => 
    {
        let column_name = 'first_name'
        expect(rp.IsReservedOrInvalidColumn(column_name)).toBe(false)
    }  
);

test('Is not reserved column error', () => 
    {
        let column_name = 'first_name'
        expect(() => { rp.IsReservedOrInvalidColumn(column_name, true) } ).not.toThrow()
    }  
);

test('Is reserved column error', () => 
    {
        let column_name = '_updated_at'
        let column_error = `${column_name} is reserved key word. reserved names are id,_created_at,_updated_at,_deleted_at,_last_user_id`
        expect(() => { rp.IsReservedOrInvalidColumn(column_name, true) } ).toThrow(column_error)
    }  
);

