/*
Used to assemble transaction string.

combines information from mutations and select statement


BEGIN;
set local app.user_id = 'id from user'

query statement


COMMIT;

convert data and query params to array of objects if 

*/



// const query = SQL`SELECT * FROM books`
// if (params.name) {
//   query.append(SQL` WHERE name = ${params.name}`)
// }
// query.append(SQL` LIMIT 10 OFFSET ${params.offset || 0}`)