// background.js - Final Logic

/**
 * Sets the error state for a specific tab.
 * It stores the error code and shows a "!" badge on the icon.
 * @param {number} tabId - The ID of the tab.
 * @param {string} errorCode - The error code or message to store.
 */
function setErrorState(tabId, errorCode) {
  console.log(`Error365: Setting error '${errorCode}' for tab ${tabId}`);
  browser.storage.local.set({ lastErrorCode: errorCode });
  browser.action.setBadgeText({ tabId: tabId, text: "!" });
  browser.action.setBadgeBackgroundColor({ tabId: tabId, color: "#D32F2F" });
}

/**
 * Clears the error state for a specific tab.
 * It removes the stored error code and clears the badge.
 * @param {number} tabId - The ID of the tab.
 */
function clearErrorState(tabId) {
  console.log(`Error365: Clearing error state for tab ${tabId}`);
  browser.storage.local.remove('lastErrorCode');
  browser.action.setBadgeText({ tabId: tabId, text: "" });
}


// --- Event Listeners ---

// Action: When the user STARTS navigating to a new page.
// This is the perfect moment to RESET the state for that tab.
browser.webNavigation.onBeforeNavigate.addListener((details) => {
  // We only care about the main frame of the tab
  if (details.frameId === 0) {
    clearErrorState(details.tabId);
  }
});

// Action: When the server sends back the initial response (headers).
// This happens AFTER onBeforeNavigate. We check here for HTTP errors.
browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    // Check for HTTP errors (4xx or 5xx) in the main frame
    if (details.frameId === 0 && details.statusCode >= 400) {
      setErrorState(details.tabId, details.statusCode.toString());
    }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] }
);

// Action: When a lower-level network error occurs (e.g., no internet).
// This also happens AFTER onBeforeNavigate.
browser.webNavigation.onErrorOccurred.addListener((details) => {
  // We only care about errors in the main frame
  if (details.frameId === 0) {
    // Avoid showing the "aborted" error which happens on normal navigation
    if (details.error !== "NS_ERROR_ABORT") {
      setErrorState(details.tabId, details.error);
    }
  }
});
