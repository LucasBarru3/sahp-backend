const Cors = require('cors');
const cheerio = require('cheerio');

// CORS
const cors = Cors({
  origin: '*',
  methods: ['GET'],
});

// helper
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
    // 🔥 fetch nativo (no node-fetch)
    const response = await fetch('https://feed.familyrp.es/');
    const html = await response.text();

    const $ = cheerio.load(html);

    const items = [];

    // pillamos cada bloque
    $('.flex.h-fit.py-1').each((i, el) => {
      const img = $(el).find('img').first().attr('src');
      const user = $(el).find('h2').first().text().trim();
      const title = $(el).find('p').first().text().trim();

      if (user) {
        items.push({
          user,
          title,
          img
        });
      }
    });

    return res.status(200).json(items);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error cargando feed' });
  }
};