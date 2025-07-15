// Listener for navigation errors (e.g., no internet connection)
browser.webNavigation.onErrorOccurred.addListener(async (details) => {
  // Ensure the listener only acts on the main frame of a tab
  if (details.frameId === 0) {
    // Use 'await' to ensure the save operation completes before the script becomes inactive
    await browser.storage.local.set({ lastErrorCode: details.error });

    // Also await badge updates to ensure they are applied
    await browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
    await browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

// Listener for HTTP status codes (e.g., 404, 500)
browser.webNavigation.onCompleted.addListener(async (details) => {
  // Ensure the listener only acts on the main frame of a tab
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      // Use 'await' to ensure the save operation completes
      await browser.storage.local.set({ lastErrorCode: details.statusCode.toString() });

      await browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
      await browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
    } else {
      // Clear the badge if the page loads successfully
      await browser.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
