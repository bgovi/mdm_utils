/*
This module handles all of the primary crud operations.
Returns array of crud operations for sequelize or node postgres

CRUD Operations API. Below are common input parameters used for the crud opeartions: Insert, Update, Upsert, Delete. Save is
a wrapper function for these fields

Crud Return Types:
//insert
create: {row_data}
upsert: [{row_data}, null]
delete: integer
update: [integer]
select
search
help
*/

//return object

/*

Used to assemble transaction string.

combines information from mutations and select statement


BEGIN;
set local app.user_id = 'id from user'

query statement


COMMIT;

*/
function CreateTransaction(query, session_params) {
    //check session_user_id
    //let query = xyz
    let session_stm = SessionParams(session_params)
    let transaction = `BEGIN;
    ${session_stm}'
    ${query};
    COMMIT;
    `
    return transaction
}

function SessionParams( session_params ) {
    //jwt claims that need to be processed.
    //contains app_user_id and is_user_admin
    let keys = Object.keys(session_params)
    let out = []
    for(let i =0; i < keys.length; i++ ) {
        let val = session_params[ keys[i] ]
        if (typeof val === 'number') { out.push(`SET LOCAL ${keys[i]}=${val};`)
        } else { out.push(`SET LOCAL ${keys[i]}=$$${val}$$;` ) }
    }
    let session_stm = out.join('\n')
    return session_stm
}



module.exports = {
    "CreateTransaction": CreateTransaction,
    "SessionParams": SessionParams
}