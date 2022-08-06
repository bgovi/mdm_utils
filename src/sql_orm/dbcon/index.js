const fs = require('fs')
const path = require('path')

var types = require('pg').types;
//timestamp object to string remove values after +
types.setTypeParser(1184, function(stringValue) {
    return stringValue.substring(0, stringValue.indexOf('+') )
});

const Sequelize = require('sequelize')
const { QueryTypes } = require('sequelize');
const config = require('../../config/')
const db = {}


const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options,

)

console.log(config.db)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db