/*
Used to assemble transaction string.

combines information from mutations and select statement


BEGIN;
set local app.user_id = 'id from user'

query statement


COMMIT;

convert data and query params to array of objects if 




// const query = SQL`SELECT * FROM books`
// if (params.name) {
//   query.append(SQL` WHERE name = ${params.name}`)
// }
// query.append(SQL` LIMIT 10 OFFSET ${params.offset || 0}`)



// const { Pool } = require('pg')
// const pool = new Pool()
// ;(async () => {
//   // note: we don't try/catch this because if connecting throws an exception
//   // we don't need to dispose of the client (it will be undefined)
//   const client = await pool.connect()
//   try {
//     await client.query('BEGIN')
//     const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
//     const res = await client.query(queryText, ['brianc'])
//     const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
//     const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
//     await client.query(insertPhotoText, insertPhotoValues)
//     await client.query('COMMIT')
//   } catch (e) {
//     await client.query('ROLLBACK')
//     throw e
//   } finally {
//     client.release()
//   }
// })().catch(e => console.error(e.stack))


/*
error_handling?


let query_params = [
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.
    {
        "crud_type": "", //only needed for save route 
        "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
        "set_fields": "",  //array that has columns that should be used for set
        "on_conflict": "",
        "on_constraint": "",
        "where": "",
        "page": "", //object {'offset': val, 'limit': val}
        "search_filter": "", //string or object with quick filter type:
        "search_rank": "", //bool
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
    }]








*/
function CreateWriteTransaction(query, params, session_user_id) {
    //check session_user_id
    //let query = xyz
    let trans = `BEGIN; SET LOCAL app.user_id='${session_user_id}'; ${query}; COMMIT;`
}