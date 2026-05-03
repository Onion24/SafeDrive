const API_BASE = "/api";

// Legge il token JWT dal localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Salva token e username dopo login/register
function salvaSessione(token, username) {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
}

// Cancella la sessione (logout)
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "/login.html";
}

// Fetch generica con token JWT automatico
async function apiFetch(endpoint, opzioni = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(opzioni.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const risposta = await fetch(API_BASE + endpoint, { ...opzioni, headers });
  const dati = await risposta.json();

  if (!risposta.ok) {
    throw new Error(dati.errore || "Errore nella richiesta");
  }

  return dati;
}

// --- Funzioni specifiche ---

async function getScenari(categoria = null) {
  const qs = categoria ? `?categoria=${categoria}` : "";
  return apiFetch(`/scenarios${qs}`);
}

async function getStats() {
  return apiFetch("/stats");
}

async function register(username, email, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

async function login(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function salvaPunteggio(punti, corrette, totale, categoria) {
  return apiFetch("/scenarios/salva-punteggio", {
    method: "POST",
    body: JSON.stringify({ punti, corrette, totale, categoria }),
  });
}

async function getClassifica() {
  return apiFetch("/users/classifica");
}
