/*
Need to have explicit typ: jwt


*/
const jwt = require('jsonwebtoken')


//maxAge: 1000, "2 days", "10h", "7d"

function jwt_create(jwt_key, payload) {
    var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'});

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

function jwt_is_expired(json_jwt) {

}



//refresh_refresh_token
//refresh_access_token

//expires?
//global jwt_placeholder
//refresh global jwt_placeholder
module.exports = {
    'jwt_is_valid': jwt_is_valid,
    'jwt_to_json': jwt_to_json
}