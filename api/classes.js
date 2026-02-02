const db = require('../db');
const Cors = require('cors');
const { verifyToken } = require('./middleware/auth');

// Configuración de CORS
const cors = Cors({
  origin: 'https://sahp-fam.vercel.app',
  methods: ['GET', 'POST', 'DELETE'],
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
  await runMiddleware(req, res, cors);

  try {
    // ===== GET =====
    if (req.method === 'GET') {
      const [rows] = await db.query(`
        SELECT 
          c.id,
          c.name,
          c.description,
          COUNT(v.id) AS vehicle_count
        FROM classes c
        LEFT JOIN vehicles v ON v.class_id = c.id
        GROUP BY c.id
        ORDER BY c.id
      `);

      return res.status(200).json(rows);
    }

    // ===== POST =====
    if (req.method === 'POST') {
      try {
        user = verifyToken(req, res);
      } catch {
        return res.status(401).json({ error: 'No autorizado' });
      }
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      await db.query(
        'INSERT INTO classes (name, description) VALUES (?, ?)',
        [name, description]
      );

      await db.query(
        'INSERT INTO logs (tipe, action, data, user_id) VALUES (?, ?, ?, ?)',
        ['class', 'create', JSON.stringify({name, description}), user.id]
      );

      return res.status(201).json({ message: 'Clase creada' });
    }

    // ===== DELETE =====
    if (req.method === 'DELETE') {
      try {
        user = verifyToken(req, res);
      } catch {
        return res.status(401).json({ error: 'No autorizado' });
      }
      const clase = req.body;
      const id = clase?.id;
      if (!id) {
        return res.status(400).json({ error: 'Falta id de la clase' });
      }

      // Comprobar si la clase existe
      const [[existing]] = await db.query(
        'SELECT id FROM classes WHERE id = ?',
        [id]
      );

      if (!existing) {
        return res.status(404).json({ error: 'Clase no encontrada' });
      }

      // Comprobar si tiene vehículos asociados
      const [[count]] = await db.query(
        'SELECT COUNT(*) AS total FROM vehicles WHERE class_id = ?',
        [id]
      );

      if (count.total > 0) {
        return res.status(409).json({
          error: 'No se puede eliminar una clase con vehículos asignados',
        });
      }

      // Eliminar clase
      await db.query(
        'DELETE FROM classes WHERE id = ?',
        [id]
      );

      await db.query(
        'INSERT INTO logs (tipe, action, data, user_id) VALUES (?, ?, ?, ?)',
        ['class', 'delete', JSON.stringify(clase.clase), user.id]
      );

      return res.status(200).json({ message: 'Clase eliminada' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};
