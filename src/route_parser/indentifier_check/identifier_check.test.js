/*
Test identifier_check recognizes special characters
*/
const ic = require('./index.js')

test('Valid string', () => {
    expect(ic.ValidIdentifier('user_Prov9')).toBe(true);
});

// test.each
//empty space check

invalid_characters = ["'", '"', "`", "~",  "!", "@",
  "#","$", "%", "^", "&", "(",")","-","=","+",
  "{", "}", "[", "]", "|", "\\", ":", ";", "<", ">",
  ",", ".", "?", "/", "*", "", "test with spaces"]

test.each(invalid_characters)(
  'Invalid Character %s',
  (ident_str) => { expect( ic.ValidIdentifier(ident_str) ).toBe(false) }
);


test('Valid string no error thrown', () => {
  expect(() => ic.CheckIdentifierError('random_name')).not.toThrow();
});

test.each(invalid_characters)(
  'Throw Error Invalid Character %s',
  (ident_str) => { expect(() => ic.CheckIdentifierError(ident_str)).toThrow() }
);