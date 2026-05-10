const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

function leggiScenari() {
  const filePath = path.join(__dirname, '../data/scenarios.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// GET /api/scenarios
// GET /api/scenarios?categoria=velocita

// Per utilizzare questo: GET http://TUO-IP:3000/api/scenarios per ottenere tutti gli scenari, oppure GET http://TUO-IP:3000/api/scenarios?categoria=velocita per filtrare per categoria "velocità". Se vuoi ottenere i dati in formato XML, puoi fare GET http://TUO-IP:3000/api/scenarios?format=xml
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

// GET /api/scenarios/:id
router.get('/:id', (req, res) => {
  const scenari = leggiScenari();
  const scenario = scenari.find(s => s.id === parseInt(req.params.id));

  if (!scenario) {
    return res.status(404).json({ errore: 'Scenario non trovato' });
  }

  res.json(scenario);
});

// POST /api/scenarios/salva-punteggio  (protetta da JWT)
router.post('/salva-punteggio', authMiddleware, (req, res) => {
  const { punti, corrette, totale, categoria } = req.body;

  db.prepare(
    'INSERT INTO scores (user_id, punti, corrette, totale, categoria) VALUES (?, ?, ?, ?, ?)'
  ).run(req.utente.id, punti, corrette, totale, categoria || null);

  res.json({ messaggio: 'Punteggio salvato', punti });
});

module.exports = router;
