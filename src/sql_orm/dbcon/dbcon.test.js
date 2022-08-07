const db = require('./index.js')


// InsertStatement(schema_name, table_name, row_data,values, index, insert_params )
test('simple insert', async () => 
    {

        try {
            let res = await db.RunQuery(`INSERT INTO x VALUES (:x) RETURNING x;`, {x:2} )
            console.log(res)
        } catch (e) {
            let pmsg  = e.parent
            let omsg  = e.original
            console.log(String(pmsg))
        }
        expect(true).toBe(true)
    }
);

test('simple select append to out_data', async () => 
    {
        let out_data   = []
        let error_data = []
        await db.RunQueryAppendData (out_data, error_data, `SELECT * from x limit 5;`, {})
        console.log(out_data)
        expect(true).toBe(true)
    }
);



test('close sequelize', () => 
    {
        db.sequelize.close()
        expect(true).toBe(true)
    }
);