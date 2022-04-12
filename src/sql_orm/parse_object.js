/*
Used to parse and add bind parameters or ? replacement values for array and json

CREATE TABLE sal_emp (
name            text,
pay_by_quarter  integer[],
schedule        text[][]
);

INSERT INTO sal_emp
VALUES ('Bill',
ARRAY[10000, 10000, 10000, 10000],
ARRAY[['meeting', 'lunch'], ['training', 'presentation']]);

INSERT INTO sal_emp
VALUES ('Carol',
ARRAY[20000, 25000, 25000, 25000],
ARRAY[['breakfast', 'consulting'], ['meeting', 'lunch']]);
*/