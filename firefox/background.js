browser.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) {
    browser.storage.local.set({ lastErrorCode: details.error });

    browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
    browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.frameId === 0 && details.type === "main_frame") {
      if (details.statusCode >= 400) {
        browser.storage.local.set({ lastErrorCode: details.statusCode.toString() });

        browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
        browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
      }
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] }
);

browser.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    browser.action.setBadgeText({ tabId: details.tabId, text: "" });
  }
});
