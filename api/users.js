const db = require('../db');
const Cors = require('cors');

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
          u.password,
          u.created_at
        FROM users u
      `);
      return res.status(200).json(rows);
    }

    // DELETE instructor
    if (req.method === 'DELETE') {
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

    // POST nuevo instructor
    if (req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      await db.query(
        `INSERT INTO users 
          (username, password)
          VALUES (?, ?)`,
        [username, password]
      );

      return res.status(201).json({ message: 'Usuario creado' });
    }

    // PUT actualizar instructor existente
    if (req.method === 'PUT') {
      const { id } = req.query;
      const { username, password } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Falta id' });
      }

      await db.query(
        `UPDATE users SET
          username = ?, 
          password = ?
        WHERE id = ?`,
        [username, password, id]
      );

      return res.status(200).json({ message: 'Usuario actualizado' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};
