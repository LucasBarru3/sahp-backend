const db = require('../db');
const cors = require('cors');

// Middleware CORS
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // permite todas las peticiones
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return await fn(req, res);
};

module.exports = allowCors(async (req, res) => {
  try {
    // GET todos los vehículos
    if (req.method === 'GET' && !req.query.classId) {
      const [rows] = await db.query('SELECT * FROM vehicles');
      return res.status(200).json(rows);
    }

    // GET vehículos por clase
    if (req.method === 'GET' && req.query.classId) {
      const [rows] = await db.query('SELECT * FROM vehicles WHERE class_id = ?', [req.query.classId]);
      return res.status(200).json(rows);
    }

    // POST crear vehículo
    if (req.method === 'POST') {
      const { name, model, image_url, class_id, follow_class, tuned, note } = req.body;
      await db.query(
        'INSERT INTO vehicles (name, model, image_url, class_id, follow_class, tuned, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, model, image_url, class_id, follow_class, tuned, note]
      );
      return res.status(201).json({ message: 'Vehículo creado' });
    }

    // PUT actualizar vehículo
    if (req.method === 'PUT') { const { id, name, model, image_url, class_id, follow_class, tuned, note } = req.body; await db.query( 'UPDATE vehicles SET name=?, model=?, image_url=?, class_id=?, follow_class=?, tuned=?, note=? WHERE id=?', [name, model, image_url, class_id, follow_class, tuned, note, id] ); return res.status(200).json({ message: 'Vehículo actualizado' }); }

    // DELETE vehículo
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await db.query('DELETE FROM vehicles WHERE id=?', [id]);
      return res.status(200).json({ message: 'Vehículo eliminado' });
    }

    res.status(405).json({ error: 'Método no permitido' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
});




