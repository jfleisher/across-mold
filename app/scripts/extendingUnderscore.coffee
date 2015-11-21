define [
  'underscore'
  'helpers'
], (_) ->

  _.mixin capitalize: (string) ->
    string.charAt(0).toUpperCase() + string.substring(1).toLowerCase()
  _.mixin validateEmail: (email) ->
    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
    re.test(email)
  _.mixin cleanFileName: (file) ->
    file.toLowerCase().replace(/\s/g, "X")
  _.mixin alphabetizeArray: (array) ->
    array.sort()
  _.mixin cleanUriComponents: (str) ->
    encodeURIComponent(str)
  _.mixin decodeSearchTerm: (str) ->
    decodeURIComponent(str)

  @
