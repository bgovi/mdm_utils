/*
Used to test module
*/
const px = require('./index.js')

//is_reserved_column
test('Is not reserved column', () => {expect(px.is_reserved_column('not_reserved')).toBe(false)});
test('Is reserved column', () => {expect(px.is_reserved_column('id')).toBe(true) });
//return_valid_default_value
test('Invalid default name returns default', () => {expect(px.return_valid_default_value('dx1')).toBe('default') });
test('Valid default name returns same name', () => {expect(px.return_valid_default_value('current_timestamp')).toBe('current_timestamp') });

//check default objects
test('Return same default object', () => {expect(px.default_object({'col1': 'default', 'col2':'current_timestamp' })).toMatchObject({'col1': 'default', 'col2':'current_timestamp' }) });
test('Replace bad value with default', () => {expect(px.default_object({'col1': 'defaultasfd', 'col2':'current_timestamp' })).toMatchObject({'col1': 'default', 'col2':'current_timestamp' }) });
test('Filter out bad column', () => {expect(px.default_object({'col 1': 'default', 'col2':'current_timestamp' })).toMatchObject({'col2':'current_timestamp' }) });

test('Is reserved column error', () => 
    {
        let column_name = 'id'
        let column_error = `${column_name} is reserved key word. reserved names are id,_created_at,_updated_at,_deleted_at,_last_user_id`
        expect(() => { px.is_reserved_column_error(column_name) } ).toThrow(column_error)
    }  
);