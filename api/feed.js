const Cors = require('cors');
const cheerio = require('cheerio');

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
    const response = await fetch('https://feed.familyrp.es/', {
      headers: {
        // simular navegador (MUY IMPORTANTE en algunas webs)
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      },
    });

    const html = await response.text();

    const $ = cheerio.load(html);

    const items = [];

    // 🔥 estrategia más flexible (no depende de clases exactas)
    $('div').each((i, el) => {
      const img = $(el).find('img').attr('src');

      const user =
        $(el).find('h1,h2,h3').first().text().trim();

      const title =
        $(el).find('p,span').first().text().trim();

      // filtro realista
      if (img && user && title && user.length < 40) {
        items.push({
          user,
          title,
          img,
        });
      }
    });

    // 🔥 eliminar duplicados (muy común en scraping)
    const unique = [];
    const seen = new Set();

    for (const item of items) {
      const key = item.user + item.title;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    return res.status(200).json(unique.slice(0, 50));

  } catch (err) {
    console.error('FEED ERROR:', err);
    return res.status(500).json({
      error: 'Error cargando feed',
    });
  }
};