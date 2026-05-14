const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '62.174.209.244',      // TU IP PÚBLICA
  user: 'root',
  password: '',
  database: 'sahp_backcup',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;


