define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'modal'
  'templates'

  #'user-model'
  #'user-profile-model'
  ], (Mi, Support, Parse, $) ->
  class Mi.Views.RegistrationLogInView extends Support.CompositeView
    template: JST['app/scripts/templates/registration/registrationLogInTemplate']
    className: 'registration-login'

    events:
      'click #submit-login': 'userLogin'

    initialize: ->
      console.log 'Registration log in View initialized'


    render: ->
      @$el.append( @template )
      return @

    userLogin: ->
      console.log 'login attempted'

      username = $("#login-email").val().toLowerCase()
      pass = $("#login-password").val()
      Parse.User.logIn(username,pass,
        success: ( user ) ->
          console.log 'login successful'
        error: ( user, error )->
          console.log 'login failed. error: ', error
      )
