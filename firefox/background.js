// برای شناسایی خطاهای شبکه‌ای (مثلاً عدم اتصال به اینترنت)
browser.webNavigation.onErrorOccurred.addListener((details) => {
  // فقط برای فریم اصلی صفحه
  if (details.frameId === 0) {
    browser.storage.local.set({ lastErrorCode: details.error });

    // تنظیم نشان خطا روی آیکون افزونه
    browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
    browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

// برای شناسایی خطاهای HTTP (مانند 404, 500)
browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    // فقط برای درخواست اصلی صفحه (نه تصاویر، اسکریپت‌ها و غیره)
    if (details.frameId === 0 && details.type === "main_frame") {
      // اگر کد وضعیت خطا بود
      if (details.statusCode >= 400) {
        browser.storage.local.set({ lastErrorCode: details.statusCode.toString() });

        // تنظیم نشان خطا روی آیکون افزونه
        browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
        browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
      }
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] }
);

// برای پاک کردن نشان خطا وقتی صفحه با موفقیت بارگذاری می‌شود
browser.webNavigation.onCompleted.addListener((details) => {
  // فقط برای فریم اصلی صفحه
  if (details.frameId === 0) {
    // در اینجا دیگر نیازی به بررسی statusCode نیست
    browser.action.setBadgeText({ tabId: details.tabId, text: "" });
  }
});
