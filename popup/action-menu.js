document.addEventListener('DOMContentLoaded', () => {
    const statusToggleElement = document.getElementById('toggle');
    const extensionNameElement = document.getElementById('extension-name');

    // get and restore the saved state when popup opened
    chrome.storage.local.get({ extensionEnabled: true }, (result) => {
        statusToggleElement.checked = result.extensionEnabled;
        updateToggleUI(result.extensionEnabled)
    })

    // save the state when clicked
    statusToggleElement.addEventListener('change', () => {
        const isEnabled = statusToggleElement.checked;
        
        browser.runtime.sendMessage({ action: "toggle", enabled: isEnabled });

        // Save the state to local storage
        chrome.storage.local.set({ extensionEnabled: isEnabled });
    });


    function updateToggleUI(isEnabled) {
        document.body.style.backgroundColor = isEnabled ? '#c4c4c4' : '#535353';
        extensionNameElement.style.color = isEnabled ? '#000000' : '#f8f8f8';
    }
});
