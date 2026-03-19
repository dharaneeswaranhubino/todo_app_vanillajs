const mysql = require("mysql2/promise");
require("dotenv").config();

const mysqlpool = mysql.createPool({
    host:"localhost",
    user:"root",
    // password:"dharanIselvI007",
    // database:"todo_app",
    password:process.env.DB_PASS_kEY,
    database:process.env.DB_NAME,
})

module.exports = mysqlpool;