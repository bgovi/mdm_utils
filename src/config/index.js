// psql postgresql://postgres:mysecretpassword@localhost:4432/postgres -f app_init.psql

module.exports = {
    db: {
        database: process.env.DATABASE || 'postgres',
        user: process.env.DBUSER || 'postgres',
        password: process.env.PASSWORD || 'mysecretpassword',
        port: process.env.DBPORT || 4432,
        host: process.env.HOST || 'localhost'
    },
    azure: {
        clientID: process.env.CLIENTID ||  'id',
        clientSecret: process.env.CLIENT_SECRET || 'secret',
        cookieKey: process.env.COOKIEKEY || 'random'
    }
}