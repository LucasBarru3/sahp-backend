const db = require('../db');

exports.getAll = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM classes');
  res.json(rows);
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  await db.query(
    'INSERT INTO classes (name, description) VALUES (?, ?)',
    [name, description]
  );
  res.status(201).json({ message: 'Clase creada' });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  await db.query(
    'UPDATE classes SET name=?, description=? WHERE id=?',
    [name, description, id]
  );
  res.json({ message: 'Clase actualizada' });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM classes WHERE id=?', [id]);
  res.json({ message: 'Clase eliminada' });
};
