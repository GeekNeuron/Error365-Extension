// background.js

// Listener for HTTP status codes
browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    // We only care about the main document frame
    if (details.frameId === 0 && details.type === "main_frame") {
      
      // Check for client or server errors (e.g., 404, 500)
      if (details.statusCode >= 400) {
        const errorCode = details.statusCode.toString();
        
        // Store the error code for the popup to read
        browser.storage.local.set({ lastErrorCode: errorCode });

        // Set the badge to indicate an error
        browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
        browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
      } 
      // If the page loaded successfully (e.g., 200 OK)
      else if (details.statusCode >= 200 && details.statusCode < 300) {
        // Clear any previous error code from storage
        browser.storage.local.remove("lastErrorCode");
        
        // Clear the badge
        browser.action.setBadgeText({ tabId: details.tabId, text: "" });
      }
    }
  },
  // Configuration for the listener
  { urls: ["<all_urls>"], types: ["main_frame"] }
);

// Listener for network-level errors (e.g., DNS error, connection refused)
browser.webNavigation.onErrorOccurred.addListener((details) => {
  // We only care about the main document frame
  if (details.frameId === 0) {
    const errorCode = details.error; // e.g., "NS_ERROR_DNS_NOT_FOUND"
    
    // Store the error code for the popup
    browser.storage.local.set({ lastErrorCode: errorCode });

    // Set the badge to indicate an error
    browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
    browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});
