const jwt = require('jsonwebtoken');

function verifyToken(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('No token');
  }

  const token = authHeader.split(' ')[1];

  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'sahp_gang_key'
  );
}

module.exports = { verifyToken };
