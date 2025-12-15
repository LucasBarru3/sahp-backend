const db = require('../db');

exports.getAll = async (req, res) => {
  const [rows] = await db.query(`
    SELECT v.*, c.name AS class
    FROM vehicles v
    JOIN classes c ON v.class_id = c.id
  `);
  res.json(rows);
};

exports.getByClass = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    'SELECT * FROM vehicles WHERE class_id=?',
    [id]
  );
  res.json(rows);
};

exports.create = async (req, res) => {
  const { name, model, image_url, class_id } = req.body;
  await db.query(
    'INSERT INTO vehicles (name, model, image_url, class_id) VALUES (?, ?, ?, ?)',
    [name, model, image_url, class_id]
  );
  res.status(201).json({ message: 'Vehículo creado' });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, model, image_url, class_id } = req.body;
  await db.query(
    'UPDATE vehicles SET name=?, model=?, image_url=?, class_id=? WHERE id=?',
    [name, model, image_url, class_id, id]
  );
  res.json({ message: 'Vehículo actualizado' });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM vehicles WHERE id=?', [id]);
  res.json({ message: 'Vehículo eliminado' });
};
