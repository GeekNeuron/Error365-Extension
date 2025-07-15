// A centralized function to handle detected errors
async function handleError(errorCode, tabId) {
  try {
    // Step 1: Save the error code to local storage and wait for it to complete.
    await browser.storage.local.set({ lastErrorCode: errorCode });

    // Step 2: Set the badge on the icon and wait.
    await browser.action.setBadgeText({ tabId: tabId, text: "!" });
    await browser.action.setBadgeBackgroundColor({ tabId: tabId, color: "#D32F2F" });

  } catch (e) {
    console.error("Error365: Failed to handle error:", e);
  }
}

// Listener for navigation errors
browser.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) {
    handleError(details.error, details.tabId);
  }
});

// Listener for HTTP status codes
browser.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      handleError(details.statusCode.toString(), details.tabId);
    } else {
      // If the page loaded successfully, just clear the badge for that tab.
      // We DO NOT clear the error from storage here anymore.
      await browser.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
