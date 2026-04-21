function findAdsInFrames() {
    // Get all iframe elements on the page
    const frames = document.getElementsByTagName("iframe");

    for (let i = 0; i < frames.length; i++) {
        const src = frames[i].src;
        
        // Check if the source URL is external and contains common ad keywords
        if (src && !src.includes(window.location.hostname)) {
            let isAd = browser.runtime.sendMessage({ action: "compareURL", url: src }, (response) => {
                if (response && response.isAdURL) {
                    console.log("Detected ad URL in iframe: " + src);

                    // Prevent the iframe from accessing content outside of itself
                    frames[i].setAttribute("sandbox", "allow-scripts");
                } else {
                    console.log("Iframe URL is not an ad: " + src);
                }
            });
        }
    }
}


window.addEventListener("load", () => {
    findAdsInFrames();
});

// navigation.addEventListener("navigate", (event) => {
//     if (!event.userInitiated) {
//         event.preventDefault();
//         console.log("Blocked non-user-initiated navigation to: " + event.destination.url + "\n" + JSON.stringify(event));
//     }
// });

window.addEventListener("beforeunload", (event) => {
    if (!navigator.userActivation.isActive) {
        event.preventDefault();
        console.log("Blocked non-user-initiated unload event: " + JSON.stringify(event));
    }
});

console.log("Blocker script loaded and running.");
browser.runtime.sendMessage({ action: "blockerScriptLoaded", url: window.location.href });