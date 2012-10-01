// Generated by CoffeeScript 1.3.3
(function() {
  var handleFocus, handleLoadEvent, handleMessage, pageState;

  if (window === window.top) {
    pageState = false;
    handleMessage = function(msgEvent) {
      var body, regex;
      if (msgEvent.name === "crispy-toggle") {
        body = document.body;
        if (document.getElementsByClassName("bvr-crispy-ext").length === 0) {
          body.className += " bvr-crispy-ext";
          safari.self.tab.dispatchMessage("crispyScript", "on");
          return pageState = true;
        } else {
          regex = new RegExp('(\\s|^)bvr-crispy-ext(\\s|$)');
          body.className = body.className.replace(regex, ' ');
          safari.self.tab.dispatchMessage("crispyScript", "off");
          return pageState = false;
        }
      }
    };
    handleLoadEvent = function() {
      safari.self.tab.dispatchMessage("crispy-load", location);
    };
    handleFocus = function() {
      safari.self.tab.dispatchMessage("crispy-state", pageState);
    };
    window.addEventListener("pageshow", handleLoadEvent, true);
    window.addEventListener("focus", handleFocus, false);
    safari.self.addEventListener("message", handleMessage, false);
  }

}).call(this);
