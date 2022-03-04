/*
Simple function that returns common information from the req object.
May change when switching from development to production with oauth.
*/

module.exports = {

    ExtractUserId(req) {
        return req['body']['user_id']
    },
    ExtractPermissions(req) {
        //Value set in query_permissions.js RoutePermissions
        return req['body']['user_permissions']
    },
    ExtractTableId(req,routeTableId) {
        if (req['body'].hasOwnProperty('table_id')) {
            return req['body']['table_id']
        } else {
            return routeTableId
        }
    }

}