(function() {
    'use strict';
    
    var document = window.document;
	
    var config = {
		version: "1.3.1 (Cross browser)",
        levels: [100,80,60,40,20],
        values: [],
        seconds: 0,
        analytics: false
    };

    var app = {
		getDOMstate: function() {
			if (document.readyState === "interactive" || document.readyState === "complete") {
				app.getSettings();
			} else {
				document.addEventListener("DOMContentLoaded", function() {
					app.getSettings();
				});
			}			
		},
        getSettings: function() {
            var script = document.querySelector("#scrollspy");
            if (script) {
                config.debug = JSON.parse(script.getAttribute('data-debug'));
                app.getLevels();
            } else {
                config.debug = true;
            }
            app.initialize();
        },
        getLevels: function() {
            var acceptedLevels = [];
            var inputLevels = document.querySelector("#scrollspy").getAttribute('data-levels');
            if (inputLevels) {
                inputLevels = inputLevels.split(",");
                var levelCount = inputLevels.length;
                for (var i = 0; i < levelCount; i++) {
                    var level = inputLevels[i];
                    if (!isNaN(level) && acceptedLevels.indexOf(level) === -1) {
                        acceptedLevels.push(level);
                    }
                }
            }
            if (acceptedLevels.length) {
                acceptedLevels.sort(function(a, b) {return b-a});
                config.levels = acceptedLevels;
            }
        },  
        initialize: function() {
            window.setInterval(function() {
                config.seconds++;
            }, 1000);
            app.addEventListeners({
				selector: document,
				action: "scroll",
				callback: app.scroll
			});
			app.log('Scroll Spy ' + config.version + ' successfully initialized.');
			app.getTracker();
			app.initializeDebugWindow();
        },
        addEventListeners: function(data) {
            if (document.addEventListener) {
                document.addEventListener(data.action, function(e) {
                    if (e.target && e.target == data.selector) {
                        data.callback();
                    }
                });
            } else if (document.attachEvent) {
                document.attachEvent('on' + data.action, function(e) {
                    if (e.target && e.target == data.selector) {
                        data.callback();
                    }
                });
            }
        },		
        getTracker: function() {
            if (typeof window.ga == 'function') {
                config.analytics = "universal";
                app.log("Scroll Spy successfully detected a tracker for Google Analytics (Universal).");
            } else if (window._gaq) {
                config.analytics = "classic";
                app.log("Scroll Spy successfully detected a tracker for Google Analytics (classic).");
            } else {
                config.analytics = false;
                app.log("Scroll Spy could not detect any Google Analytics tracker - No data will be sent to GA.");
            }
        },
        initializeDebugWindow: function() {
            if (config.debug) {
                var tracker = config.analytics ? 'Google Analytics (' + config.analytics + ')' : "None";
                var percentages = config.levels.join("%, ") + '%';
                var body = document.getElementsByTagName("body")[0];
                var wrapper = document.createElement('div');
                wrapper.setAttribute("class", "scrollspy-debug-wrapper");
                wrapper.innerHTML = '<div class="scrollspy-debug-title">SCROLL SPY DEBUGGER</div><a href="http://codeant.se" target="_blank">Powered by codeant.se</a><div class="scrollspy-debug-content scrollspy-debug-content-values"><p>Scroll Spy version:<br><strong>' + config.version + '</strong></p><p>Detected tracker:<br><strong>' + tracker + '</strong></p><p>Page path:<br><strong>' + document.location.pathname+ '</strong></p><p>Log values:<br><strong>' + percentages + '</strong></p><p><em>Scroll Spy is running in debug mode.<br>No data will be sent to Google Analytics.</em></p><div class="scrollspy-debug-message"></div></div><button class="scrollspy-debug-button" id="scrollspy-debug-refresh">Refresh</button><button class="scrollspy-debug-button" id="scrollspy-debug-close">Close</button><style id="scrollspy-style">.scrollspy-debug-wrapper {font-family: Arial, Helvetica, sans-serif; text-align:center; background:#f0f0f0; color:#333; font-size:12px; line-height:16px; border:1px solid #999; border-radius:4px; box-shadow:0 0 8px rgba(0,0,0,0.6); position:fixed; z-index:200; top:20px; left:20px; padding:10px 14px 14px 14px; width:calc(100% - 70px); max-height: calc(100% - 70px); max-width:280px; overflow: auto;} .scrollspy-debug-content {border-radius: 4px; background:#FFF; text-align:left; padding:4px 8px 4px 8px; margin:8px 0 8px 0;} .scrollspy-debug-button {background:#669900; height: 22px; font-size:10px; width:calc(50% - 2px); border: none; border-radius:2px; color:#fff;} .scrollspy-debug-button:hover {opacity: 0.8; cursor: pointer;} #scrollspy-debug-close {background:#cc3300;} .scrollspy-debug-wrapper p {margin: 7px 0 7px 0;} .scrollspy-debug-wrapper a {text-decoration:none; color:#669900;}</style>';
				body.appendChild(wrapper);
				app.addEventListeners({
					selector: document.querySelector("#scrollspy-debug-refresh"),
					action: "click",
					callback: app.refreshValues
				});
				app.addEventListeners({
					selector: document.querySelector("#scrollspy-debug-close"),
					action: "click",
					callback: function() {
                    	document.querySelector(".scrollspy-debug-wrapper").remove(0);
                	}
				});
            }
        },
        scroll: function() {
            var documentHeight = document.body.scrollHeight;
            var currentPosition = window.pageYOffset + window.innerHeight;
            var currentPercentage = Math.round((currentPosition / documentHeight) * 100);
            var levelLength = config.levels.length;
            for (var i = 0; i < levelLength; i++) {
                var level = parseInt(config.levels[i]);
                if (currentPercentage >= level) {
                    if (config.values.indexOf(level) == -1) {
                        var greaterThan = true;
                        var valueLength = config.values.length;
                        for (var l = 0; l < valueLength; l++) {
                            if (config.values[l] >= level) {
                                greaterThan = false;
                            }
                        }
                        if (greaterThan) {
                            config.values.push(level);
                            app.reportData({
								category: "Scroll Spy",
								action: level + '%',
								label: document.location.pathname,
								value: config.seconds
							});
                        }
                    }
                    break;
                }
            }
        },
        refreshValues: function() {
            document.querySelector(".scrollspy-debug-message").innerHTML = "";
            config.values = [];
            config.seconds = 0;
        },
        reportData: function(data) {
            if (config.debug) { 
                if (data.value >= 60) {
                    data.value = Math.round(data.value / 60) + " minutes";
                } else {
                    data.value = data.value + " seconds";
                }
                app.log('<p>Scroll Spy detected that the visitor has scrolled <strong>' + data.action + '</strong> of the page. It took about <strong>' + data.value + '</strong>.</p>');
            } else {
                if (config.analytics == "universal") {
                    window.ga('send', 'event', data.category, data.action, data.label, data.value, {'nonInteraction': true});
                } else if (config.analytics == "classic") {
                    window._gaq.push(['_trackEvent', data.category, data.action, data.label, data.value, true]);
                }
            }
        },    
        log: function(msg) {
            if (config.debug) {
                if (document.querySelector(".scrollspy-debug-message")) {
                    document.querySelector(".scrollspy-debug-message").innerHTML = msg;
                }
				var date = new Date();
                var time = date.toLocaleTimeString();
				var consoleMessage = msg.replace(/<p>|<\/p>|<strong>|<\/strong>/gi, "")
                window.console.log(time + ' [DEBUG MODE] ' + consoleMessage);
            }
        }    
    };

    app.getDOMstate();
    
})();