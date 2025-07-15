async function handleError(errorCode, tabId) {
  try {
    await browser.storage.local.set({ lastErrorCode: errorCode });

    await browser.action.setBadgeText({ tabId: tabId, text: "!" });
    await browser.action.setBadgeBackgroundColor({ tabId: tabId, color: "#D32F2F" });

  } catch (e) {
    console.error("Error365: Failed to handle error:", e);
  }
}

browser.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) {
    handleError(details.error, details.tabId);
  }
});

browser.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      handleError(details.statusCode.toString(), details.tabId);
    } else {
      await browser.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
