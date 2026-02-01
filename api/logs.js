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
          *
        FROM logs
      `);
      return res.status(200).json(rows);
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};
