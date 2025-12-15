const db = require('../db');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const [rows] = await db.query('SELECT * FROM classes');
      return res.json(rows);
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
