// Dark Mode Toggle
(function () {
  const storageKey = 'safedrive-darkmode';

  function initDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (!body || !darkModeToggle) return;

    const isDarkMode = localStorage.getItem(storageKey) === 'true';
    if (isDarkMode) {
      enableDarkMode(body, darkModeToggle);
    } else {
      disableDarkMode(body, darkModeToggle);
    }
  }

  function enableDarkMode(body, darkModeToggle) {
    body.classList.add('dark-mode');
    if (darkModeToggle) {
      darkModeToggle.textContent = '☀️';
      darkModeToggle.title = 'Disattiva modalità scura';
    }
    localStorage.setItem(storageKey, 'true');
  }

  function disableDarkMode(body, darkModeToggle) {
    body.classList.remove('dark-mode');
    if (darkModeToggle) {
      darkModeToggle.textContent = '🌙';
      darkModeToggle.title = 'Attiva modalità scura';
    }
    localStorage.setItem(storageKey, 'false');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initDarkMode();
      
      const darkModeToggle = document.getElementById('darkModeToggle');
      const body = document.body;
      
      if (darkModeToggle && body) {
        darkModeToggle.addEventListener('click', function () {
          if (body.classList.contains('dark-mode')) {
            disableDarkMode(body, darkModeToggle);
          } else {
            enableDarkMode(body, darkModeToggle);
          }
        });
      }
    });
  } else {
    // DOM is already ready
    initDarkMode();
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    if (darkModeToggle && body) {
      darkModeToggle.addEventListener('click', function () {
        if (body.classList.contains('dark-mode')) {
          disableDarkMode(body, darkModeToggle);
        } else {
          enableDarkMode(body, darkModeToggle);
        }
      });
    }
  }
})();
