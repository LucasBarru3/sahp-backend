const db = require('../db');
const Cors = require('cors');

// Configuración de CORS
const cors = Cors({
  origin: 'https://sahp-frontend.vercel.app', // tu frontend en Vercel
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
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
    if (req.method === 'GET') {
      const [rows] = await db.query(`
        SELECT 
          i.state_id,
          i.nombre,
          i.apellidos,
          i.rango_sahp,
          i.fecha_nacimiento,
          i.telefono,
          i.foto,
          COUNT(*) OVER () AS instructor_count
        FROM instructors i
      `);
    
      return res.status(200).json(rows);
    }

    if (req.method === 'DELETE') {
      const { state_id } = req.query; // ✅ req.query existe en serverless

      if (!state_id) {
        return res.status(400).json({ error: 'Falta state_id' });
      }

      await db.query(
        'DELETE FROM instructors WHERE state_id = ?',
        [state_id]
      );

      return res.status(200).json({ message: 'Instructor eliminado' });
    }

    if (req.method === 'POST') {
      const {
        nombre,
        apellidos,
        rango_sahp,
        fecha_nacimiento,
        telefono,
        foto
      } = req.body;

      await db.query(
        `INSERT INTO instructors 
        (nombre, apellidos, rango_sahp, fecha_nacimiento, telefono, foto)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellidos, rango_sahp, fecha_nacimiento, telefono, foto]
      );

      return res.status(201).json({ message: 'Instructor creado' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};

