const DOMANDE = [
  {
    domanda:
      "Qual è il limite di velocità su una strada extraurbana secondaria?",
    scelte: ["90 km/h", "110 km/h", "130 km/h", "100 km/h"],
    corretta: 0,
    spiegazione:
      "Sulle strade extraurbane secondarie il limite generale è 90 km/h, salvo diversa segnalazione.",
    articolo: "Art. 142 C.d.S.",
  },
  {
    domanda: "Il triangolo di emergenza va posizionato in autostrada a:",
    scelte: [
      "10 metri dal veicolo",
      "30 metri dal veicolo",
      "50 metri dal veicolo",
      "Dove si vuole",
    ],
    corretta: 2,
    spiegazione:
      "Il triangolo va posto a non meno di 50 metri dal veicolo fermo, in modo da avvertire gli altri conducenti in tempo utile.",
    articolo: "Art. 163 C.d.S.",
  },
  {
    domanda: "Cosa indica il segnale di stop?",
    scelte: [
      "Rallentare",
      "Fermarsi e dare precedenza",
      "Stare immobilizzati finché non arriva la polizia",
      "Fermarsi completamente e restare li per sempre",
    ],
    corretta: 1,
    spiegazione:
      "Lo stop obbliga a fermarsi completamente prima della linea di arresto, poi dare precedenza a chi circola sulla strada con diritto di precedenza.",
    articolo: "Art. 145 C.d.S.",
  },
  {
    domanda: "Una segnaletica orizzontale gialla indica:",
    scelte: [
      "Segnaletica temporanea in zona di lavori",
      "Zona scuola",
      "Parcheggio riservato",
      "Corsie preferenziali",
    ],
    corretta: 0,
    spiegazione:
      "La segnaletica orizzontale gialla è temporanea, usata in caso di lavori stradali, e prevale su quella bianca permanente.",
    articolo: "Art. 40 C.d.S.",
  },
  {
    domanda: "Puoi parcheggiare sulle strisce pedonali?",
    scelte: [
      "Sì, di notte",
      "Sì, per meno di 5 minuti",
      "No, mai",
      "Sì, si hai un cappello",
    ],
    corretta: 2,
    spiegazione:
      "Il parcheggio sulle strisce pedonali è sempre e assolutamente vietato, in qualsiasi orario e condizione.",
    articolo: "Art. 158 C.d.S.",
  },
  {
    domanda: "Quando si deve accendere il lampeggiatore destro?",
    scelte: [
      "Solo in autostrada",
      "Prima di ogni manovra a destra",
      "Prima di svoltare a destra o fermarsi sul lato destro",
      "Solo di notte",
    ],
    corretta: 2,
    spiegazione:
      "Il lampeggiatore destro va acceso prima di svoltare a destra, immettersi a destra o fermarsi sul lato destro della carreggiata. Per il sorpasso si usa invece il sinistro.",
    articolo: "Art. 154 C.d.S.",
  },
  {
    domanda: "Qual è la velocità massima in autostrada con pioggia?",
    scelte: ["130 km/h", "110 km/h", "90 km/h", "100 km/h"],
    corretta: 1,
    spiegazione:
      "Con pioggia, neve o grandine il limite in autostrada scende da 130 a 110 km/h. Con neve o ghiaccio scende ulteriormente a 50 km/h.",
    articolo: "Art. 142 C.d.S.",
  },
  {
    domanda: "Cosa si deve fare in caso di incidente con feriti?",
    scelte: [
      "Scappare",
      "Aspettare che arrivino altri",
      "Prestare soccorso e chiamare il 118",
      "Avviare la live su TikTok",
    ],
    corretta: 2,
    spiegazione:
      "Chi causa o è coinvolto in un incidente con feriti ha l'obbligo di prestare soccorso e chiamare il 118. Fuggire o omettere il soccorso è un reato penale.",
    articolo: "Art. 189 C.d.S.",
  },
  {
    domanda: "I bambini fino a 150 cm devono obbligatoriamente usare:",
    scelte: [
      "La cintura normale è sufficiente",
      "Un seggiolino omologato adatto alla loro taglia",
      "Solo il sedile posteriore senza altri dispositivi",
      "Nessun dispositivo speciale se hanno più di 6 anni",
    ],
    corretta: 1,
    spiegazione:
      "I bambini di altezza inferiore a 150 cm devono usare un seggiolino o rialzo omologato adatto al loro peso e altezza. La sola cintura non è sufficiente.",
    articolo: "Art. 172 C.d.S.",
  },
  {
    domanda:
      "Quante ore di guida consecutive sono consentite per un guidatore professionale?",
    scelte: ["4 ore e mezza", "6 ore", "8 ore", "10 ore"],
    corretta: 0,
    spiegazione:
      "Il regolamento europeo stabilisce un massimo di 4 ore e mezza di guida consecutiva, dopo le quali è obbligatoria una pausa di almeno 45 minuti (che può essere suddivisa in 15 + 30 minuti).",
    articolo: "Reg. CE 561/2006",
  },
];

