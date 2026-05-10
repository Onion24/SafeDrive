const express = require('express');
const router = express.Router();

// Dati locali ISTAT come fallback se l'API esterna non risponde
const DATI_FALLBACK = {
  anno: 2023,
  fonte: "ISTAT - Incidenti stradali in Italia",
  totale_incidenti: 165889,
  feriti: 221216,
  morti: 3039,
  cause: [
    { causa: "Distrazione", percentuale: 78 },
    { causa: "Velocità elevata", percentuale: 61 },
    { causa: "Mancata precedenza", percentuale: 44 },
    { causa: "Alcol e droghe", percentuale: 29 },
    { causa: "Sorpasso vietato", percentuale: 12 }
  ],
  ore_rischio: [
    { ora: "18:00-20:00", incidenti: 22 },
    { ora: "08:00-10:00", incidenti: 18 },
    { ora: "20:00-22:00", incidenti: 16 },
    { ora: "12:00-14:00", incidenti: 14 },
    { ora: "Altre ore", incidenti: 30 }
  ],
  fascia_eta: [
    { fascia: "18-24", percentuale: 15 },
    { fascia: "25-34", percentuale: 21 },
    { fascia: "35-44", percentuale: 19 },
    { fascia: "45-54", percentuale: 18 },
    { fascia: "55+", percentuale: 27 }
  ]
};

// Chiama la World Bank per i morti stradali in Italia ogni 100.000 abitanti
async function fetchDatiWorldBank() {
  const url = 'https://api.worldbank.org/v2/country/IT/indicator/SH.STA.TRAF.P5?format=json&mrv=5';
  const risposta = await fetch(url);

  if (!risposta.ok) throw new Error('API World Bank non disponibile');

  const json = await risposta.json();
  const dati = json[1];

  if (!dati || dati.length === 0) throw new Error('Nessun dato ricevuto');

  return dati
    .filter(d => d.value !== null)
    .map(d => ({
      anno: d.date,
      morti_per_100k: Math.round(d.value * 10) / 10,
      paese: d.country.value
    }));
}

// GET /api/stats
// Restituisce dati locali ISTAT + dati World Bank (con fallback se offline)
router.get('/', async (req, res) => {
  try {
    const andamento_mondiale = await fetchDatiWorldBank();
    res.json({
      ...DATI_FALLBACK,
      andamento_mondiale,
      fonte_esterna: 'World Bank Open Data - SH.STA.TRAF.P5',
      url_fonte: 'https://data.worldbank.org/indicator/SH.STA.TRAF.P5?locations=IT'
    });
  } catch (err) {
    console.error('API esterna non raggiungibile, uso dati locali:', err.message);
    res.json({ ...DATI_FALLBACK, avviso: 'Dati esterni non disponibili, visualizzati dati locali' });
  }
});

// GET /api/stats/cause
router.get('/cause', (req, res) => {
  res.json(DATI_FALLBACK.cause);
});

// GET /api/stats/ore
router.get('/ore', (req, res) => {
  res.json(DATI_FALLBACK.ore_rischio);
});

module.exports = router;
