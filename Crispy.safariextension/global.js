// Generated by CoffeeScript 1.3.3
(function() {
  var app, baseURI, extension, handleBeforeNavigate, handleCommand, handleMessage, handleValidate, toolbarButton, turnOffButton, turnOnButton;

  extension = safari.extension;

  baseURI = extension.baseURI;

  app = safari.application;

  toolbarButton = function(window) {
    var toolbarItem, _i, _len, _ref;
    _ref = extension.toolbarItems;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      toolbarItem = _ref[_i];
      if (toolbarItem.browserWindow === window) {
        return toolbarItem;
      }
    }
  };

  turnOnButton = function(button) {
    button.image = "" + extension.baseURI + "icon-blurry.png";
    return button.label = button.toolTip = 'Off';
  };

  turnOffButton = function(button) {
    button.image = "" + extension.baseURI + "icon.png";
    return button.label = button.toolTip = 'On';
  };

  handleCommand = function(event) {
    var button, tab;
    button = event.target;
    tab = button.browserWindow.activeTab;
    if (button.label === 'On') {
      turnOnButton(button);
      tab.page.dispatchMessage("crispy-toggle", '');
    } else {
      turnOffButton(button);
      return tab.page.dispatchMessage("crispy-toggle", '');
    }
  };

  handleValidate = function(event) {
    var button, tab;
    button = event.target;
    tab = button.browserWindow.activeTab;
    if (!tab || (!tab.isLoading && (!tab.page || !tab.url))) {
      button.disabled = true;
      return turnOnButton(button);
    } else {
      button.disabled = false;
      if (tab.isLoading) {
        return turnOnButton(button);
      }
    }
  };

  handleMessage = function(event) {
    var button, tab;
    tab = event.target;
    if (tab === tab.browserWindow.activeTab) {
      button = toolbarButton(tab.browserWindow);
      if (event.name === "crispyScript") {
        switch (event.message) {
          case 'off':
            return turnOnButton(button);
          case 'on':
            return turnOffButton(button);
        }
      } else if (event.name === "crispy-load") {
        if (event.message.protocol === "bookmarks:" || event.message.protocol === "topsites:") {
          button.disabled = true;
          return turnOnButton(button);
        } else if (event.message.host.indexOf("pixeljoint") > -1) {
          turnOffButton(button);
          return tab.page.dispatchMessage("crispy-toggle", '');
        } else {
          return turnOnButton(button);
        }
      } else if (event.name === "crispy-state") {
        switch (event.message) {
          case true:
            return turnOffButton(button);
          case false:
            return turnOnButton(button);
        }
      }
    }
  };

  handleBeforeNavigate = function(event) {
    var button, tab;
    tab = event.target;
    tab.isLoading = event.url !== null;
    if (tab === tab.browserWindow.activeTab) {
      button = toolbarButton(tab.browserWindow);
      if (!button) {
        return;
      }
      if (event.url) {
        button.disabled = false;
        return turnOnButton(button);
      } else {
        button.disabled = true;
        return turnOnButton(button);
      }
    }
  };

  app.addEventListener("command", handleCommand, false);

  app.addEventListener("message", handleMessage, false);

  app.addEventListener("validate", handleValidate, false);

  app.addEventListener("beforeNavigate", handleBeforeNavigate, true);

}).call(this);
