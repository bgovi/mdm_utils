var fs = require('fs')
var https = require('https')
const appRoot = require('app-root-path')
const srcRoot = appRoot + '/src'


function forwardHttps(app) {
    //Check if URL secure i.e. using https
    app.use (function (req, res, next) {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
        }
    })
}

/*
This module checks for authentication using passportjs protocol.
*/

function IsDataRoute(urlPath) {
    var path_parts = urlPath.split('/')
    if (path_parts.length < 1 ) {return false}
    if (path_parts[0] === 'data') {return true}
    return false 
}


function authCheck (req, res, next) {
    //reroute to login if not logged in or send error message if accessing data
    //add user it to req.body
    if(!req.user){
        //res.redirect('/login')
        //req['user'] = {'id':1}
        //reg['body']['user_id'] = req.user.id
        //res.redirect('/login')
        var originalUrl = req.originalUrl
        if (IsDataRoute(originalUrl)) {
            res.json({ 'error_msg': "Authentiation Failure", 'is_error': true, 'rows': [], 'table_name': "", 'route_name': originalUrl } )
        }
        res.redirect('/login')
    } else {
        req.body['user_id'] = req.user.id
        next()
    }
}

//Adds all routes to express server
module.exports = {
    'authCheck': authCheck,
}