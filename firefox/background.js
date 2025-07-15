browser.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) {
    browser.storage.local.set({ lastErrorCode: details.error });

    browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
    browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

browser.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      browser.storage.local.set({ lastErrorCode: details.statusCode.toString() });

      browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
      browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
    } else {
      browser.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
