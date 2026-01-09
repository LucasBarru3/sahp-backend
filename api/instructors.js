const db = require('../db');

// Helper CORS compatible con Vercel
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://sahp-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return await fn(req, res);
};

module.exports = allowCors(async (req, res) => {
  try {

    if (req.method === 'GET') {
      const [rows] = await db.query(`
        SELECT 
          i.id_instructor,
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

    if (req.method === 'DELETE') {
      const { id_instructor } = req.query;

      if (!id_instructor) {
        return res.status(400).json({ error: 'Falta id_instructor' });
      }

      await db.query(
        'DELETE FROM instructors WHERE id_instructor = ?',
        [id_instructor]
      );

      return res.status(200).json({ message: 'Instructor eliminado' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error BD' });
  }
});
