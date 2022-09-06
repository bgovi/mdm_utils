/*
This module handles authentication (login/logout) for the Provider Effort App.
Authentication cookies is created using express-session.

*/


const passport = require('passport')
var AzureOAuth2Strategy  = require("passport-azure-oauth2")
const config = require('../../config')
const SetSession = require('./set_session')
const redis = require('redis')
const redisStore = require('connect-redis')(session)
var jwt = require("jwt-simple")
const { UpdateUser, CreateUser, FindUser } = require('../../sql_orm')


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
    passport.deserializeUser( async (id, done) => {
        //search for user
        try{
            let users = await FindUserById(id)
            let user = users[0]
            done(null, user)
        } catch (e) {
            console.log(e)
            return done(e)
        }
    } )    

    //Main Iniitialization object for azure OAuth. 
    passport.use("provider",
        new AzureOAuth2Strategy({
            // 1. If the user not found, done (null, false)
            // 2. If the password does not match, done (null, false)
            // 3. If user found and password match, done (null, user)
            clientID:  config.azure.clientID,
            clientSecret: config.azure.clientSecret,
            //resource: config.azure.resource,
            //tenant: config.azure.tenant,
            callbackURL: 'https://iuhpcbia.azurewebsites.net/auth/azure/redirect'
        }, async (accessToken, refreshToken, params, profile, done) => {
            try{


                var userProfile = jwt.decode(params.id_token, "", true)
                //find one user
                let firstName = userProfile.given_name
                let lastName = userProfile.family_name
                let email = userProfile.up

                let oauth_id    = userProfile.upn
                let currentUsers = await FindUser(oauth_id)
                if (currentUsers.length === 0) {
                    console.log("Creating New User")
                    let newUsers = await CreateUser(first_name, last_name, email, oauth_id)
                    done(null, newUsers[0])

                } else {
                    let currentUser = currentUsers[0]
                    if (firstName !== currentUser.firstName || lastName !== currentUser.lastName || email !== currentUser.email ) {
                        let updatedUsers = await UpdateUser(first_name, last_name, email, oauth_id)
                        let updatedUser  = updatedUsers[0]
                        console.log('updated user is ', updatedUser.email)
                        done(null, updatedUser)
                    } else {
                        done(null, currentUser)
                    }
                }
            } catch (e) {
                console.log(e)
                done(e)
            }
        })
    )
    SetSession(app, is_multicore)
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

    // callback route for azure to redirect to
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

