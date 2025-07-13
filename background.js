// Listener for navigation errors (e.g., no internet connection)
chrome.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) { // Only for the main frame
    // Save only the error code to local storage
    chrome.storage.local.set({ lastErrorCode: details.error });

    // Set a badge on the extension icon to alert the user
    chrome.action.setBadgeText({ tabId: details.tabId, text: "!" });
    chrome.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

// Listener for HTTP status codes (e.g., 404, 500)
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      // Save only the status code to local storage
      chrome.storage.local.set({ lastErrorCode: details.statusCode.toString() });

      chrome.action.setBadgeText({ tabId: details.tabId, text: "!" });
      chrome.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
    } else {
      // Clear the badge if the page loads successfully
      chrome.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
