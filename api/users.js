const db = require('../db');
const Cors = require('cors');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('./middlewares/auth');
// Configuración de CORS
const cors = Cors({
  origin: 'https://sahp-fam.vercel.app', // tu frontend en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Helper para usar CORS con async/await
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      resolve(result);
    });
  });
}

module.exports = async (req, res) => {
  // Ejecutamos CORS antes de cualquier cosa
  await runMiddleware(req, res, cors);

  try {
    // GET todos los instructores
    if (req.method === 'GET') {
      const [rows] = await db.query(`
        SELECT 
          u.id,
          u.username,
          u.created_at
        FROM users u
      `);
      return res.status(200).json(rows);
    }

    // DELETE instructor
    if (req.method === 'DELETE') {
      try {
        user = verifyToken(req, res);
      } catch {
        return res.status(401).json({ error: 'No autorizado' });
      }
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Falta id' });
      }

      await db.query(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      return res.status(200).json({ message: 'Usuario eliminado' });
    }

    // POST nuevo usuario
    if (req.method === 'POST') {
      try {
        user = verifyToken(req, res);
      } catch {
        return res.status(401).json({ error: 'No autorizado' });
      } 
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      // 🔐 HASHEAR PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query(
        `INSERT INTO users (username, password)
        VALUES (?, ?)`,
        [username, hashedPassword]
      );

      return res.status(201).json({ message: 'Usuario creado' });
    }


    // PUT actualizar usuario
    if (req.method === 'PUT') {
      try {
        user = verifyToken(req, res);
      } catch {
        return res.status(401).json({ error: 'No autorizado' });
      }
      const { id } = req.query;
      const { username, password } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Falta id' });
      }

      let query = 'UPDATE users SET username = ?';
      let values = [username];

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        values.push(hashedPassword);
      }

      query += ' WHERE id = ?';
      values.push(id);

      await db.query(query, values);

      return res.status(200).json({ message: 'Usuario actualizado' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};
