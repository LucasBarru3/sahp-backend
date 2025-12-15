const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '87.235.119.243',      // TU IP PÚBLICA
  user: 'apiuser',
  password: 'tucontraseña',
  database: 'sahp_driving',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;

