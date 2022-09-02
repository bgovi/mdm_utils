// psql postgresql://postgres:mysecretpassword@localhost:4432/postgres -f app_init.psql

module.exports = {
    db: {
        database: 'postgres',
        user: 'postgres',
        password: 'mysecretpassword',
        port: 4432,
        // dialect: 'postgres',
        host: 'localhost'
    },
    azure: {
        clientID:    'id',
        clientSecret: 'secret',
        callbackURL: 'https://url_name',
        cookieKey: 'random'
    }
}