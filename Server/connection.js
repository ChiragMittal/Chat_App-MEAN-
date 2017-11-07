var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'CHG',
    password: '',
    database: 'chat'
});

module.exports = pool;