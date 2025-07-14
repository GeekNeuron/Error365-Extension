document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Element references
    const appTitleEl = document.getElementById('app-title');
    const errorTitleEl = document.getElementById('error-title');
    const descriptionEl = document.getElementById('error-description');
    const solutionTitleEl = document.querySelector('#solution-details summary');
    const solutionEl = document.getElementById('error-solution');
    const detailsEl = document.getElementById('solution-details');
    const errorCodeEl = document.getElementById('error-code');

    let errorDatabase = {};
    let translations = {};
    let currentLang = 'en'; // Default base language
    let currentTheme = 'light';
    let lastErrorCode = null;

    // 1. Load both error and language JSON files
    async function loadData() {
        try {
            const errorResponse = await fetch('errors.json');
            errorDatabase = await errorResponse.json();
            
            await loadLanguage(currentLang);
        } catch (error) {
            console.error("Error365: Could not load initial data", error);
        }
    }

    // 2. Function to fetch and set the language file
    async function loadLanguage(lang) {
        try {
            const langResponse = await fetch(`lang/${lang}.json`);
            translations = await langResponse.json();
            currentLang = lang;
        } catch (error) {
            console.error(`Error365: Could not load language file for ${lang}`, error);
            // Fallback to English if the language file fails
            if (currentLang !== 'en') {
                await loadLanguage('en');
            }
        }
    }

    // 3. Function to apply translations to the UI
    function translateUI() {
        document.documentElement.lang = currentLang;
        document.documentElement.dir = (currentLang === 'fa') ? 'rtl' : 'ltr';

        appTitleEl.textContent = translations.appName || 'Error365';
        solutionTitleEl.textContent = translations.solutionTitle || 'Suggested Solution';
    }

    // 4. Function to apply the selected theme
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

    // 5. Main function to display error details
    function displayErrorDetails(errorCode) {
        errorCodeEl.textContent = '';
        errorCodeEl.style.display = 'none';
        detailsEl.classList.add('hidden');

        const errorData = errorCode ? errorDatabase[errorCode] : null;
        const localizedError = errorData ? (errorData[currentLang] || errorData['en']) : null;

        if (localizedError) {
            errorTitleEl.textContent = localizedError.title;
            descriptionEl.textContent = localizedError.description;
            errorCodeEl.textContent = errorCode;
            errorCodeEl.style.display = 'inline-block';

            if (localizedError.solution) {
                solutionEl.innerText = localizedError.solution;
                detailsEl.classList.remove('hidden');
            }
        } else {
            errorTitleEl.textContent = translations.errorDetected || 'No Error Detected';
            descriptionEl.textContent = translations.errorDescriptionDefault || 'No detectable errors on the current page.';
        }
    }
    
    // 6. Initialization function
    async function initializePopup() {
        const settings = await chrome.storage.sync.get(['selectedLanguage', 'selectedTheme']);
        currentLang = settings.selectedLanguage || 'en';
        languageSelect.value = currentLang;
        
        await loadData();
        translateUI();
        applyTheme(settings.selectedTheme || 'light');

        const errorResult = await chrome.storage.local.get(['lastErrorCode']);
        lastErrorCode = errorResult.lastErrorCode || null;
        if (lastErrorCode) {
            displayErrorDetails(lastErrorCode);
            chrome.storage.local.remove('lastErrorCode');
        } else {
            displayErrorDetails(null);
        }
    }

    // 7. Event Listeners
    languageSelect.addEventListener('change', async (event) => {
        const newLang = event.target.value;
        await chrome.storage.sync.set({ selectedLanguage: newLang });
        await loadLanguage(newLang);
        translateUI();
        displayErrorDetails(lastErrorCode);
    });

    themeToggle.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        chrome.storage.sync.set({ selectedTheme: newTheme });
        applyTheme(newTheme);
    });

    initializePopup();
});
