/*
This module handles authentication (login/logout) for the Provider Effort App.
Authentication cookies is created using express-session.

*/
const appRoot = require('app-root-path')
const srcRoot = appRoot + '/src'

const passport = require('passport')
var AzureOAuth2Strategy  = require("passport-azure-oauth2")
var session = require('express-session')
const {users, roles} = require(srcRoot + '/models') //users,roles
const config = require(srcRoot + '/config/config.js')
//loging protection function.
const redis = require('redis')
const redisStore = require('connect-redis')(session)


var jwt = require("jwt-simple")


//******************
//May need to change naming convention for tables. Not sure how Sequelize will return values :(

//*/

function InitializePassportJs(app,is_multicore) {
    //functions used for passportjs
    //serialzie takes the user data extracts the id and returns a cookie to the browser
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    //deserializeUser takes the id from the cookie and searches the database for that user.
    //appends user role to user object if id is in database
    passport.deserializeUser((id, done) => {
        //search for user
        users.findOne({ where: {'id': id}, include: [ {model: roles}]}).then((user) => { 
            user['role_name'] = user.role.role_name
            user['role_id'] = user.role.id
            done(null,user)
        } ).catch( (error) => {
            done(null,false)
        })
        //done(null,{"blah":1} )
    })

    //Main Iniitialization object for azure OAuth. 
    passport.use("provider",
        new AzureOAuth2Strategy({


            clientID:  config.azure.clientID,
            clientSecret: config.azure.clientSecret,
            //resource: config.azure.resource,
            //tenant: config.azure.tenant,
            callbackURL: 'https://url_name'
        }, (accessToken, refreshToken, params, profile, done) => {
                var userProfile = jwt.decode(params.id_token, "", true)
                users.findOne({where: {oauth_id: userProfile.upn} }).then((currentUser) => {
                    if(currentUser){
                        // already have this user
                        var firstName = userProfile.given_name
                        var lastName = userProfile.family_name
                        var email = userProfile.upn
                        if (firstName !== currentUser.firstName || lastName !== currentUser.lastName ||
                            email !== currentUser.email ) {
                            currentUser.first_name = firstName
                            currentUser.last_name = lastName
                            currentUser.email = email
                            currentUser.save().then( (updatedUser) => {
                                console.log('updated user is ', updatedUser.email)
                                done(null, updatedUser)
                            })
                        }
                        console.log('user is: ', currentUser.email);
                        //check if names are different?
                        done(null, currentUser);
                    } 
                    //add else if for non iuhealth email
                    else {
                        console.log("Creating New User")
                        var newUserData = {
                            'oauth_id': userProfile.upn,
                            'first_name': userProfile.given_name,
                            'last_name': userProfile.family_name,
                            'email': userProfile.upn,
                            'role_id': 7 //7 Is new user status. 1 for admin must switch to user and give permissions.
                        } 
                        users.create(newUserData).then((newUser) => {
                            console.log('created new user: ', newUser.email);
                            done(null, newUser);
                        })
                    }
                })
        })
    )
    
    if (is_multicore) {
        const redisClient = redis.createClient()
        redisClient.on('error', (err) => {
            console.log('Redis error: ', err);
          });



        app.use(session({
            secret: config.session.cookieKey,
            name: '_redisPractice',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
            store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 864000 }),
          }));




    }
    else {
        //parameters used to create encrypted browser cookie. The cookie stores the login session
        app.use(session({ 
            secret: config.session.cookieKey,
            resave: false,
            saveUninitialized: true,

        }))
    }

    // initialize passport
    app.use(passport.initialize());
    app.use(passport.session());

}


function LoginLogOutRoutes(app) {
    // auth logout. Logout route. Deletes cookie and reroutes to login
    app.get('/logout', (req, res) => {
        req.logout();
        res.clearCookie("connect.sid")
        res.redirect('/login');
    })

    // auth with azure AD
    //logins user
    app.get('/login', passport.authenticate('provider', { prompt: 'select_account',session: false,
        scope: ['profile', 'email']
    }
    ))


    // callback route for azyre to redirect to
    // hand control to passport to use code to grab profile info
    app.get('/auth/azure/redirect', passport.authenticate('provider',
    ), (req, res) => {
        res.redirect('/')
    })
}


//Initializes PassportJs and Authentication Routes.
module.exports = (app,is_multicore=false) => {
    InitializePassportJs(app, is_multicore)
    LoginLogOutRoutes(app)
}

