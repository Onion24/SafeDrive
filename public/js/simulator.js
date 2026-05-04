let scenari = [];
let indiceCorrente = 0;
let punteggio = 0;
let corrette = 0;
let timer = null;
let secondiRimasti = 30;
let rispostaData = false;

const canvas = document.getElementById("simCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

// Disegna una scena generica sulla canvas in base al tipo di scenario
function disegnaScena(tipo) {
  const img = new Image();
  img.src = `/img/${tipo}.png`;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  // Sfondo di fallback mentre l'immagine carica
  img.onerror = () => {
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
}

function mostraSchermata(id) {
  ["schermataInizio", "schermataSimulatore", "schermataRisultato"].forEach(
    (s) => {
      document.getElementById(s).classList.add("hidden");
    },
  );
  document.getElementById(id).classList.remove("hidden");
}

function aggiornaDots() {
  const container = document.getElementById("progressDots");
  container.innerHTML = scenari
    .map((_, i) => {
      let cls = "dot";
      if (i < indiceCorrente) cls += " done";
      else if (i === indiceCorrente) cls += " current";
      return `<div class="${cls}"></div>`;
    })
    .join("");
}

function avviaTimer() {
  secondiRimasti = 30;
  rispostaData = false;
  const fill = document.getElementById("timerFill");
  const label = document.getElementById("timerLabel");

  clearInterval(timer);
  label.textContent = secondiRimasti;
  fill.style.width = "100%";
  timer = setInterval(() => {
    secondiRimasti--;
    label.textContent = secondiRimasti;
    fill.style.width = (secondiRimasti / 30) * 100 + "%";
    if (fill.style.width)
      fill.style.background = secondiRimasti > 4 ? "#EF9F27" : "#E24B4A";

    if (secondiRimasti <= 0) {
      clearInterval(timer);
      if (!rispostaData) gestisciRisposta(null);
    }
  }, 1000);
}

function caricaScenario(idx) {
  const s = scenari[idx];
  document.getElementById("simProgressText").textContent =
    `Scenario ${idx + 1} di ${scenari.length}`;
  document.getElementById("simScore").textContent = punteggio + " pt";
  document.getElementById("simCondizioni").textContent = s.condizioni;
  document.getElementById("simDescrizione").textContent = s.descrizione;
  document.getElementById("simProgressFill").style.width =
    (idx / scenari.length) * 100 + "%";

  disegnaScena(s.immagine);

  const choicesEl = document.getElementById("simChoices");
  choicesEl.innerHTML = s.scelte
    .map(
      (sc) => `
    <button class="choice-btn" onclick="gestisciRisposta('${sc.id}')">
      <span class="choice-letter">${sc.id}.</span> ${sc.testo}
    </button>
  `,
    )
    .join("");

  document.getElementById("simFeedback").classList.add("hidden");
  document.getElementById("btnProssimo").classList.add("hidden");

  aggiornaDots();
  avviaTimer();
}

function gestisciRisposta(idScelto) {
  if (rispostaData) return;
  rispostaData = true;
  clearInterval(timer);

  const s = scenari[indiceCorrente];
  const corretta = s.corretta;
  const eCorretta = idScelto === corretta;

  if (eCorretta) {
    const bonus = Math.round((secondiRimasti / 30) * 50);
    punteggio += 50 + bonus;
    corrette++;
  }

  // Colora i bottoni
  document.querySelectorAll(".choice-btn").forEach((btn) => {
    const lettera = btn
      .querySelector(".choice-letter")
      .textContent.replace(".", "")
      .trim();
    if (lettera === corretta) btn.classList.add("correct");
    else if (lettera === idScelto && !eCorretta) btn.classList.add("wrong");
    btn.disabled = true;
  });

  // Mostra feedback
  const feedback = document.getElementById("simFeedback");
  feedback.classList.remove("hidden");
  feedback.className =
    "sim-feedback " + (eCorretta ? "feedback-ok" : "feedback-no");
  document.getElementById("feedbackTitle").textContent = eCorretta
    ? "✓ Risposta corretta!"
    : "✗ Risposta errata — quella giusta era " + corretta;
  document.getElementById("feedbackSpiegazione").textContent = s.spiegazione;
  document.getElementById("feedbackStat").textContent = s.statistica;
  document.getElementById("feedbackArticolo").textContent = s.articolo;

  document.getElementById("simScore").textContent = punteggio + " pt";
  document.getElementById("btnProssimo").classList.remove("hidden");
}

function prossimo() {
  indiceCorrente++;
  if (indiceCorrente >= scenari.length) {
    mostraRisultato();
  } else {
    caricaScenario(indiceCorrente);
  }
}

function mostraRisultato() {
  mostraSchermata("schermataRisultato");
  const perc = Math.round((corrette / scenari.length) * 100);

  document.getElementById("rPunti").textContent = punteggio;
  document.getElementById("rCorrette").textContent =
    `${corrette}/${scenari.length}`;
  document.getElementById("rPerc").textContent = perc + "%";

  let emoji, titolo, msg;
  if (perc >= 80) {
    emoji = "🏆";
    titolo = "Ottimo risultato!";
    msg =
      "Hai dimostrato una buona conoscenza del Codice della Strada. Continua così!";
  } else if (perc >= 60) {
    emoji = "👍";
    titolo = "Buon lavoro!";
    msg =
      "Conosci le basi, ma c'è ancora qualcosa da ripassare. Riprova per migliorare.";
  } else {
    emoji = "📖";
    titolo = "Da rivedere";
    msg =
      "Ti consigliamo di ripassare il Codice della Strada e riprovare il simulatore.";
  }

  document.getElementById("risultatoEmoji").textContent = emoji;
  document.getElementById("risultatoTitolo").textContent = titolo;
  document.getElementById("risultatoMessaggio").textContent = msg;

  // Salva punteggio se loggato
  if (localStorage.getItem("token")) {
    salvaPunteggio(punteggio, corrette, scenari.length, "simulatore").catch(
      () => {},
    );
  }
}

function riprova() {
  indiceCorrente = 0;
  punteggio = 0;
  corrette = 0;
  mostraSchermata("schermataInizio");
}

// Event listeners
document
  .getElementById("btnIniziaSimulatore")
  .addEventListener("click", async () => {
    try {
      scenari = await getScenari();
      // Mescola gli scenari
      scenari = scenari.sort(() => Math.random() - 0.5).slice(0, 5);
      indiceCorrente = 0;
      punteggio = 0;
      corrette = 0;
      mostraSchermata("schermataSimulatore");
      caricaScenario(0);
    } catch (e) {
      alert("Errore nel caricamento degli scenari. Riprova.");
    }
  });

document.getElementById("btnProssimo").addEventListener("click", prossimo);
document.getElementById("btnRiprova").addEventListener("click", riprova);
