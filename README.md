# cmsc414-spring2026-semester_project-team3

**Files & Directories**
* content
  * blocker.js - contains the script that is injected directly into the webpage the user is visiting; it is the only script that can see the page's HTML.
* example-websites - examples of websites with ads using clickjacking and obfuscated urls.
* icons
* popup
  * action-menu.html - frontend for the extension's popup menu.
  * action-menu.js - contains the script that only runs when the user clicks the extension icon (popping up the little window); dies as soon as the user clicks away.
* scripts
  * service-worker.js - stays dormant until an event wakes up; runs globally across the whole browser, regardless of what tab the user is on.
* manifest.json - defines the extension.
* README.md - documentation.

**Other**
* [Initial frontend sketch](https://www.figma.com/site/yJMl4CRmy1s4ciEhNHDk74/CMSC-414-Spring-2026-Initial-Front-end-Design--Extension-Action-Menu--Team-3?node-id=0-1&t=FihyDwZLTHJUZp0u-1)