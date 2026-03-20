const mysql = require("mysql2/promise");

const mysqlpool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS_KEY,
    database: process.env.DB_NAME,
})

module.exports = mysqlpool;