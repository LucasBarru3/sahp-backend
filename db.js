const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql306.infinityfree.com',      // TU IP PÚBLICA
  user: 'if0_41539582',
  password: 'Cj2EiU8Saiiljj',
  database: 'if0_41539582_sahp',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;


