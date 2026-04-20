
// Functions to run when the extension is installed.
chrome.runtime.onInstalled.addListener(function installed() {
    // Adds context menu options
    addContextMenus();
});

// Handle messages sent to the background service worker.
chrome.runtime.onMessage.addListener(function handleMessage(request, sender, sendResponse) {
    console.log("Recieved message" + (sender.tab ? ` from ${sender.tab?.id}.` : " from undefined tab."));
})


// Handle context menu actions.
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch(info.menuItemId) {
        // case "":
        //     break;
        default:

    }
});

// Function to setup context menus upon extension installation.
function addContextMenus() {
    // chrome.contextMenus.create({
    //     id: "actionMenuAddDynamicPage",
    //     title: "Register Site with Reader",
    //     contexts: ["action"]
    // });
}

// Function to register a website
function addPageToRegisteredScripts(URL, id) {
    // Trims a URL down to eliminate the path. 
    let temp = URL.indexOf(".");
    let indexAfterHost = URL.substring(temp).indexOf("/") + temp;
    let trimURL = URL.substring(0, indexAfterHost) + "/*";

    // Registers the trimmed URL
    chrome.scripting.getRegisteredContentScripts({ids: [id]})
        .then((contentScript) => {
            let oldMatches = contentScript[0].matches;
            if (oldMatches === undefined)
                return true;
            let newMatches = oldMatches.concat(trimURL);
            chrome.scripting.updateContentScripts([{ id: id, matches: newMatches, persistAcrossSessions: true }]);
            console.log(`Added ${trimURL} to registered content script.`)
        });
}