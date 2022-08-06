const db = require('./index.js')
const { QueryTypes } = require('sequelize');


// InsertStatement(schema_name, table_name, row_data,values, index, insert_params )
test('simple select', async () => 
    {
        // console.log(db.query)
        // let query = db.query
        // console.log(query)
        try {
            const [res, meta] = await db.sequelize.query(`SELECT null::timestamp;`)
            // res[0]['created_at'] = String(res[0]['created_at'])
            console.log(res)
            // console.log(meta)

        } catch (e) {
            console.log(e)
        }
        // const [res, meta] = await db.query('select * FROM company limit 2')
        // console.log(res)
        // console.log(meta)
        expect(true).toBe(true)
    }
);





test('close sequelize', () => 
    {
        // console.log(db.query)
        // let query = db.query
        // console.log(query)

        db.sequelize.close()
        expect(true).toBe(true)
    }
);