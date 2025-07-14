document.addEventListener('DOMContentLoaded', () => {
    
    // This function will run after we get the saved language
    function buildPage(lang) {
        // Set the page language and direction
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';

        // Translate static UI elements like titles
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = chrome.i18n.getMessage(el.getAttribute('data-i18n'));
        });

        // Load and display the error tiles in the correct language
        loadErrorTiles(lang);
    }

    // This function fetches errors.json and creates the tiles
    async function loadErrorTiles(lang) {
        const categories = {
            '4xx': document.getElementById('category-4xx'),
            '5xx': document.getElementById('category-5xx'),
            'network': document.getElementById('category-network'),
            'other': document.getElementById('category-other')
        };
        
        try {
            const response = await fetch('errors.json');
            const errors = await response.json();

            for (const [code, errorDetailsByLang] of Object.entries(errors)) {
                // Choose the correct translation, falling back to English if not found
                const details = errorDetailsByLang[lang] || errorDetailsByLang['en'];

                if (!details) continue; // Skip if no details are found

                const tile = document.createElement('div');
                tile.className = 'error-tile';

                const title = document.createElement('h3');
                title.textContent = details.title;

                const description = document.createElement('p');
                description.textContent = details.description;

                tile.appendChild(title);
                tile.appendChild(description);

                // Categorize errors
                if (code.startsWith('4')) {
                    categories['4xx'].appendChild(tile);
                } else if (code.startsWith('5')) {
                    categories['5xx'].appendChild(tile);
                } else if (code.startsWith('net::')) {
                    categories['network'].appendChild(tile);
                } else if(categories['other']) {
                    categories['other'].appendChild(tile);
                }
            }
        } catch (error) {
            console.error('Error365: Failed to load or display errors:', error);
            const container = document.querySelector('.container');
            if (container) {
                container.innerHTML = '<p>Failed to load error list.</p>';
            }
        }
    }

    // --- Main Logic ---
    // 1. Get the saved language from storage
    chrome.storage.sync.get(['selectedLanguage'], (result) => {
        // 2. Use the saved language, or fall back to the browser's language, or finally to 'en'
        const preferredLang = result.selectedLanguage || chrome.i18n.getUILanguage().split('-')[0] || 'en';
        
        // 3. Build the entire page with the correct language
        buildPage(preferredLang);
    });
});
