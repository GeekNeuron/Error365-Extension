browser.webNavigation.onErrorOccurred.addListener(async (details) => {
  if (details.frameId === 0) {
    await browser.storage.local.set({ lastErrorCode: details.error });

    await browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
    await browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

browser.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      await browser.storage.local.set({ lastErrorCode: details.statusCode.toString() });

      await browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
      await browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
    } else {
      await browser.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
