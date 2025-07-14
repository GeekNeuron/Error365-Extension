document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    let errorDatabase = {};
    let currentLang = 'en';
    let currentTheme = 'light';
    let lastErrorCode = null;

    // 1. Load the error database
    fetch(chrome.runtime.getURL('errors.json'))
        .then(response => response.json())
        .then(data => {
            errorDatabase = data;
            initializePopup();
        })
        .catch(error => console.error("Error365: Could not load errors.json", error));

    // 2. Function to translate the static UI
    function translateUI(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = chrome.i18n.getMessage(el.getAttribute('data-i18n'));
        });
    }

    // 3. Function to apply the selected theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            document.body.classList.remove('dark-theme');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
        currentTheme = theme;
    }

    // 4. Main function to display error details
    function displayErrorDetails(errorCode, lang) {
        const titleEl = document.getElementById('error-title');
        const descriptionEl = document.getElementById('error-description');
        const solutionEl = document.getElementById('error-solution');
        const detailsEl = document.getElementById('solution-details');
        const errorCodeEl = document.getElementById('error-code');

        errorCodeEl.textContent = '';
        errorCodeEl.style.display = 'none';
        detailsEl.classList.add('hidden');

        const errorData = errorCode ? errorDatabase[errorCode] : null;

        if (errorData && errorData[lang]) {
            const localizedError = errorData[lang];
            titleEl.textContent = localizedError.title;
            descriptionEl.textContent = localizedError.description;
            errorCodeEl.textContent = errorCode;
            errorCodeEl.style.display = 'inline-block';

            if (localizedError.solution) {
                solutionEl.innerText = localizedError.solution;
                detailsEl.classList.remove('hidden');
            }
        } else {
            titleEl.textContent = chrome.i18n.getMessage('errorDetected');
            descriptionEl.textContent = chrome.i18n.getMessage('errorDescriptionDefault');
        }
    }
    
    // 5. Initialization function
    async function initializePopup() {
        const settings = await chrome.storage.sync.get(['selectedLanguage', 'selectedTheme']);
        
        currentLang = settings.selectedLanguage || 'en';
        languageSelect.value = currentLang;
        translateUI(currentLang);

        applyTheme(settings.selectedTheme || 'light');

        const errorResult = await chrome.storage.local.get(['lastErrorCode']);
        lastErrorCode = errorResult.lastErrorCode || null;
        if (lastErrorCode) {
            displayErrorDetails(lastErrorCode, currentLang);
            chrome.storage.local.remove('lastErrorCode');
        } else {
            displayErrorDetails(null, currentLang);
        }
    }

    // 6. Event Listeners
    languageSelect.addEventListener('change', (event) => {
        const newLang = event.target.value;
        chrome.storage.sync.set({ selectedLanguage: newLang });
        currentLang = newLang;
        translateUI(newLang);
        displayErrorDetails(lastErrorCode, currentLang);
    });

    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        chrome.storage.sync.set({ selectedTheme: newTheme });
        applyTheme(newTheme);
    });
});
