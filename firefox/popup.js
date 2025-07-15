document.addEventListener('DOMContentLoaded', () => {
    // ... (تمام Element References و متغیرهای State مانند قبل) ...
    const languageSelect = document.getElementById('language-select');
    const appTitleEl = document.getElementById('app-title');
    // ... بقیه متغیرها

    let errorDatabase = {}, translations = {}, currentLang = 'en', currentErrorCode = null;

    // ... (توابع loadLanguage, translateUI, displayErrorDetails مانند قبل) ...

    async function initialize() {
        // ۱. بارگذاری دیتابیس‌ها
        try {
            const errorResponse = await fetch('errors.json');
            errorDatabase = await errorResponse.json();
        } catch (e) { /* ... مدیریت خطا ... */ return; }

        const settings = await browser.storage.sync.get(['selectedLanguage']);
        currentLang = settings.selectedLanguage || 'en';
        languageSelect.value = currentLang;
        await loadLanguage(currentLang);
        translateUI();

        // ۲. دریافت تب فعلی
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
            const currentTabId = tabs[0].id;
            
            // ۳. ارسال پیام به background.js برای دریافت کد خطا
            try {
                const response = await browser.runtime.sendMessage({
                    type: "GET_ERROR",
                    tabId: currentTabId
                });
                
                // ۴. نمایش خطا بر اساس پاسخ دریافتی
                if (response && response.code) {
                    displayErrorDetails(response.code);
                } else {
                    displayErrorDetails(null);
                }
            } catch (e) {
                console.error("Could not communicate with background script.", e);
                displayErrorDetails(null);
            }
        }
    }

    languageSelect.addEventListener('change', async () => {
        const newLang = languageSelect.value;
        await browser.storage.sync.set({ selectedLanguage: newLang });
        await loadLanguage(newLang);
        translateUI();
        displayErrorDetails(currentErrorCode); 
    });

    initialize();
});
