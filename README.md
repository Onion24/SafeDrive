# 🚗 SafeDrive

Progetto di fine anno per TDP — web app per imparare a guidare in sicurezza prima di sedersi al volante.

**Autori:** Adam Izem, Roberto Agnetti e Maria Zeko

---

## Cosa fa

- **Simulatore di guida** — scenari reali con immagini (autostrada, incrocio, curva, zona residenziale). Ogni scenario presenta una situazione e chiede la scelta giusta, con spiegazione e riferimento al Codice della Strada
- **Quiz** — domande a risposta multipla con timer, punteggio e riepilogo finale
- **Statistiche** — dati ISTAT 2023 sugli incidenti in Italia + andamento storico in tempo reale dalla World Bank API
- **Classifica** — top 10 utenti per punteggio totale
- **Auth** — registrazione e login con JWT, password hashata con bcrypt

---

## Struttura

```
SafeDrive/
├── server.js              # Entry point
├── db/
│   └── database.js        # Connessione SQLite e creazione tabelle
├── middleware/
│   └── auth.js            # Verifica token JWT
├── routes/
│   ├── auth.js            # POST /api/auth/register, /login
│   ├── scenarios.js       # GET /api/scenarios, POST /api/scenarios/salva-punteggio
│   ├── stats.js           # GET /api/stats, /cause, /ore
│   └── users.js           # GET /api/users/classifica
├── data/
│   └── scenarios.json     # Scenari del simulatore
└── public/
    ├── index.html         # Home con statistiche e classifica
    ├── simulator.html     # Simulatore di guida
    ├── quiz.html          # Quiz Codice della Strada
    ├── login.html         # Login e registrazione
    ├── css/style.css
    └── js/
        ├── api.js         # Wrapper fetch con JWT automatico
        ├── simulator.js   # Logica simulatore
        └── quiz.js        # Logica quiz
```

---

## Avvio

```bash
npm install
node server.js
```

L'app gira su `http://localhost:3000`.


```
