/*
This modules is responsible for assembling and checking user permission to pull and push data to
a given table 
*/
const {users, data_table_permissions, data_tables, specialty_permissions, sequelize} = require('../models')
const er = require('./extract_req')

async function RoutePermissions(req, table_id, next = null) {
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




    var perms = UserRoutePermissions(user_permission, user_table_permission, default_table_permission)
    if (next !== null ) {
        req['body']['user_permissions'] = perms
        next() 
    } else {
        return perms
    }

}

/*
ModifyPass and ModifyFail are wrappers for all insert,update,delete and upsert return objects
*/
function ModifyPass (row_node_id,  row_id) {
    //crud_type: insert, delete, 
    return {'is_error': false, 'node_id': row_node_id,  'error_msg': '', 'id': row_id }

}

function ModifyFail (row_node_id,   row_id, err_msg) {
    //try catch for error message?
    return {'is_error': true, 'node_id': row_node_id, 'error_msg': err_msg, 'id': row_id }

}



async function SpecialtyPermissions(req) {
    //return specialties permissons. json array of ids? maybe switch to object
    var req_body = req['body']
    const user_id = er.ExtractUserId(req)//req_body['user_id']
    specialty_permission_array = await specialty_permissions.findAll({ attributes: ['id'], where: {'user_id': user_id}   })
    var specialty_permission = {}
    for (s_row of specialty_permission_array) {
        specialty_permission[s_row['id']] = null
    }
    return specialty_permission
}

async function CostCenterPermissions(req) {
    //returns array of cost_center_id. that a user has permissions for
    //const { QueryTypes } = require('sequelize')
    var req_body = req['body']
    const QueryTypes = sequelize.QueryTypes
    const user_id = er.ExtractUserId(req)//req_body['user_id']
    sql_string = `SELECT id from cost_centers where specialty_id in (SELECT specialty_id FROM specialty_permissions where user_id = :user_id )`
    cost_center_ids = await sequelize.query(sql_string, {type: QueryTypes.SELECT, replacements: {'user_id': user_id} })//custom query return cost_center_ids based on user_id and specialties??
    cost_center_permission = {}
    for (c_row of cost_center_ids) {
        cost_center_permission[c_row['id']] = null
    }
    return cost_center_permission
}

function UserRoutePermissions(user_perms,user_table_perms, default_perms) {
    /*
        called by RoutePermissions
        takes all permisison objects from default table permissions, user assigned table permissions and user role and creates
        a unified object that descbribes all the users permissions.

        order of precedence. user_table_permissions overide defulat_perms. Also if the user is an admin everything will be 
        set to true
    */


    var perms = {'allow_read': false, 'allow_insert': false, 'allow_update': false, 'allow_deactivate': false, 'allow_delete': false,
        'is_admin': false, 'allow_modify_all': false, 'allow_read_all': false, 'permission_level': 0 }
    
    //default permissions first. means table doesnt exist if null

    if (default_perms === null) { return perms}
    if (user_perms === null) { return perms} //undefined user
    var keys = Object.keys(perms)
    //check user_role_id??
    //if (key == 'permission_level') {continue}
    // 1 is Admin, 3 is User, 6 is Deactivated , 7 is New

    var user_role_id = user_perms['role_id']


    if (user_role_id == 1) {
        for (key of keys) {
            if (key == 'permission_level') {continue}
            perms[key] = true
        }
        return perms
    } else if ( [2,4,5].includes(user_role_id) ) {return perms} //manager, viewerall, and viewer are depricated roles

    //default table permissions
    for (key of keys) {
        if (key == 'is_admin') {continue}
        if (key == 'permission_level') {continue}
        perms[key] = default_perms[key]
    }

    //user table permissions
    //default table permissions
    if (user_table_perms === null) {return perms}
    if (user_table_perms['is_admin']) {
        for (key of keys) {
            if (key == 'permission_level') {continue}
            perms[key] = true
        }
        return perms
    }
    for (key of keys) {
        //if user table permissions has admin set all to true.
        if (['allow_modify_all', 'allow_read_all'].includes(key)) {continue}
            perms[key] = user_table_perms[key]
    }
    return perms
}

//Check database permissions
//user_perms = req['body']['user_permissions]
function AllowRead(user_perms, is_all=false) {
    if (is_all) { return user_perms['allow_read'] && user_perms['allow_read_all'] }
    return user_perms['allow_read']
}

function AllowInsert(user_perms, is_all=false) {
    if (is_all) { return user_perms['allow_insert'] && user_perms['allow_modify_all'] }
    return user_perms['allow_insert']
}

function AllowUpdate(user_perms, is_all=false) {
    if (is_all) { return user_perms['allow_update'] && user_perms['allow_modify_all'] }
    return user_perms['allow_update']
}

