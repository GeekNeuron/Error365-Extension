chrome.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) {
    chrome.storage.local.set({ lastErrorCode: details.error });

    chrome.action.setBadgeText({ tabId: details.tabId, text: "!" });
    chrome.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      chrome.storage.local.set({ lastErrorCode: details.statusCode.toString() });

      chrome.action.setBadgeText({ tabId: details.tabId, text: "!" });
      chrome.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
    } else {
      chrome.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
