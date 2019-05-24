# Scroll Spy

Creating content for your platforms eats a lot of time and resources. You should therefore ask yourself how much of your content that actually reaches your visitors. Valuable content further down on your pages may pass by your visitors completely.
Scroll Spy is a lightweight website plugin that detects how far a visitor scrolls each page and reports the data to Google Analytics for analysis, allowing you to alter your layout based on the data.

## Versions

* 2.1.1 - Written in ES6+, this version is designed for usage on modern browsers.
* 1.1.3 - This version is cross browser supported, and designed to run in any browser - new or old.

## Installation

As Scroll Spy is a single JavaScript file, you reference it with the HTML `<script>` tag:

`<script id="scrollspy" src="path/to/scrollspy.min.js" data-debug="false" data-levels="100,80,60,40,20"></script>`

You can customize which threshold levels (percentage of the page that has been scrolled) should be reported to Google Analytics by using the `data-levels` attribute on the script tag.
The attribute value should be entered as a `string` with a comma-separated list of the levels you wish to track. If this parameter is omitted, Scroll Spy defaults to 100,80,60,40,20.

If the parameter `data-debug` is set to `true`, Scroll Spy will display a debug overlay on the page, and *not* report any data to Google Analytics. If omitted, this parameter defaults to `false`.

Feel free to minimize the scripts with your the minifier of your choice before using in production environments.

https://codeant.se