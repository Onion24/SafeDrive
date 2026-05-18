// Dark Mode Toggle
(function () {
  const storageKey = 'safedrive-darkmode';

  function enableDarkMode() {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('darkModeToggle');
    if (btn) { btn.textContent = '☀️'; btn.title = 'Disattiva modalità scura'; }
    localStorage.setItem(storageKey, 'true');
  }

  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    const btn = document.getElementById('darkModeToggle');
    if (btn) { btn.textContent = '🌙'; btn.title = 'Attiva modalità scura'; }
    localStorage.setItem(storageKey, 'false');
  }

  // Aggiorna l'icona del bottone in base allo stato attuale
  function syncIcon() {
    const btn = document.getElementById('darkModeToggle');
    if (!btn) return;
    if (document.body.classList.contains('dark-mode')) {
      btn.textContent = '☀️';
      btn.title = 'Disattiva modalità scura';
    } else {
      btn.textContent = '🌙';
      btn.title = 'Attiva modalità scura';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Applica dark mode al body
    if (localStorage.getItem(storageKey) === 'true') {
      document.body.classList.add('dark-mode');
    }
    syncIcon();

    // Event delegation: il listener sta sul document, non sul bottone.
    // Funziona anche se il bottone viene ricreato con innerHTML.
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'darkModeToggle') {
        if (document.body.classList.contains('dark-mode')) {
          disableDarkMode();
        } else {
          enableDarkMode();
        }
      }
    });
  });

  // Chiamata dopo innerHTML per risincronizzare l'icona del nuovo bottone
  window.darkModeBindToggle = syncIcon;
})();