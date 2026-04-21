

function sendToggleMessage() {
    // Get the current state of the toggle switch
    // TODO: This should be replaced with the actual ID of the toggle switch in the popup HTML
    const isEnabled = document.getElementById("toggle").checked;

    // Send a message to the background service worker to toggle the feature
    browser.runtime.sendMessage({ action: "toggle", enabled: isEnabled });
}