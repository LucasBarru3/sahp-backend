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

    if (req.method === 'POST') {
      const { name, description } = req.body;
      await db.query(
        'INSERT INTO classes (name, description) VALUES (?, ?)',
        [name, description]
      );
      return res.status(201).json({ message: 'Clase creada' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};

