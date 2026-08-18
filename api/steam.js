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
    return res.status(405).json({
      error: 'Método no permitido'
    });
  }

  try {

    const steamId = req.query.steamid;

    if (!steamId) {
      return res.status(400).json({
        error: 'SteamID no proporcionado'
      });
    }

    const steamKey = process.env.STEAM_API_KEY;

    if (!steamKey) {
      return res.status(500).json({
        error: 'STEAM_API_KEY no configurada'
      });
    }

    const summaryUrl =
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/` +
      `?key=${steamKey}` +
      `&steamids=${steamId}`;

    const gamesUrl =
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/` +
      `?key=${steamKey}` +
      `&steamid=${steamId}`;

    const [summaryResponse, gamesResponse] = await Promise.all([
      fetch(summaryUrl),
      fetch(gamesUrl)
    ]);

    const summaryData = await summaryResponse.json();
    const gamesData = await gamesResponse.json();

    const player = summaryData?.response?.players?.[0];

    if (!player) {
      return res.status(404).json({
        error: 'SteamID no encontrado'
      });
    }

    const recentGames = gamesData?.response?.games || [];

    return res.status(200).json({
      success: true,

      player: {
        steamId: player.steamid,
        name: player.personaname,
        avatar: player.avatarfull,
        profile: player.profileurl,
        state: player.personastate,
        playing: player.gameextrainfo || null,

        lastGame: recentGames.length
          ? recentGames[0].name
          : null,

        lastGameId: recentGames.length
          ? recentGames[0].appid
          : null,

        playtimeMinutes: recentGames.length
          ? recentGames[0].playtime_forever
          : 0
      }
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: 'Error consultando Steam'
    });
  }
};