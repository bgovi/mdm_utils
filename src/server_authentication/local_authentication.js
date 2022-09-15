
//https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5
//https://medium.com/nerd-for-tech/google-oauth2-0-authentication-using-node-js-and-passportjs-1a77f42b1111

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const config = require('../config')
const SetSession = require('./set_session')
const { FindUserById } = require('../sql_orm')

async function AuthenticateUser(username, password, done) {
    //username is actually id in user id table. password is not used.
    // Use the "user" and "password" to search the DB and match user/password to authenticate the user
    // 1. If the user not found, done (null, false)
    // 2. If the password does not match, done (null, false)
    // 3. If user found and password match, done (null, user)    
    // let authenticated_user = { id: 123, name: "Kyle"} 
    try{
        // console.log(username)
        // let users = {'id': 1} //await FindUserById(username)
        // return done( null, users)
        let users = await FindUserById(username)

        console.log(users)
        if (users.length == 0) {return done(null, false)}
        let user = users[0]
        return done (null, user ) 
    } catch(e) {
        console.log(e)
        return done(e)
    }
}


async function InitializePassportJs(app,is_multicore = false) {
    await SetSession(app, is_multicore)
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('local',new LocalStrategy (AuthenticateUser))

    passport.serializeUser( (user, done) => {  done(null, user.id) } )
    
    
    passport.deserializeUser( async (id, done) => {
        try {
            let users = await FindUserById(id)
            let user = users[0]
            done (null, user )      


        } catch (e) {
            console.log(e)
            return done(e)
        }
    }) 


    // initialize passport


    app.get("/login", (req, res) => { res.render("login.ejs") })
    
    app.get('/logout', function(req, res, next){
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/login');
        });
    });
    
    
    app.post ("/login", function(req,res,next){
        console.log('post login');
        next()
    },  passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
    }))

}

module.exports = InitializePassportJs