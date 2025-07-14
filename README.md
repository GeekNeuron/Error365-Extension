# Error365 - Extension

Error365 is a lightweight and intuitive Chrome extension designed to instantly detect and explain browser errors. It helps users understand what went wrong during their web navigation by providing clear, concise information and potential solutions directly in their browser.

The extension features a clean, dark-mode-only interface, supports multiple languages, and is built to be as unobtrusive as possible, alerting you only when a detectable error occurs.

---
## Key Features

- **Automatic Error Detection**: Instantly identifies common HTTP errors (like 404, 503) and network errors (e.g., `net::ERR_INTERNET_DISCONNECTED`) in the background.
- **Informative Popup**: Displays the error code, a simple-to-understand title, and a detailed description of the problem.
- **Actionable Solutions**: Provides a collapsible "Suggested Solution" section with steps to help users resolve common issues.
- **Multilingual Support**: A user-friendly dropdown menu allows you to switch the interface language on the fly. Language settings are saved for a consistent experience.
- **Clean, Modern UI**: A permanent dark theme with a sharp, minimalist design ensures readability and a pleasant user experience.
- **External JSON Database**: All error definitions are managed in an external `errors.json` file, making the extension easy to update and scale.

---
## Installation

Since this is an unpacked extension, it needs to be loaded into Chrome manually.

1.  **Download or Clone:** Make sure you have the complete project folder, `Error365-Extension`, on your local machine.
2.  **Open Chrome Extensions:** Open Google Chrome, navigate to `chrome://extensions`, or click the puzzle piece icon in the toolbar and select "Manage Extensions."
3.  **Enable Developer Mode:** In the top-right corner of the extensions page, toggle the **Developer mode** switch to the "on" position.
4.  **Load the Extension:**
    - Click the **"Load unpacked"** button that appears on the top-left.
    - In the file selection dialog, navigate to and select the entire `Error365-Extension` folder.
    - Click "Select Folder."
5.  **Done!** The Error365 extension icon should now appear in your browser's toolbar.

---
## How to Use

Using Error365 is designed to be completely automatic.

1.  **Browse the Web**: Simply use your browser as you normally would.
2.  **Error Detection**: When you land on a page with a detectable error (e.g., a "404 Not Found" page or if your internet disconnects), the Error365 icon in your toolbar will display a small red exclamation mark (`!`).
3.  **View Error Details**: Click the Error365 icon to open the popup. The popup will automatically display:
    - The detected **error code** (e.g., `404`).
    - The **title** and **description** of the error in your selected language.
    - A **"Suggested Solution"** section if a solution is available.
4.  **Change Settings**:
    - Use the **dropdown menu** in the top-right corner to change the display language.
    - The popup will automatically clear the error information once you navigate to a new, healthy page.

---
## Project Structure

The project is organized as follows:

```
Error365-Extension/
│
├── manifest.json
├── errors.json
├── background.js
│
├── popup.html
├── popup.css
├── popup.js
│
├── icons/
│   ├── logo16.png
│   ├── logo48.png
│   └── logo128.png
│
└── lang/
    ├── en.json
    └── fa.json
```

- **`manifest.json`**: The core configuration file for the extension.
- **`errors.json`**: The database containing all error definitions and translations.
- **`background.js`**: The service worker that listens for browser events and detects errors.
- **`popup.*`**: The set of files that create and manage the user-facing popup window.
- **`icons/`**: Contains the extension's logos.
- **`lang/`**: Contains the translation files for the user interface.
