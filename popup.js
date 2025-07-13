document.addEventListener('DOMContentLoaded', () => {
  const languageSelect = document.getElementById('language-select');

  // Function to translate the static UI elements
  function translateUI(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = chrome.i18n.getMessage(key);
      }
    });
  }

  // Function to load the last detected error and display it
  function loadAndDisplayError() {
    const titleEl = document.getElementById('error-title');
    const descriptionEl = document.getElementById('error-description');
    const solutionEl = document.getElementById('error-solution');
    const detailsEl = document.getElementById('solution-details');

    // Reset to default state first
    const defaultTitleKey = titleEl.getAttribute('data-i18n-default');
    const defaultDescKey = descriptionEl.getAttribute('data-i18n-default');
    titleEl.textContent = chrome.i18n.getMessage(defaultTitleKey);
    descriptionEl.textContent = chrome.i18n.getMessage(defaultDescKey);
    detailsEl.classList.add('hidden');

    chrome.storage.local.get(['lastError'], (result) => {
      if (result.lastError) {
        titleEl.textContent = result.lastError.title;
        descriptionEl.textContent = result.lastError.description;
        
        // Only show solution section if solution is not null
        if (result.lastError.solution) { 
          solutionEl.innerText = result.lastError.solution;
          detailsEl.classList.remove('hidden');
        }
        
        // Clear the error after displaying it
        chrome.storage.local.remove('lastError');
      }
    });
  }

  // Load saved language and apply it
  chrome.storage.sync.get(['selectedLanguage'], (result) => {
    const lang = result.selectedLanguage || 'en'; // Default to English
    languageSelect.value = lang;
    translateUI(lang);
    loadAndDisplayError();
  });

  // Save language preference when changed
  languageSelect.addEventListener('change', (event) => {
    const newLang = event.target.value;
    chrome.storage.sync.set({ selectedLanguage: newLang }, () => {
      translateUI(newLang);
    });
  });

  // Event listener for the "View All Errors" button
  const viewAllBtn = document.getElementById('view-all-btn');
  viewAllBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('all_errors.html') });
  });
});
