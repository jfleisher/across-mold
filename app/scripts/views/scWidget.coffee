  addEvent = (element, eventName, callback) ->
    if element.addEventListener
      element.addEventListener eventName, callback, false
    else
      element.attachEvent eventName, callback, false
  clearConsole = ->
    consoleBox.value = ""
  updateConsole = (value) ->
    consoleBox.value = value + "\n" + consoleBox.value
  getWidgetOptions = ->
    optionInputs = document.querySelectorAll(".widgetOptions input")
    widgetOptions = {}
    forEach.call optionInputs, (option) ->
      widgetOptions[option.id] = (if option.type is "text" then option.value else option.checked)

    widgetOptions
  host2widgetBaseUrl =
    "wt.soundcloud.dev": "wt.soundcloud.dev:9200/"
    "wt.soundcloud.com": "wt.soundcloud.com/player/"
    "w.soundcloud.com": "w.soundcloud.com/player/"

  consoleBox = document.querySelector(".console")
  forEach = Array::forEach
  widgetUrl = "http://api.soundcloud.com/users/1539950/favorites"
  consoleBox.value = "Loading..."
  iframe = document.querySelector(".iframe")
  iframe.src = location.protocol + "//" + host2widgetBaseUrl[location.hostname] + "?url=" + widgetUrl
  widget = SC.Widget(iframe)
  eventKey = undefined
  eventName = undefined
  for eventKey of SC.Widget.Events
    ((eventName, eventKey) ->
      eventName = SC.Widget.Events[eventKey]
      widget.bind eventName, (eventData) ->
        updateConsole "SC.Widget.Events." + eventKey + " " + JSON.stringify(eventData or {})

    ) eventName, eventKey
  actionButtons = document.querySelectorAll(".actionButtons button")
  forEach.call actionButtons, (button) ->
    addEvent button, "click", (e) ->
      if e.target isnt this
        e.stopPropagation()
        return false
      input = @querySelector("input")
      value = input and input.value
      widget[@className] value


  getterButtons = document.querySelectorAll(".getterButtons button")
  forEach.call getterButtons, (button) ->
    addEvent button, "click", (e) ->
      widget[@className] (value) ->
        updateConsole button.getAttribute("caption") + " " + JSON.stringify(value)



  widgetLinks = document.querySelectorAll(".widgetLinks a")
  widgetUrlInput = document.querySelector(".urlInput")
  forEach.call widgetLinks, (link) ->
    addEvent link, "click", (e) ->
      widgetUrlInput.value = @getAttribute("href")
      e.preventDefault()


  reloadButton = document.querySelector(".reload")
  addEvent reloadButton, "click", ->
    clearConsole()
    widgetOptions = getWidgetOptions()
    widgetOptions.callback = ->
      updateConsole "Widget is reloaded."

    widget.load widgetUrlInput.value, widgetOptions