// Stato del quiz
let domande = [];
let indice = 0;
let punteggio = 0;
let corrette = 0;
let timer = null;
let secondi = 20;
let rispostaData = false;
let storicoRisposte = [];

function mostraSchermata(id) {
  ["schermataInizio", "schermataQuiz", "schermataRisultatoQuiz"].forEach(
    (s) => {
      document.getElementById(s).classList.add("hidden");
    },
  );
  document.getElementById(id).classList.remove("hidden");
}

function aggiornaDots() {
  const container = document.getElementById("quizDots");
  container.innerHTML = domande
    .map((_, i) => {
      let cls = "dot";
      if (i < indice) {
        cls += storicoRisposte[i] ? " done" : " wrong-dot";
      } else if (i === indice) {
        cls += " current";
      }
      return `<div class="${cls}"></div>`;
    })
    .join("");
}

function avviaTimer() {
  secondi = 20;
  rispostaData = false;
  clearInterval(timer);

  const fill = document.getElementById("quizTimerFill");
  const label = document.getElementById("quizTimerLabel");

  timer = setInterval(() => {
    secondi--;
    label.textContent = secondi;
    fill.style.width = (secondi / 20) * 100 + "%";
    fill.style.background = secondi > 8 ? "#EF9F27" : "#E24B4A";

    if (secondi <= 0) {
      clearInterval(timer);
      if (!rispostaData) gestisciRisposta(null);
    }
  }, 1000);
}

function caricaDomanda(idx) {
  const d = domande[idx];

  document.getElementById("quizProgressText").textContent =
    `Domanda ${idx + 1} di ${domande.length}`;
  document.getElementById("quizScore").textContent = punteggio + " pt";
  document.getElementById("quizProgressFill").style.width =
    (idx / domande.length) * 100 + "%";
  document.getElementById("quizDomanda").textContent = d.domanda;

  document.getElementById("quizFeedback").classList.add("hidden");
  document.getElementById("btnQuizProssimo").classList.add("hidden");

  document.getElementById("qsCorrette").textContent = corrette;
  document.getElementById("qsErrate").textContent = idx - corrette;
  document.getElementById("qsPunti").textContent = punteggio;

  const scelte = document.getElementById("quizScelte");
  scelte.innerHTML = d.scelte
    .map(
      (s, i) => `
    <button class="choice-btn" onclick="gestisciRisposta(${i})">
      <span class="choice-letter">${String.fromCharCode(65 + i)}.</span> ${s}
    </button>
  `,
    )
    .join("");

  aggiornaDots();
  avviaTimer();
}

