const getRecords = require('express').Router();
const pool = require('../pool');

getRecords.get("/records", (req, res) => {

    const sessionId = req.cookies.sessionId;

    if(sessionId.length == 20){
        pool.getConnection((err, connection) => {
            connection.query(`SELECT * FROM clients`, (err, rows) => {
                connection.release();
    
                if(err) {
                    res.status(500).json({
                        error: 10,
                        message: "Database error",
                        body: err
                    })
    
                    return res.end()
                }
    
                let data = JSON.stringify(rows);
                data = JSON.parse(data);

                let records = data.map((rec) => {
                    if(rec.selected > +new Date()){
                        return {...rec, selected: true}
                    }else{
                        return {...rec, selected: false}
                    }
                })
    
                res.status(200).json({
                    error: 0,
                    data: records
                })
    
                return res.end()
    
            })
        })
    }else{
        res.status(403).json({
            error: 403,
            access: "danied"
        })
    }

})

module.exports = getRecords