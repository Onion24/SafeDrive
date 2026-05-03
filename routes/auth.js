const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const SECRET = process.env.JWT_SECRET || 'safedrive_secret_key_2024';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const email = req.body.email.toLowerCase();

  if (!username || !email || !password) {
    return res.status(400).json({ errore: 'Tutti i campi sono obbligatori' });
  }

  try {
    const hash = await bcrypt.hash(password, 10); // fa l'hashing 10 volte della password

    const stmt = db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)' //i ? fanno da segnaposto per i veri dati cosi da prevenire sql injection
    );
    const result = stmt.run(username, email, hash);

    const token = jwt.sign(
      { id: result.lastInsertRowid, username },
      SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ messaggio: 'Registrazione avvenuta', token, username });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ errore: 'Username o email già in uso' });
    }
    res.status(500).json({ errore: 'Errore del server' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const {password } = req.body;
  const email = req.body.email.toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ errore: 'Email e password obbligatorie' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return res.status(401).json({ errore: 'Credenziali non valide' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ errore: 'Credenziali non valide' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: '7d' }
  );

  res.json({ messaggio: 'Login effettuato', token, username: user.username });
});

module.exports = router;