// تابع متمرکز برای مدیریت خطا
async function handleError(errorCode, tabId) {
    try {
        // خطا را با کلید منحصر به فرد همان تب ذخیره می‌کنیم
        // [tabId.toString()]: errorCode
        await browser.storage.local.set({ [tabId.toString()]: errorCode });
        
        // علامت را فقط برای همان تب نمایش می‌دهیم
        await browser.action.setBadgeText({ tabId: tabId, text: '!' });
        await browser.action.setBadgeBackgroundColor({ tabId: tabId, color: '#D32F2F' });
    } catch (e) {
        console.error("Error365: Failed to handle error:", e);
    }
}

// شنونده برای خطاهای ناوبری
browser.webNavigation.onErrorOccurred.addListener(details => {
    if (details.frameId === 0) {
        handleError(details.error, details.tabId);
    }
});

// شنونده برای کدهای وضعیت HTTP
browser.webNavigation.onCompleted.addListener(async details => {
    if (details.frameId === 0) {
        if (details.statusCode >= 400) {
            handleError(details.statusCode.toString(), details.tabId);
        } else {
            // اگر ناوبری در این تب موفق بود، فقط خطای همین تب را پاک می‌کنیم
            await browser.storage.local.remove(details.tabId.toString());
            await browser.action.setBadgeText({ tabId: details.tabId, text: '' });
        }
    }
});

// اگر یک تب بسته شد، خطای مربوط به آن را از حافظه پاک می‌کنیم
browser.tabs.onRemoved.addListener((tabId) => {
    browser.storage.local.remove(tabId.toString());
});
