const db = require('../db');
const Cors = require('cors');
const { verifyToken } = require('./middleware/auth');
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
          i.id,
          i.name,
          i.image_url,
          i.title,
          i.description,
          i.required,
          i.exempt,
          i.active
        FROM licenses i
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
        'DELETE FROM licenses WHERE id = ?',
        [id]
      );

      return res.status(200).json({ message: 'Licencia eliminada' });
    }

    // POST nueva licencia
    if (req.method === 'POST') {
      try {
        user = verifyToken(req, res);
      } catch {
        return res.status(401).json({ error: 'No autorizado' });
      }
      const { name, image_url, title, description, required, exempt, active } = req.body;

      if (!name || !image_url || !title || !description || !required || !exempt || active === undefined) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      await db.query(
        `INSERT INTO licenses 
          (name, image_url, title, description, required, exempt, active)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, image_url, title, description, required, exempt, active]
      );

      return res.status(201).json({ message: 'Licencia creada' });
    }

    // PUT actualizar instructor existente
    if (req.method === 'PUT') {
      try {
        user = verifyToken(req, res);
      } catch {
        return res.status(401).json({ error: 'No autorizado' });
      }
      const { id } = req.query;
      const { name, image_url, title, description, required, exempt, active } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Falta id' });
      }

      await db.query(
        `UPDATE licenses SET
          name = ?, 
          image_url = ?, 
          title = ?, 
          description = ?, 
          required = ?, 
          exempt = ?, 
          active = ?
        WHERE id = ?`,
        [name, image_url, title, description, required, exempt, active, id]
      );

      return res.status(200).json({ message: 'Licencia actualizada' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};
