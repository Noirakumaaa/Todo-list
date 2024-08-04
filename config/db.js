const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'Noir',
    password: 'Noirakumaa#099',
    database: 'todo_list'
});

module.exports = pool;
