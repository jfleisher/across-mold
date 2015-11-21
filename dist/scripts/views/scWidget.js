(function() {
  var actionButtons, addEvent, clearConsole, consoleBox, eventKey, eventName, forEach, getWidgetOptions, getterButtons, host2widgetBaseUrl, iframe, reloadButton, updateConsole, widget, widgetLinks, widgetUrl, widgetUrlInput, _fn;

  addEvent = function(element, eventName, callback) {
    if (element.addEventListener) {
      return element.addEventListener(eventName, callback, false);
    } else {
      return element.attachEvent(eventName, callback, false);
    }
  };

  clearConsole = function() {
    return consoleBox.value = "";
  };

  updateConsole = function(value) {
    return consoleBox.value = value + "\n" + consoleBox.value;
  };

  getWidgetOptions = function() {
    var optionInputs, widgetOptions;
    optionInputs = document.querySelectorAll(".widgetOptions input");
    widgetOptions = {};
    forEach.call(optionInputs, function(option) {
      return widgetOptions[option.id] = (option.type === "text" ? option.value : option.checked);
    });
    return widgetOptions;
  };

  host2widgetBaseUrl = {
    "wt.soundcloud.dev": "wt.soundcloud.dev:9200/",
    "wt.soundcloud.com": "wt.soundcloud.com/player/",
    "w.soundcloud.com": "w.soundcloud.com/player/"
  };

  consoleBox = document.querySelector(".console");

  forEach = Array.prototype.forEach;

  widgetUrl = "http://api.soundcloud.com/users/1539950/favorites";

  consoleBox.value = "Loading...";

  iframe = document.querySelector(".iframe");

  iframe.src = location.protocol + "//" + host2widgetBaseUrl[location.hostname] + "?url=" + widgetUrl;

  widget = SC.Widget(iframe);

  eventKey = void 0;

  eventName = void 0;

  _fn = function(eventName, eventKey) {
    eventName = SC.Widget.Events[eventKey];
    return widget.bind(eventName, function(eventData) {
      return updateConsole("SC.Widget.Events." + eventKey + " " + JSON.stringify(eventData || {}));
    });
  };
  for (eventKey in SC.Widget.Events) {
    _fn(eventName, eventKey);
  }

  actionButtons = document.querySelectorAll(".actionButtons button");

  forEach.call(actionButtons, function(button) {
    return addEvent(button, "click", function(e) {
      var input, value;
      if (e.target !== this) {
        e.stopPropagation();
        return false;
      }
      input = this.querySelector("input");
      value = input && input.value;
      return widget[this.className](value);
    });
  });

  getterButtons = document.querySelectorAll(".getterButtons button");

  forEach.call(getterButtons, function(button) {
    return addEvent(button, "click", function(e) {
      return widget[this.className](function(value) {
        return updateConsole(button.getAttribute("caption") + " " + JSON.stringify(value));
      });
    });
  });

  widgetLinks = document.querySelectorAll(".widgetLinks a");

  widgetUrlInput = document.querySelector(".urlInput");

  forEach.call(widgetLinks, function(link) {
    return addEvent(link, "click", function(e) {
      widgetUrlInput.value = this.getAttribute("href");
      return e.preventDefault();
    });
  });

  reloadButton = document.querySelector(".reload");

  addEvent(reloadButton, "click", function() {
    var widgetOptions;
    clearConsole();
    widgetOptions = getWidgetOptions();
    widgetOptions.callback = function() {
      return updateConsole("Widget is reloaded.");
    };
    return widget.load(widgetUrlInput.value, widgetOptions);
  });

}).call(this);
