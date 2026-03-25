const Cors = require('cors');

const cors = Cors({
  origin: '*',
  methods: ['GET'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

module.exports = async (req, res) => {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const response = await fetch('https://feed.familyrp.es/api/newsfeed');
    const data = await response.json();

    // 🔥 devolvemos directamente lo que necesitas
    return res.status(200).json({
      streams: data.streams,
      images: data.images,
      events: data.events
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error cargando feed' });
  }
};