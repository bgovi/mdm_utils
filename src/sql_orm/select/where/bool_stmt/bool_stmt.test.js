const bx = require('./index.js')

test('boolean lt statement test', () => 
    {

        let x = bx.CreateBooleanStatement('"Col1"', "<", "$1" )
        expect(x).toBe( '( "Col1" < $1 )' )
    }
);

test('boolean like_in statement test', () => 
    {

        let x = bx.CreateBooleanStatement('"Col1"', "like_in", "$1,$2,$3" )
        expect(x).toBe( '( "Col1" LIKE ANY ( ARRAY[ $1,$2,$3 ] ) )' )
    }
);

test('boolean in statement test', () => 
    {
        let x = bx.CreateBooleanStatement('"Col1"', "in", "$1,$2,$3" )
        expect(x).toBe( '( "Col1" IN ( $1,$2,$3 ) )' )
    }
);

test('boolean is null', () => 
    {
        let x = bx.CreateBooleanStatement('"Col1"', "is_null", "" )
        expect(x).toBe( '( "Col1" IS NULL )' )
    }
);

test('boolean between', () => 
    {
        let x = bx.CreateBooleanStatement('"Col1"', "between", "$1,$2" )
        expect(x).toBe( '( "Col1" BETWEEN SYMMETRIC $1 AND $2 )' )
    }
);