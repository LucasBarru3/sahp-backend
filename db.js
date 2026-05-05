const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql104.iceiy.com',      // TU IP PÚBLICA
  user: 'icei_41837816',
  password: 'gonzalop',
  database: 'icei_41837816_sahp',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;