function gestisciRisposta(idxScelto) {
  if (rispostaData) return;
  rispostaData = true;
  clearInterval(timer);

  const d = domande[indice];
  const eCorretta = idxScelto === d.corretta;

  storicoRisposte.push(eCorretta);

  if (eCorretta) {
    punteggio += Math.max(10, secondi);
    corrette++;
  }

  document.querySelectorAll(".choice-btn").forEach((btn, i) => {
    if (i === d.corretta) btn.classList.add("correct");
    else if (i === idxScelto && !eCorretta) btn.classList.add("wrong");
    btn.disabled = true;
  });

  const feedback = document.getElementById("quizFeedback");
  feedback.classList.remove("hidden");
  feedback.className =
    "sim-feedback " + (eCorretta ? "feedback-ok" : "feedback-no");
  document.getElementById("quizFeedbackTitle").textContent = eCorretta
    ? "✓ Esatto!"
    : `✗ Sbagliato — la risposta era: ${d.scelte[d.corretta]}`;
  document.getElementById("quizFeedbackSpieg").textContent = d.spiegazione;
  document.getElementById("quizFeedbackArt").textContent = d.articolo;

  document.getElementById("quizScore").textContent = punteggio + " pt";
  document.getElementById("qsCorrette").textContent = corrette;
  document.getElementById("qsErrate").textContent = indice + 1 - corrette;
  document.getElementById("qsPunti").textContent = punteggio;

  document.getElementById("btnQuizProssimo").classList.remove("hidden");
  aggiornaDots();
}

function mostraRisultato() {
  mostraSchermata("schermataRisultatoQuiz");
  const perc = Math.round((corrette / domande.length) * 100);

  document.getElementById("qrPunti").textContent = punteggio;
  document.getElementById("qrCorrette").textContent =
    `${corrette}/${domande.length}`;
  document.getElementById("qrPerc").textContent = perc + "%";

  let emoji, titolo, msg;
  if (perc >= 90) {
    emoji = "🏆";
    titolo = "Patente garantita!";
    msg =
      "Risultato eccellente. Conosci il Codice della Strada alla perfezione.";
  } else if (perc >= 70) {
    emoji = "👍";
    titolo = "Buon risultato!";
    msg = "Promosso! Qualche lacuna da colmare ma sei sulla strada giusta.";
  } else if (perc >= 50) {
    emoji = "📖";
    titolo = "Quasi sufficiente";
    msg = "Hai bisogno di ripassare. Riprova dopo aver riletto le spiegazioni.";
  } else {
    emoji = "🔄";
    titolo = "Da rivedere";
    msg =
      "Ti consigliamo di studiare il Codice della Strada prima di riprovare.";
  }

  document.getElementById("quizEmoji").textContent = emoji;
  document.getElementById("quizTitolo").textContent = titolo;
  document.getElementById("quizMessaggio").textContent = msg;

  const riepilogo = document.getElementById("riepilogoRisposte");
  riepilogo.innerHTML =
    '<h3 style="font-size:15px; margin-bottom:12px;">Riepilogo risposte</h3>' +
    domande
      .map(
        (d, i) => `
      <div class="riepilogo-item ${storicoRisposte[i] ? "ok" : "ko"}">
        <span class="riepilogo-icona">${storicoRisposte[i] ? "✓" : "✗"}</span>
        <div>
          <p class="riepilogo-domanda">${d.domanda}</p>
          ${!storicoRisposte[i] ? `<p class="riepilogo-risposta">Risposta corretta: ${d.scelte[d.corretta]}</p>` : ""}
        </div>
      </div>
    `,
      )
      .join("");

  if (localStorage.getItem("token")) {
    salvaPunteggio(punteggio, corrette, domande.length, "quiz").catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnIniziaQuiz").addEventListener("click", () => {
    domande = [...DOMANDE].sort(() => Math.random() - 0.5);
    indice = 0;
    punteggio = 0;
    corrette = 0;
    storicoRisposte = [];
    mostraSchermata("schermataQuiz");
    caricaDomanda(0);
  });

  document.getElementById("btnQuizProssimo").addEventListener("click", () => {
    indice++;
    if (indice >= domande.length) {
      mostraRisultato();
    } else {
      caricaDomanda(indice);
    }
  });

  document.getElementById("btnQuizRiprova").addEventListener("click", () => {
    mostraSchermata("schermataInizio");
  });
});
