document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');
    let errorDatabase = {};
    let currentLang = 'en'; // Default base language
    let lastErrorCode = null; // To store the current error code

    // 1. Load the error database once
    fetch(chrome.runtime.getURL('errors.json'))
        .then(response => response.json())
        .then(data => {
            errorDatabase = data;
            // After loading the DB, initialize the popup
            initializePopup();
        })
        .catch(error => console.error("Error365: Could not load errors.json", error));

    // 2. Function to translate the static UI elements
    function translateUI(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = chrome.i18n.getMessage(el.getAttribute('data-i18n'));
        });
    }

    // 3. Main function to display error details based on language
    function displayErrorDetails(errorCode, lang) {
        const titleEl = document.getElementById('error-title');
        const descriptionEl = document.getElementById('error-description');
        const solutionEl = document.getElementById('error-solution');
        const detailsEl = document.getElementById('solution-details');

        const errorData = errorCode ? errorDatabase[errorCode] : null;

        if (errorData && errorData[lang]) {
            const localizedError = errorData[lang];
            titleEl.textContent = localizedError.title;
            descriptionEl.textContent = localizedError.description;

            if (localizedError.solution) {
                solutionEl.innerText = localizedError.solution;
                detailsEl.classList.remove('hidden');
            } else {
                detailsEl.classList.add('hidden');
            }
        } else {
            // Display default "No error" message
            titleEl.textContent = chrome.i18n.getMessage('errorDetected');
            descriptionEl.textContent = chrome.i18n.getMessage('errorDescriptionDefault');
            detailsEl.classList.add('hidden');
        }
    }
    
    // 4. Initialization function
    async function initializePopup() {
        const langResult = await chrome.storage.sync.get(['selectedLanguage']);
        currentLang = langResult.selectedLanguage || 'en';
        languageSelect.value = currentLang;
        translateUI(currentLang);

        const errorResult = await chrome.storage.local.get(['lastErrorCode']);
        lastErrorCode = errorResult.lastErrorCode || null;
        if (lastErrorCode) {
            displayErrorDetails(lastErrorCode, currentLang);
            // Clear the error code after it has been displayed
            chrome.storage.local.remove('lastErrorCode');
        } else {
            displayErrorDetails(null, currentLang); // Display default state
        }
    }

    // 5. Language change event listener
    languageSelect.addEventListener('change', (event) => {
        const newLang = event.target.value;
        chrome.storage.sync.set({ selectedLanguage: newLang }, () => {
            currentLang = newLang;
            translateUI(newLang);
            // Re-display the currently stored error (if any) with the new language
            displayErrorDetails(lastErrorCode, currentLang);
        });
    });
    
    // Event listener for the "View All Errors" button
    document.getElementById('view-all-btn').addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('all_errors.html') });
    });
});
