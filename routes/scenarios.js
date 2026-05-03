const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');

function leggiScenari() {
  const filePath = path.join(__dirname, '../data/scenarios.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function scenariToXml(scenari) {
  const righe = scenari.map(s => `
  <scenario>
    <id>${s.id}</id>
    <titolo>${s.titolo}</titolo>
    <condizioni>${s.condizioni}</condizioni>
    <descrizione>${s.descrizione}</descrizione>
    <categoria>${s.categoria}</categoria>
    <scelte>
      ${s.scelte.map(sc => `<scelta id="${sc.id}">${sc.testo}</scelta>`).join('\n      ')}
    </scelte>
    <corretta>${s.corretta}</corretta>
    <spiegazione>${s.spiegazione}</spiegazione>
    <articolo>${s.articolo}</articolo>
    <statistica>${s.statistica}</statistica>
  </scenario>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<scenari>${righe}\n</scenari>`;
}

// GET /api/scenarios  (pubblica)
// GET /api/scenarios?format=xml
// GET /api/scenarios?categoria=velocita
router.get('/', (req, res) => {
  let scenari = leggiScenari();

  if (req.query.categoria) {
    scenari = scenari.filter(s => s.categoria === req.query.categoria);
  }

  if (req.query.format === 'xml') {
    res.set('Content-Type', 'application/xml');
    return res.send(scenariToXml(scenari));
  }

  res.json(scenari);
});

// GET /api/scenarios/:id  (pubblica)
router.get('/:id', (req, res) => {
  const scenari = leggiScenari();
  const scenario = scenari.find(s => s.id === parseInt(req.params.id));

  if (!scenario) {
    return res.status(404).json({ errore: 'Scenario non trovato' });
  }

  res.json(scenario);
});

// POST /api/scenarios/salva-punteggio  (protetta da JWT) (controlla che l'utente sia loggato prima di salvare)
router.post('/salva-punteggio', authMiddleware, (req, res) => {
  const { punti, corrette, totale, categoria } = req.body;
  const db = require('../db/database');

  const stmt = db.prepare(
    'INSERT INTO scores (user_id, punti, corrette, totale, categoria) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(req.utente.id, punti, corrette, totale, categoria || null);

  res.json({ messaggio: 'Punteggio salvato', punti });
});

module.exports = router;