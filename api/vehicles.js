const db = require('../db');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM vehicles');
      return res.json(rows);
    }

    if (req.method === 'POST') {
      const { name, model, image_url, class_id } = req.body;
      await db.query(
        'INSERT INTO vehicles (name, model, image_url, class_id) VALUES (?, ?, ?, ?)',
        [name, model, image_url, class_id]
      );
      return res.status(201).json({ message: 'Vehículo creado' });
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error BD' });
  }
};
