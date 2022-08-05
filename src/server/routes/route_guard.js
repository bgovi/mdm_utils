/*
This modules is responsible for assembling and checking user permission to pull and push data to
a given table 

creates query.
Simple function that returns common information from the req object.
May change when switching from development to production with oauth.
*/

function RoutePermissionsQuery(schema_name, table_name, crud_type, user_session, postgres_schema, postgres_table ) {
    /*
    Creates the perms object which determines what permissions a user has. The permission are combined from the default table permissions
    user table permissions and the user role i.e if admin has all permissions set to true
    */
    var req_body = req['body']
    const user_id = er.ExtractUserId(req) //req_body['user_id']
    const user_permission = await users.findOne({ where: user_id} )
    const user_table_permission = await data_table_permissions.findOne({ where: {'user_id': user_id, 'data_table_id': table_id, 'current_status_id': 1  }   })
    //active permissions
    const default_table_permission = await data_tables.findOne({where: {'id': table_id}  })
}
 

module.exports = {
    "AddPermissiosn": AddPermissions,
}