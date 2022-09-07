const fs = require('fs')
const path = require('path')
const type_check = require('../../sutils')

var types = require('pg').types;
//timestamp object to string remove values after +
types.setTypeParser(1184, function(stringValue) {
    // return stringValue.substring(0, stringValue.indexOf('+') )
    return stringValue.substring(0, stringValue.indexOf('.') )
});
//keep date as string
types.setTypeParser(1082,'text',function(text) {return text;});

const Sequelize = require('sequelize')
const config = require('../../config/');
const db = {}


// 'postgres://user:pass@example.com:5432/dbname') // Example for postgres

// const sequelize = new Sequelize(
//     config.db.database,
//     config.db.user,
//     config.db.password,
//     config.db.options,
// )
let host = `${config.db.host}`
if (config.db.hasOwnProperty('port') ) {
    host += `:${config.db.port}`
}

let conn_string = `postgresql://${config.db.user}:${config.db.password}@${host}/${config.db.database}`
console.log(conn_string)

// const sequelize = new Sequelize('postgresql://postgres:mysecretpassword@localhost:4432/postgres')
const sequelize = new Sequelize(conn_string)

async function RunQuery(query_string, replacements) {
    /*
    Main function to run query and return data or error message.
    */
    try {
        if (type_check.IsObject(replacements) || type_check.IsArray(replacements) ) {
            const [res, meta] = await db.sequelize.query(query_string, {replacements: replacements} )
            return res
        } else {
            return "Invalid replacements object must be array or object"
        }

    } catch (e) {
        // console.log(e)
        let pmsg  = e.parent
        let omsg  = e.original
        return String(pmsg)
    }
}

async function RunQueryAppendData (out_data, error_data, query_string, replacements) {
    /*
    Adds results of query to out_data or error_data. Correct results will be sent as 
    an object or an array of objects. Errors are strings

    */
    let value = await RunQuery(query_string, replacements)
    if (typeof value === 'string' || value instanceof String ) { 
        error_data.push(value) 
    }
    else {
        //if values is array i.e. return results from select. for loop
        if (type_check.IsArray(value) ) {
            for(let i =0; i < value.length; i++) {
                let x = value[i]
                out_data.push(x)
            }
        } else { out_data.push(value)}
    }
}

db.sequelize = sequelize
db.Sequelize = Sequelize
db.RunQuery  = RunQuery
db.RunQueryAppendData = RunQueryAppendData

module.exports = db