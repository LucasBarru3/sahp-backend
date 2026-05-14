const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '62.174.209.244',      // TU IP PÚBLICA
  user: 'sahp_user',
  password: 'sahp_pass',
  database: 'sahp_backup',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;


