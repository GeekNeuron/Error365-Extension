browser.webNavigation.onErrorOccurred.addListener(async (details) => {
  if (details.frameId === 0) {
    const errorCode = details.error;
    await browser.storage.local.set({ lastErrorCode: errorCode });

    browser.runtime.sendMessage({ type: "ERROR_SET", code: errorCode });

    await browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
    await browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

browser.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      const errorCode = details.statusCode.toString();
      await browser.storage.local.set({ lastErrorCode: errorCode });

      browser.runtime.sendMessage({ type: "ERROR_SET", code: errorCode });

      await browser.action.setBadgeText({ tabId: details.tabId, text: "!" });
      await browser.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
    } else {
      await browser.storage.local.remove('lastErrorCode');
      await browser.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
