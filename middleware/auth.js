const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'safedrive_secret_key_2024'; //se loggato utilizza il segreto associato altrimenti usa quello default

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ errore: 'Token mancante' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.utente = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ errore: 'Token non valido o scaduto' });
  }
}

module.exports = authMiddleware;