function AllowDeactivate(user_perms, is_all=false) {
    if (is_all) { return user_perms['allow_deactivate'] && user_perms['allow_modify_all'] }
    return user_perms['allow_deactivate']
}

function AllowDelete(user_perms, is_all=false) {
    if (is_all) { return user_perms['allow_delete'] && user_perms['allow_modify_all'] }
    return user_perms['allow_delete']
}

function AllowUpsert(user_perms, is_all=false) {
    return AllowInsert(user_perms, is_all = is_all) && AllowUpdate(user_perms, is_all = is_all)
}

function IsAdmin(user_perms) {
    return user_perms['is_admin']
}

async function AddPermissions(req, next) {
    user_perms = await RoutePermissions(req, table_id)
    req['body']['user_permissions'] = user_perms
    next()
}

function IsUndefined(user_perms) {
    if (user_perms === undefined) {
        throw new Error("server error. user permissions is undefined")
    }
}

//UpdateAdminPermissions

module.exports = {
    //table default permissions
    //assigned user role i.e. admin permissions
    //assigned table permissions
    "AddPermissiosn": AddPermissions,
    "RoutePermissions": RoutePermissions,
    "SpecialtyPermissions": SpecialtyPermissions,
    "CostCenterPermissions": CostCenterPermissions,
    "UserRoutePermissions": UserRoutePermissions,
    //input is user_perms
    "AllowRead": AllowRead,
    "AllowInsert": AllowInsert,
    "AllowUpdate": AllowUpdate,
    "AllowDeactivate": AllowDeactivate,
    "AllowDelete": AllowDelete,
    "AllowUpsert": AllowUpsert,
    "IsAdmin": IsAdmin,
    //Add Error checking Functions. if true continue else throw error
    ReadPermissionsCheck(req,is_all = false) {
        var user_perms = er.ExtractPermissions(req)//req['body']['user_permissions']
        IsUndefined(user_perms)
        if (IsAdmin(user_perms)) {return}
        if (! AllowRead(user_perms, is_all = is_all)) {
            throw new Error("User does not have read permissions for this data")
        }
    },
    InsertPermissionsCheck(req,is_all = false) {
        var user_perms = er.ExtractPermissions(req)//req['body']['user_permissions']
        IsUndefined(user_perms)
        if (IsAdmin(user_perms)) {return}
        if (! AllowInsert(user_perms, is_all = is_all)) {
            throw new Error("User does not have insert permissions for this data")
        }
    },
    UpdatePermissionsCheck(req,is_all = false) {
        var user_perms = er.ExtractPermissions(req)//req['body']['user_permissions']
        IsUndefined(user_perms)
        if (IsAdmin(user_perms)) {return}
        if (! AllowUpdate(user_perms, is_all = is_all)) {
            throw new Error("User does not have update permissions for this data")
        }
    },
    DeletePermissionsCheck(req,is_all = false) {
        var user_perms = er.ExtractPermissions(req)//req['body']['user_permissions']
        IsUndefined(user_perms)
        if (IsAdmin(user_perms)) {return}
        if (! AllowDelete(user_perms, is_all = is_all)) {
            throw new Error("User does not have delete permissions for this data")
        }
    },
    UpsertPermissionsCheck(req,is_all = false) {
        var user_perms = er.ExtractPermissions(req)//req['body']['user_permissions']
        IsUndefined(user_perms)
        if (IsAdmin(user_perms)) {return}
        if (! AllowUpsert(user_perms, is_all = is_all)) {
            throw new Error("User does not have insert and update permissions for this data")
        }
    },
    DeactivatePermissionsCheck(req,is_all = false) {
        var user_perms = er.ExtractPermissions(req)//req['body']['user_permissions']
        IsUndefined(user_perms)
        if (IsAdmin(user_perms)) {return}
        if (! AllowDeactivate(user_perms, is_all = is_all)) {
            throw new Error("User does not have deactivate permissions for this data")
        }
    },
    AdminPermissionsCheck(req) {
        var user_perms = er.ExtractPermissions(req)//req['body']['user_permissions']
        IsUndefined(user_perms)
        if (! IsAdmin(user_perms) ) {
            throw new Error("User does not have admin permissions for this data")
        }
    },

    HasCostCenterPermissions(cost_center_id, cost_center_permission, is_admin=false) {
        //might be a json list
        if (is_admin) { return }
        if (cost_center_permission.hasOwnProperty(cost_center_id)) {return}
        throw new Error("User does not have the specialty or cost_center permission for this data")
    },
    
    HasSpecialtyPermissions(specialty_id, specialty_permission, is_admin=false) {
        //mightbe a json list
        if (is_admin) { return }
        if (specialty_permission.hasOwnProperty(specialty_id)) {return}
        throw new Error("User does not have the specialty permission for this data")
    }
}