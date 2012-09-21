# Make sure we arent doing this crap for all the cute iframes...
if window is window.top
  # See whether the extension is running
  pageState = false

  handleMessage = (msgEvent)->
    if msgEvent.name is "crispy-toggle"
      body = document.body
      if document.getElementsByClassName("bvr-crispy-ext").length is 0
        body.className += " bvr-crispy-ext"
        safari.self.tab.dispatchMessage "crispyScript","on"
        pageState = true
      else
        regex = new RegExp '(\\s|^)bvr-crispy-ext(\\s|$)'
        body.className = body.className.replace(regex,' ')
        safari.self.tab.dispatchMessage "crispyScript","off"
        pageState = false

  handleLoadEvent = ()->
    safari.self.tab.dispatchMessage("crispy-load", location)
  
  handleFocus = ()->
    safari.self.tab.dispatchMessage("crispy-state", pageState)
  
  window.addEventListener "pageshow", handleLoadEvent, true
  window.addEventListener "focus", handleFocus, false
  safari.self.addEventListener "message", handleMessage, false