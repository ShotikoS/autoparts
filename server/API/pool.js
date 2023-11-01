const mysql = require("mysql")
const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "S18gRTY;kleS",
    port: 3306,
    database: "autoparts"
})

module.exports = pool
