document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');

    const appTitleEl = document.getElementById('app-title');
    const errorTitleEl = document.getElementById('error-title');
    const descriptionEl = document.getElementById('error-description');
    const solutionTitleEl = document.querySelector('#solution-details summary');
    const solutionEl = document.getElementById('error-solution');
    const detailsEl = document.getElementById('solution-details');
    const errorCodeEl = document.getElementById('error-code');

    let errorDatabase = {};
    let translations = {};
    let currentLang = 'en';
    let lastErrorCode = null;

    async function loadData() {
        try {
            const errorResponse = await fetch('errors.json');
            errorDatabase = await errorResponse.json();
            
            await loadLanguage(currentLang);
        } catch (error) {
            console.error("Error365: Could not load initial data", error);
        }
    }

    async function loadLanguage(lang) {
        try {
            const langResponse = await fetch(`lang/${lang}.json`);
            translations = await langResponse.json();
            currentLang = lang;
        } catch (error) {
            console.error(`Error365: Could not load language file for ${lang}`, error);
            if (currentLang !== 'en') {
                await loadLanguage('en');
            }
        }
    }

    function translateUI() {
        document.documentElement.lang = currentLang;
        document.documentElement.dir = (currentLang === 'fa') ? 'rtl' : 'ltr';

        appTitleEl.textContent = translations.appName || 'Error365';
        solutionTitleEl.textContent = translations.solutionTitle || 'Suggested Solution';
    }

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
    
    async function initializePopup() {
        const settings = await chrome.storage.sync.get(['selectedLanguage']);
        currentLang = settings.selectedLanguage || 'en';
        languageSelect.value = currentLang;
        
        await loadData();
        translateUI();

        const errorResult = await chrome.storage.local.get(['lastErrorCode']);
        lastErrorCode = errorResult.lastErrorCode || null;
        if (lastErrorCode) {
            displayErrorDetails(lastErrorCode);
            chrome.storage.local.remove('lastErrorCode');
        } else {
            displayErrorDetails(null);
        }
    }

    languageSelect.addEventListener('change', async (event) => {
        const newLang = event.target.value;
        await chrome.storage.sync.set({ selectedLanguage: newLang });
        await loadLanguage(newLang);
        translateUI();
        displayErrorDetails(lastErrorCode);
    });

    initializePopup();
});
