define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'select2'
  'templates'

  #'user-model'
  #'user-profile-model'
  ], (Mi, Support, Parse, $) ->
  class Mi.Views.LoginLayer extends Support.CompositeView
    template: JST['app/scripts/templates/dev/loginLayer']

    className: 'login-layer'

    events:
      'click #login'             :     'loginNow'
      'keyup #login-layer-pass'  :     'checkEnterKey'

    initialize: ->
      console.log 'login layer view initialized'

    render: ->
      @$el.append @template()

      @

    loginNow: ->
      console.log 'login called'
      if $("#login-layer-pass").val() == "noble"
        window.Mi.appRouter.navigate("/")
      else
        alert "incorrect password."

    checkEnterKey: ->
      console.log 'key: ' + event.keyIndentifier
      if event.keyIdentifier == 'Enter'
        this.loginNow()
  @
