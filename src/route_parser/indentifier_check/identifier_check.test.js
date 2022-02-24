/*
Test identifier_check recognizes special characters
*/
const ic = require('./identifier_check')

test('Valid string', () => {
    expect(ic.valid_identifier('user_Prov9')).toBe(true);
});

// test.each
//empty space check

invalid_characters = ["'", '"', "`", "~",  "!", "@",
  "#","$", "%", "^", "&", "(",")","-","=","+",
  "{", "}", "[", "]", "|", "\\", ":", ";", "<", ">",
  ",", ".", "?", "/", "*", "", "test with spaces"]

test.each(invalid_characters)(
  'Invalid Character %s',
  (ident_str) => { expect( ic.valid_identifier(ident_str) ).toBe(false) }
);


test('Valid string no error thrown', () => {
  expect(() => ic.check_identifier_error('random_name')).not.toThrow();
});

test.each(invalid_characters)(
  'Throw Error Invalid Character %s',
  (ident_str) => { expect(() => ic.check_identifier_error(ident_str)).toThrow() }
);