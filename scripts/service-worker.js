let currentToggleState = false; // Default state of the toggle switch (can be updated based on user preferences or other logic)

// Functions to run when the extension is installed.
browser.runtime.onInstalled.addListener(function installed() {
    // Adds context menu options
    addContextMenus();
    setupInjectionScript();
    getAdWebsites();

    browser.storage.local.get("extensionEnabled", (result) => {
        currentToggleState = result.extensionEnabled;
        if (currentToggleState) {
            toggleInjection(true);
        }
    });
});

// Handle messages sent to the background service worker.
browser.runtime.onMessage.addListener(function handleMessage(request, sender, sendResponse) {
    console.log("Recieved message" + (sender.tab ? ` from ${sender.tab?.id}.` : " from undefined tab."));
    switch(request.action) {
        case "toggle":
            toggleInjection(request.enabled);
            break;
        case "compareURL":
            const isAdURL = compareURLAgainstList(request.url);
            sendResponse({ isAdURL: isAdURL });
            break;
        case "blockerScriptLoaded":
            console.log("Blocker script loaded on page: " + request.url);
            break;
        default:
            console.warn("Received unknown message: " + request.action + " with payload: " + JSON.stringify(request));
    }
})


// Handle context menu actions.
browser.contextMenus.onClicked.addListener((info, tab) => {
    switch(info.menuItemId) {

        case "actionMenuAddDynamicPage":
            addPageToRegisteredScripts(tab.url, "special-blocker-script");
            break;

        case "toggleOnAllPages":
            toggleInjection(!currentToggleState);
            break;

        default:
            console.warn("Received click on unknown context menu item: " + info.menuItemId);
    }
});

//----------------------------
// Onload setup functions

// Function to setup context menus upon extension installation.
function addContextMenus() {
    browser.contextMenus.create({
        id: "actionMenuAddDynamicPage",
        title: "Activate on Individual Website",
        contexts: ["action"]
    });
    
    browser.contextMenus.create({
        id: "toggleOnAllPages",
        title: "Activate/Deactivate on All Pages",
        contexts: ["action"]
    });
}

// Function to setup the content script for injection.
function setupInjectionScript() {
    browser.scripting.registerContentScripts([{
        id: "special-blocker-script",
        js: ["content/blocker.js"],
        matches: ["https://example.com/*"],
        runAt: "document_idle",
        persistAcrossSessions: true
    }]);
}

// Function to read the list of ad websites from a text file included in the extension's resources.
let adWebsites = [];
function getAdWebsites() {
    const fileUrl = browser.runtime.getURL('data/ad_websites.txt');

    fetch(fileUrl)
    .then(response => response.text())
    .then(text => {
        console.log("File content:\n", text);
        adWebsites = text.split('\n');
    })
    // .catch(err => console.error("Error reading file:", err));
}


// ----------------------------
// Helper functions

// Function to register a website
function addPageToRegisteredScripts(URL, id) {

    // Trims a URL down to eliminate the path. 
    let temp = URL.indexOf(".");
    let indexAfterHost = URL.substring(temp).indexOf("/") + temp;
    let trimURL = URL.substring(0, indexAfterHost) + "/*";

    // Registers the trimmed URL
    browser.scripting.getRegisteredContentScripts({ids: [id]})
        .then((contentScript) => {
            let oldMatches = contentScript[0].matches;
            if (oldMatches === undefined)
                return true;
            let newMatches = oldMatches.concat(trimURL);
            browser.scripting.updateContentScripts([{ id: id, matches: newMatches, persistAcrossSessions: true }]);
            console.log(`Added ${trimURL} to registered content script.`)
        });
}

async function toggleInjection(isEnabled) {
  if (isEnabled) {
    // Register the script so it automatically runs on all future page loads
    await browser.scripting.registerContentScripts([{
      id: "blocker-script",
      js: ["content/blocker.js"],
      matches: ["<all_urls>"],
      runAt: "document_idle"
    }]);
    currentToggleState = true;
  } else {
    // Remove the script so it stops injecting into new pages
    await browser.scripting.unregisterContentScripts({ ids: ["blocker-script"] });
    currentToggleState = false;
  }
}


function compareURLAgainstList(URL) {
    for (let i = 0; i < adWebsites.length; i++) {
        if (URL.includes(adWebsites[i])) {
            console.log("Blocked ad URL: " + URL);
            return true;
        }
    }
    console.log("URL is not an ad: " + URL);
    return false;
}
