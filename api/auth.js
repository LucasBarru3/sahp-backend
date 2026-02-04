const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware CORS
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // permitir cualquier origen
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return await fn(req, res);
};

module.exports = allowCors(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }
  try {
    // Buscar usuario en BD
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario incorrecto' });
    }

    const user = rows[0];

    // Comprobar contraseña
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      },
      process.env.JWT_SECRET || 'sahp_gang_key',
      { expiresIn: '2h' }
    );


    return res.status(200).json({ token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});
