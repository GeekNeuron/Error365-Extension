// از یک متغیر ساده برای نگهداری خطای هر تب استفاده می‌کنیم
let lastErrorByTab = {};

// تابع برای ثبت خطا در متغیر
function handleError(errorCode, tabId) {
    lastErrorByTab[tabId] = errorCode;
    browser.action.setBadgeText({ tabId: tabId, text: "!" });
    browser.action.setBadgeBackgroundColor({ tabId: tabId, color: "#D32F2F" });
}

// شنونده برای پیام‌های ارسالی از پاپ‌آپ
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_ERROR" && message.tabId) {
        // پاسخ را با کد خطای ذخیره‌شده برای آن تب ارسال کن
        sendResponse({ code: lastErrorByTab[message.tabId] });
    }
    // برای پاسخ‌های ناهمزمان باز نگه داشته می‌شود
    return true; 
});

// شنونده برای خطاهای ناوبری
browser.webNavigation.onErrorOccurred.addListener((details) => {
    if (details.frameId === 0) {
        handleError(details.error, details.tabId);
    }
});

// شنونده برای کدهای وضعیت HTTP
browser.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId === 0) {
        if (details.statusCode >= 400) {
            handleError(details.statusCode.toString(), details.tabId);
        }
    }
});

// وقتی یک تب با موفقیت به‌روز می‌شود، خطا را از حافظه پاک کن
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // فقط اگر خطایی برای این تب ثبت شده باشد، آن را پاک کن
        if (lastErrorByTab[tabId]) {
            delete lastErrorByTab[tabId];
            browser.action.setBadgeText({ tabId: tabId, text: "" });
        }
    }
});

// وقتی یک تب بسته می‌شود، اطلاعات آن را پاک کن
browser.tabs.onRemoved.addListener((tabId) => {
    if (lastErrorByTab[tabId]) {
        delete lastErrorByTab[tabId];
    }
});
