extension = safari.extension
baseURI = extension.baseURI
app = safari.application

toolbarButton = (window)->
  return toolbarItem for toolbarItem in extension.toolbarItems when toolbarItem.browserWindow is window

turnOnButton = (button)->
  button.image = "#{extension.baseURI}icon-blurry.png"
  button.label = button.toolTip = 'Off'
  return

turnOffButton = (button)->
  button.image = "#{extension.baseURI}icon.png"
  button.label = button.toolTip = 'On'
  return

handleCommand = (event)->
  button = event.target
  tab = button.browserWindow.activeTab
  if button.label is 'On'
    turnOnButton(button)
    tab.page.dispatchMessage("crispy-toggle",'');
    return
  else
    turnOffButton(button)
    tab.page.dispatchMessage("crispy-toggle",'');
    return

handleValidate = (event)->
  button = event.target
  tab = button.browserWindow.activeTab
  if !tab or (!tab.isLoading and (!tab.page or !tab.url))
    button.disabled = true
    turnOnButton(button)
  else
    button.disabled = false
    if tab.isLoading then turnOnButton(button)

handleMessage = (event)->
  tab = event.target
  if tab is tab.browserWindow.activeTab
    button = toolbarButton(tab.browserWindow)
    if event.name is "crispyScript"
      switch event.message
        when 'off'
          turnOnButton(button)
        when 'on'
          turnOffButton(button)
    else if event.name is "crispy-load"
      if event.message.protocol is "bookmarks:" or event.message.protocol is "topsites:"
        button.disabled = true
        turnOnButton(button)
      else if event.message.host.indexOf("pixeljoint") > -1
        turnOffButton(button)
        tab.page.dispatchMessage("crispy-toggle",'');
      else
        turnOnButton(button)
    else if event.name is "crispy-state"
      switch event.message
        when true
          turnOffButton(button)
        when false
          turnOnButton(button)

handleBeforeNavigate = (event)->
  tab = event.target
  tab.isLoading = event.url isnt null
  if tab is tab.browserWindow.activeTab
    button = toolbarButton(tab.browserWindow)
    if !button then return
    if event.url
      button.disabled = false
      turnOnButton(button)
    else
      button.disabled = true
      turnOnButton(button)


app.addEventListener "command", handleCommand, false
app.addEventListener "message", handleMessage, false
app.addEventListener "validate", handleValidate, false
app.addEventListener "beforeNavigate", handleBeforeNavigate, true