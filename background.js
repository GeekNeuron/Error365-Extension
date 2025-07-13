let errorDatabase = {};

// Function to load the error database from the JSON file
async function loadErrorDatabase() {
  const url = chrome.runtime.getURL('errors.json');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Error365: Failed to load errors.json:', response.statusText);
      return;
    }
    errorDatabase = await response.json();
    console.log('Error365: Database loaded successfully.');
  } catch (error) {
    console.error('Error365: Error fetching or parsing errors.json:', error);
  }
}

// Load the database when the extension starts
loadErrorDatabase();

// Listener for navigation errors (e.g., no internet connection)
chrome.webNavigation.onErrorOccurred.addListener((details) => {
  if (details.frameId === 0) { // Only for the main frame
    const errorCode = details.error;
    const errorInfo = errorDatabase[errorCode] || {
      title: `Network Error: ${errorCode}`,
      description: "An unknown network error occurred. Please search for the error code for more details.",
      solution: "Check your internet connection and firewall settings."
    };

    // Save the detected error to storage for the popup to read
    chrome.storage.local.set({ lastError: errorInfo });

    // Set a badge on the extension icon to alert the user
    chrome.action.setBadgeText({ tabId: details.tabId, text: "!" });
    chrome.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
  }
});

// Listener for HTTP status codes (e.g., 404, 500)
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    if (details.statusCode >= 400) {
      const errorCode = details.statusCode.toString();
      const errorInfo = errorDatabase[errorCode] || {
        title: `HTTP Error ${errorCode}`,
        description: "An unknown HTTP error occurred. This code indicates an issue in the communication between the browser and the server.",
        solution: "Try refreshing the page or try again later."
      };

      chrome.storage.local.set({ lastError: errorInfo });
      chrome.action.setBadgeText({ tabId: details.tabId, text: "!" });
      chrome.action.setBadgeBackgroundColor({ tabId: details.tabId, color: "#D32F2F" });
    } else {
      // Clear the badge if the page loads successfully
      chrome.action.setBadgeText({ tabId: details.tabId, text: "" });
    }
  }
});
