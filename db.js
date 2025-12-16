const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql.freedb.tech',      // TU IP PÚBLICA
  user: 'freedb_apiuser',
  password: 'b%%y!fm3FnxC?8M',
  database: 'freedb_sahp_driving',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;


