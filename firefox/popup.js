document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const languageSelect = document.getElementById('language-select');
    const appTitleEl = document.getElementById('app-title');
    const errorTitleEl = document.getElementById('error-title');
    const descriptionEl = document.getElementById('error-description');
    const solutionTitleEl = document.querySelector('#solution-details summary');
    const detailsEl = document.getElementById('solution-details');
    const errorCodeEl = document.getElementById('error-code');

    // --- State Variables ---
    let errorDatabase = {};
    let translations = {};
    let currentLang = 'en';
    let currentErrorCode = null;

    // --- Functions ---

    // 1. Load language file
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            translations = await response.json();
            currentLang = lang;
        } catch (e) {
            console.error(`Error loading language: ${lang}`, e);
            if (lang !== 'en') await loadLanguage('en'); // Fallback to English
        }
    }

    // 2. Translate static UI parts
    function translateUI() {
        document.documentElement.lang = currentLang;
        document.documentElement.dir = (currentLang === 'fa') ? 'rtl' : 'ltr';
        appTitleEl.textContent = translations.appName || 'Error365';
        solutionTitleEl.textContent = translations.solutionTitle || 'Suggested Solution';
    }

    // 3. Display error details
    function displayErrorDetails(errorCode) {
        currentErrorCode = errorCode; // Update current error state
        const errorData = errorCode ? errorDatabase[errorCode] : null;
        const localizedError = errorData ? (errorData[currentLang] || errorData['en']) : null;

        if (localizedError) {
            errorTitleEl.textContent = localizedError.title;
            descriptionEl.textContent = localizedError.description;
            errorCodeEl.textContent = errorCode;
            errorCodeEl.style.display = 'inline-block';
            detailsEl.classList.toggle('hidden', !localizedError.solution);
            if (localizedError.solution) {
                document.getElementById('error-solution').innerText = localizedError.solution;
            }
        } else {
            errorTitleEl.textContent = translations.errorDetected || 'No Error Detected';
            descriptionEl.textContent = translations.errorDescriptionDefault || 'No detectable errors.';
            errorCodeEl.style.display = 'none';
            detailsEl.classList.add('hidden');
        }
    }

    // 4. Main initialization logic
    async function initialize() {
        // Load error database first
        try {
            const response = await fetch('errors.json');
            errorDatabase = await response.json();
        } catch (e) {
            console.error("Failed to load errors.json", e);
            errorTitleEl.textContent = "Critical Error";
            descriptionEl.textContent = "Could not load the error database.";
            return;
        }

        // Get saved settings
        const settings = await browser.storage.sync.get(['selectedLanguage']);
        currentLang = settings.selectedLanguage || 'en';
        languageSelect.value = currentLang;

        await loadLanguage(currentLang);
        translateUI();

        // Check storage for an error when the popup opens
        const result = await browser.storage.local.get('lastErrorCode');
        displayErrorDetails(result.lastErrorCode);
    }

    // --- Event Listeners ---

    // Listen for language changes
    languageSelect.addEventListener('change', async () => {
        const newLang = languageSelect.value;
        await browser.storage.sync.set({ selectedLanguage: newLang });
        await loadLanguage(newLang);
        translateUI();
        displayErrorDetails(currentErrorCode); // Re-render the current error with the new language
    });

    // Listen for messages from the background script
    browser.runtime.onMessage.addListener((message) => {
        if (message.type === "ERROR_DETECTED") {
            displayErrorDetails(message.code);
        }
        return true; // Keep the message channel open for async responses if needed
    });

    initialize();
});
