/*
This module handles all required options for using
jsonwebtoken library


*/
const jwt = require('jsonwebtoken')


//maxAge: 1000, "2 days", "10h", "7d"
//need to add options default instead of expiresIn
function jwt_create(jwt_key, payload, expiresIn='7d') {
    let token = jwt.sign(payload, jwt_key, {expiresIn: expiresIn})
    return token
}


function jwt_is_valid(jwt_token, jwt_key) {

    try {
        let jwt_decoded = jwt.verify(jwt_token, jwt_key)
        let is_valid = true
        return {'jwt_decoded': jwt_decoded, 'is_valid': is_valid, 'error_msg': ""}
    } catch (err) {
        let jwt_decoded = {}
        let is_valid = true
        let error_msg = String(err)
        return {'jwt_decoded': jwt_decoded, 'is_valid': is_valid, 'error_msg': error_msg}
    }


}

function jwt_decoded(jwt_token) {
    let decoded = jwt.decode(jwt_token)    
    return decoded.payload
}


function jwt_refresh(jwt_token, jwt_key, expiresIn='7d') {}


//refresh_refresh_token
//refresh_access_token

//expires?
//global jwt_placeholder
//refresh global jwt_placeholder
module.exports = {
    'jwt_is_valid': jwt_is_valid,
    'jwt_decoded': jwt_decoded,
    'jwt_create': jwt_create,
    'jwt_refresh': jwt_refresh
}