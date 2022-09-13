const session = require('express-session')
const redis = require('redis')
const redisStore = require('connect-redis')(session)
const config = require('../config')

async function SetSession(app, is_multicore=false) {
    if (is_multicore) {
        const redisClient = redis.createClient({
            socket: {
                host: 'localhost',
                port: 6380
            }
        }

        )
        await redisClient.connect()
        redisClient.on('error', (err) => {
            console.log('Redis error: ', err);
        });

        app.use(session({
            secret: config.azure.cookieKey,
            name: '_redisPractice',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
            store: new redisStore({ host: 'localhost', port: 6380, client: redisClient, ttl: 864000 }),
        }));
    }
    else {
        //parameters used to create encrypted browser cookie. The cookie stores the login session
        // console.log('seession stuff')
        app.use(session({ 
            secret: config.azure.cookieKey,
            resave: false,
            saveUninitialized: true,

        }))
    }
}

module.exports = SetSession