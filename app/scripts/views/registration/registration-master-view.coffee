define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'select2'
  'modal'
  'templates'

  #'user-model'
  #'user-profile-model'
  ], (Mi, Support, Parse, $) ->
  class Mi.Views.RegistrationMasterView extends Support.CompositeView
    signUpTemplate:             JST['app/scripts/templates/registration/registrationSignUpTemplate']
    uploadUserPhotoTemplate:    JST['app/scripts/templates/registration/registrationUploadUserPhotoTemplate']
    chooseProfileTemplate:      JST['app/scripts/templates/registration/registrationChooseProfileTemplate']
    confirmMobileTemplate:      JST['app/scripts/templates/registration/registrationConfirmMobileTemplate']

    className: 'registration-master wrapper'

    events:
      'click .profile-button'           :   'toggleActiveProfile'
      'click #submit-registration-1'    :   'createNewUser'
      'click #submit-registration-2'    :   'uploadImage'
      'click #submit-registration-3'    :   'createNewProfile'
      'change #imgUpload'               :   'grabImage'
      'click #submit-login'             :   'userLogin'
      'focusout .dob-input'             :   'verifyAge'
      'click #start-search'             :   'startMobileSearch'


    initialize: ->
      console.log 'RegistrationView initialized'

    render: ->
      @$el.append @signUpTemplate()
      setTimeout =>
        @appendCheckbox()
      , 1000
      return @

    startMobileSearch: ->
      @mobileMenu.handleSearchMenu()
      $('#registration-confirm-mobile').remove()

    appendCheckbox: ->
      # horrible inline html because spam bots are bad
      $(".terms-of-service").html("<input type='checkbox' name='verifyCheckbox' id='verifyCheckbox' /><span class='terms-text'>I agree to the <a href='#/microsite/terms' target='makeitglobalterms'>Terms &amp; Agreement</a></span>")

    verifyAge: ->
      console.log 'verifyAge called'

      inputAge = $(".dob-input").val()
      splitAge = inputAge.split("/")
      # console.log splitAge
      eighteenInSecs = 567648000


      ageInSecs = (new Date().getTime() - new Date(inputAge).getTime()) / 1000
      console.log 'age in seconds',ageInSecs
      if ( splitAge.length < 3 )
        console.log 'invalid date'
      if ( ageInSecs > eighteenInSecs )
        $(".underage-warning").hide()
        console.log 'over 18!'
      else
        $(".underage-warning").show()
        console.log 'under 18!'

    registrationStepTwo: ->
      @chosenProfileType = '_3d_printing'
      @$el.html('')
      @$el.append @chooseProfileTemplate(Mi: Mi)
      new Mi.Views.MenuView user: Parse.User.current()


    toggleActiveProfile: ( event ) ->
      $(".profile-button").removeClass "selected-profile"
      $(event.target).addClass "selected-profile"
      $(".profile-selection-desc").hide()
      targetedProfile = $(event.target).data("profiletype")
      $("#"+targetedProfile+"-desc").show()
      # assign selected profile to a variable for next step
      @chosenProfileType = $(event.target).data("profiletype")

    validEmail: (email) ->
      parts = email.split('@')
      if parts.length != 2
        return false
      if !parts[0] || parts[0].length == 0
        return false
      if !parts[1] || parts[1].length == 0
        return false

      domainParts = parts[1].split('.')
      if domainParts.length != 2
        return false

      return true

    createNewUser: ->
      acctEmail = $(".email-input").val().toLowerCase()
      if !@validEmail(acctEmail)
        window.Mi.messagesRouter.showMessage('Account email is not valid')
        return

      if $('input.parent-email:visible').length
        parentEmail = $('input.parent-email').val().toLowerCase()
        if parentEmail.toUpperCase() == acctEmail.toUpperCase()
          window.Mi.messagesRouter.showMessage('Email addresses must be different.')
          return

        if !@validEmail(parentEmail)
          window.Mi.messagesRouter.showMessage('Parent or guardian email is not valid.')
          return

      if parentEmail
        window.Mi.messagesRouter.sendUnder18Email(parentEmail, parentEmail)

      @createUserOnParse()

    minorSignupSubject: "Courtesy notification: across-mold.com account created"

    minorSignupMessage: () ->
      return "This message is notification that and account was created on across-mold.com for the email " + email + ". During registration the user indicated that they are below the age of 18. Your email address was provided as contact information for parent or guardian. Please contact support@across-mold.com if you have any questions."

    createUserOnParse: =>
      @user = new Parse.User()
      @user.set("firstName", $(".first-name-input").val())
      @user.set("lastName", $(".last-name-input").val())
      @user.set("name", $(".first-name-input").val() + " " + $(".last-name-input").val())
      @user.set("email", $(".email-input").val().toLowerCase())
      @user.set("parentEmail", $(".parent-email").val().toLowerCase())
      @user.set("username", $(".email-input").val().toLowerCase())
      @user.set("password", $(".password-input").val())
      @user.set("dob", $(".dob-input").val())

      console.log 'clicked', @user
      @user.signUp null,
        success: ( user ) =>
          console.log 'new user created'
          if window.Mi.appRouter.isMobile
             @confirmMobileSignup()
          else
             @registrationStepTwo()
          @sendWelcomeEmail(user.attributes)

        error: (user, error) =>
          window.Mi.messagesRouter.showMessage("Unable to create login: " + error.message)
          console.log 'user creation failed'
          console.log 'error: ', error

    confirmMobileSignup: ->
      pType = Parse.Object.extend({ className:"Profile"})
      userProfile = new pType
      @initProfileFields(userProfile)
      console.log 'mobile signup profile created'
      userProfile.save()
      @$el.html('')
      @$el.append @confirmMobileTemplate()
      @mobileMenu = new Mi.Views.MenuView user: Parse.User.current()


    sendWelcomeEmail: (user) ->
      window.Mi.messagesRouter.sendSignupEmail(user.name, user.email)

    initProfileFields: (profile) ->
      profile.set('parent', @user)
      if(profile.get('currentlyPromoted') == undefined)
        profile.set('currentlyPromoted',false)
      if(profile.get('lastEdited') == undefined)
        profile.set('lastEdited',new Date())
      if(profile.get('organizations') == undefined)
        profile.set('organizations',[])
      if(profile.get('profileOwner') == undefined)
        profile.set('profileOwner', @user.get("email"))
      if(profile.get('profileType') == undefined)
        profile.set('profileType', @chosenProfileType)
      if(profile.get('skills') == undefined)
        profile.set('skills', [])
      if(profile.get('tags') == undefined)
        profile.set('tags', [])
      if(profile.get('profileCustomUrl') == undefined)
        profile.set('profileCustomUrl', null)
      if(profile.get('profileContactEmail') == undefined)
        profile.set('profileContactEmail', null)
      if(profile.get('profilePublished') == undefined)
        profile.set('profilePublished', false)


    createNewProfile: =>
      pType = Parse.Object.extend({ className:"Profile"})
      userProfile = new pType
      @initProfileFields(userProfile)
      console.log 'new profile created'
      # navigate to unfinished profile page after extended user is successfully saved
      userProfile.save null,
        success: ( profile ) =>
          window.Mi.appRouter.navigate("#/edit-profile/"+profile.id, {trigger: true})
          console.log 'saved profile:', profile
        error: ( profile, error ) =>
          console.log 'error saving profile: ', error
          console.log 'profile: ', profile


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
