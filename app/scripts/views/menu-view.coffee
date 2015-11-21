define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'jquery-ui'
  'select2'
  'templates'
  'jade'
  'tooltip'
  'modal'

  ], (Mi, Support, Parse, $) ->
  class Mi.Views.MenuView extends Support.CompositeView
    menuTemplate: JST['app/scripts/templates/menuTemplate'],
    accountEdit: JST['app/scripts/templates/modals/accountEdit-modal']
    thankyouMessage: JST['app/scripts/templates/modals/thankyou-modal'],
    className: 'nav-content',

    events:
      'mouseover #account-icon'           : 'showDropdown'
      'mouseover #account-icon'           : 'dropdownControl'
      'click #submit-search'              : 'createSearchUrl'
      'click #submit-search-dd'           : 'createSearchUrl_dd'
      'click .logo'                       : 'scrollToFx'
      'click .close-modal'                : 'closeModal'
      'click .open-modal'                 : 'showModal'
      'click #edit-account'               : 'editCurrentUserAccount'
      'click #logout'                     : 'logoutUser'
      'click #termslink'                  : 'termspopup'
      'click #disable-profiles'           : 'disableAccount'
      'click #delete-account'             : 'deleteAccount'
      'click #confirm-delete .close-modal': 'cancelAcctDelete'
      'click #searchmenu'                 : 'handleSearchMenu'
      'click #usermenu'                   : 'handleUserMenu'
      'click #usermenuDropdown a'         : 'handleUserMenu'
      'click #submit-login-dd'            : 'handleUserMenu'
      'onresize window'                   : 'check'
      'click #AcrossMold-logo'               : 'goMicrosite'

    initialize: (options)->
      @user = options.user
      console.log 'MenuView initialized'
      $('.fixed-navbar').html('')
      $(".fixed-navbar").append(this.el)

      @render()
      @initPlacesAutocomplete()
      @initSearchAutocomplete()
      $('div.fixed-navbar').hide()
      $(window).on('resize', @checkStageHeight)
      $(document).ready () ->
        $(window).trigger('resize')
      @

    remove: ->
      $(window).off('resize', @checkStageHeight)

    render: ->
      @$el.append @menuTemplate( { user:@user } )
      $('#searchmenuDropdown').slideUp 100
      $('#usermenuDropdown').slideUp 100
      @

    checkStageHeight: ->
      ht = $(window).outerHeight() - $('div.fixed-navbar').outerHeight() - $('div.footer-container').outerHeight()
      $('div.stage').css('min-height', ht + 'px')
      $('div.fixed-navbar').show()

    goMicrosite: ->
      $(window).scrollTop(0)
      window.Mi.parallaxScrollPos = 0
      window.Mi.appRouter.navigate("#/microsite", {trigger: true})

    showDropdown: ( event ) ->
      # console.log event.type
      $("#account-dropdown").slideDown 100, () ->
        $("#account-icon img").addClass 'active-border'

    hideDropdown: ->
      $("#account-dropdown").slideUp 100, () ->
        $("#account-icon img").removeClass 'active-border'


    initSearchAutocomplete: ->

      finalSearchSetup = ( tempTerms ) =>
        searchTerms = Mi.CMS.profile_types;

        _.each Mi.CMS.profile_index, (typeIndex) =>
          category = Mi.CMS[typeIndex]
          if category
            if category.tags then tempTerms.push category.tags
            if category.skill_types then tempTerms.push category.skill_types
            if category.certifications then tempTerms.push category.certifications
            if category.attributes
              if category.attributes.certification then tempTerms.push category.attributes.certification
              if category.attributes.certificationeducation then tempTerms.push category.attributes.certificationeducation
            if category.organizations then tempTerms.push category.organizations

        tempTerms = _.flatten(tempTerms);
        _.each tempTerms, (term) =>
          searchTerms.push(term.trim())
        searchTerms = _.uniq(searchTerms).sort()

        $("#search-term-input-dd").autocomplete
            appendTo: '#searchmenuDropdown'
            source: (req, responseFn) ->
              re = $.ui.autocomplete.escapeRegex(req.term)
              matcher = new RegExp "^" + re, "i"
              a = $.grep searchTerms, (item,index) =>
                matcher.test item
              responseFn a.slice(0, 10)

        $("#search-term-input").autocomplete
            appendTo: '.fixed-navbar '
            position:
              my: "right top"
              at: "right bottom"
            source: (req, responseFn) ->
              re = $.ui.autocomplete.escapeRegex(req.term)
              matcher = new RegExp "^" + re, "i"
              a = $.grep searchTerms, (item,index) =>
                matcher.test item
              responseFn a.slice(0, 10)

      pType = Parse.Object.extend("Profile")
      pQuery = new Parse.Query(pType)
      pQuery.equalTo('profilePublished', true)
      pQuery.find
        success:  (results) ->
          namesList = []
          _.each results, (profile) =>
            if profile.attributes.profileName
              namesList.push(profile.attributes.profileName)

          console.log "names list for search: ", namesList.length
          finalSearchSetup( _.uniq(namesList) )

        error: (results, err) ->
          console.log "error retrieving account email: ", err


    createSearchUrl: ->
      window.Mi.searchResultsScrollPos = undefined
      term = _.cleanUriComponents $("#search-term-input").val()
      location = _.cleanUriComponents $("#search-location-input").val()

      console.log 'createSearchUrl called, search terms:', term, location
      url = "#/search/q/"+term+"/"+location
      window.Mi.appRouter.navigate(url, {trigger: true,replace: false})

    createSearchUrl_dd: ->
      window.Mi.searchResultsScrollPos = undefined
      term = _.cleanUriComponents $("#search-term-input-dd").val()
      location = _.cleanUriComponents $("#search-location-input-dd").val()
      @handleSearchMenu()
      console.log 'createSearchUrl_dd called, search terms:', term, location
      url = "#/search/q/"+term+"/"+location
      window.Mi.appRouter.navigate(url, {trigger: true,replace: false})

    logoutUser: ->
      afterLogoutUser = () ->
        $('#thankyou-message').modal('hide')
        $('#thankyou-message').remove()
        new Mi.Views.MenuView user: null
        window.Mi.appRouter.navigate("microsite", {trigger: true, replace: true})

      $('body').append @thankyouMessage()
      $('body').delegate('#thankyou-message', 'click', afterLogoutUser)
      Parse.User.logOut()
      @user = null
      window.Mi.appRouter.currentUser = null

      $('#account-dropdown').fadeOut 100, () ->
      $(".popover").hide()
      $('.modal').modal('hide')
      $("#thankyou-message").modal({ backdrop: 'static', keyboard: false})

    termspopup: ->
      $('#account-dropdown').fadeOut 100, () ->
        $(".popover").hide()
        $(".terms").show()


    dropdownControl: ->
      @showDropdown()
      console.log 'dropdownControl called'
      window.dropdownTimeout = setTimeout =>
          if $("#account-dropdown").is(":hover") or $("#account-icon").is(":hover")
            clearTimeout(window.dropdownTimeout)
            @dropdownControl()
          else
            @hideDropdown()

        , 1000

    scrollToFx: ->
      console.log 'scrollToFx fired in menuview'
      panel = $('#landing-section-panel');
      if panel.length
        scrollTarget = $(panel).offset().top - 40;
        $('html,body').animate({ scrollTop: scrollTarget}, 800);

    initPlacesAutocomplete: ->
      acOptions = { types: ['(regions)'] }
      input = document.getElementById("search-location-input")
      @autocomplete = new google.maps.places.Autocomplete(input, acOptions)
      input_dd = document.getElementById("search-location-input-dd")
      @autocomplete_dd = new google.maps.places.Autocomplete(input_dd, acOptions)

    closeModal: (event)->
      modalname = $(event.target).data('closemodal')
      $('#'+modalname).modal('hide')

    showModal: (event) ->
      console.log 'showModal called, eventTarget:', event.target
      if (event.target.id == "welcome-modal")
        modalID = $(event.target).data("modal")
        $("#"+modalID).modal({ backdrop: 'static', keyboard: false})
      else
        targetModal = $(event.target).data("openmodal")
        # because the data isn't available after initial creation
        if targetModal == 'titleSectionEdit' then $(".edit-profile-name").val($(".title-name").html())

        $(".popover").hide()
        $('.modal').modal('hide')
        $("##{targetModal}").show()

    editCurrentUserAccount: (event)->
      MenuView.prototype.removeAccountEdit()
      @hideDropdown()
      if @user
        $('#wrap').append @accountEdit( user: @user.attributes)
        $(".popover").hide()
        $('.modal').modal('hide')
        $('html, body').animate {scrollTop: $('#account-settings-modal').offset().top - 100}

        user = @user
        saveAcct = @saveAccountSettings
        $(document).delegate '.close-modal', 'click', @closeModal
        $(document).delegate '#save-account-settings',  'click',  () -> saveAcct(user)
        $(document).delegate '#delete-account', 'click',  @confirmAccountDelete
        $(document).delegate '#disable-profiles', 'click', MenuView.prototype.disableAccount
        $(document).delegate '#delete-account-confirmed', 'click', MenuView.prototype.deleteAccount
        $(document).delegate '#confirm-delete-modal .close-modal', 'click', MenuView.prototype.closeModal
        $("#account-settings-modal").modal({ backdrop: 'static', keyboard: false})


    removeAccountEdit: ->
      $('#account-settings-modal').remove()
      $('#confirm-delete-modal').remove()
      $(document).undelegate '.close-modal', 'click', @closeModal
      $(document).undelegate '#save-account-settings',  'click',  () -> saveAcct(user)
      $(document).undelegate '#delete-account', 'click',  @confirmAccountDelete
      $(document).undelegate '#disable-profiles', 'click', MenuView.prototype.disableAccount
      $(document).undelegate '#delete-account-confirmed', 'click', MenuView.prototype.deleteAccount
      $(document).undelegate '#confirm-delete-modal .close-modal', 'click', MenuView.prototype.closeModal

    saveAccountSettings: (user) ->

      validateEmail =  (eAddr)->
        if !eAddr
          return false
        if eAddr.length < 4
          return false
        return true;

      user.set('firstName', $('#acntfirst').val())
      user.set('lastName', $('#acntlast').val())
      newPwd = $('#acct-new-password').val()
      confirmPwd = $('#acct-confirm-password').val()
      newEmail = $('#acntemail').val().toLowerCase()

      emailOk = validateEmail(newEmail)
      if emailOk
        user.set('username', newEmail)
        user.set('email', newEmail)
        user.setEmail(newEmail)
      else
        alert 'Invalid Email'
        return

      if !newPwd || !newPwd.length || newPwd == confirmPwd
        if newPwd && newPwd.length
          user.set('password', newPwd)

        user.save null,
          success: (result) ->
            $('.dashboard-name').text('Hello, ' + result.get('firstName'))
            $('#account-settings-modal').modal('hide')
            console.log 'account settings saved'

          error: (result)->
            window.Mi.messagesRouter.showMessage("Failed to update account: " + result)
            console.log 'failed to save account settings. error: ', result

      if newPwd != confirmPwd
        $('#acct-new-password').val('')
        $('#acct-confirm-password').val('')
        window.Mi.messagesRouter.showMessage("Passwords do not match. Please re-enter.")

    confirmAccountDelete: () ->
      $('#account-settings-modal').modal('hide')
      $('#confirm-delete-modal').modal({ backdrop: 'static', keyboard: false})

    disableAccount: ()->
      user = Parse.User.current()
      username = user.get('username')
      console.log('disableAccount: ' + user.username)
      $('#confirm-delete-modal').modal('hide')
      pType = Parse.Object.extend({ className:"Profile"})
      query = new Parse.Query(pType)
      query.equalTo("parent", user);
      query.find
          success: (results) =>
            console.log results.length, ' profiles to disable for user ' + username
            _.each results, ( profile ) =>
              profile.set('profilePublished', false)
              profile.save null
            window.Mi.appRouter.navigate("#/dashboard", {trigger: true})
          error: (error) =>
            console.log 'Error disabling profiles for user ' + username + ': ' + error



    deleteAccount: ()->
      user = Parse.User.current()
      username = user.get('username')
      console.log('disableAccount: ' + user.username)
      $('#confirm-delete-modal').modal('hide')
      pType = Parse.Object.extend({ className:"Profile"})
      query = new Parse.Query(pType)
      query.equalTo("parent", user);
      query.find
          success: (results) =>
            console.log results.length, ' profiles to delete for user ' + username
            _.each results, ( profile ) =>
              profile.destroy()
            console.log 'Delete user: ' + username
            user.destroy()
            Mi.Views.MenuView.prototype.logoutUser()
          error: (error) =>
            console.log 'Error deleting account for user ' + username + ': ' + error


    handleSearchMenu: ()->
      $('#usermenu').removeClass 'depressed'
      $('#usermenuDropdown').slideUp(100)

      if($('#searchmenu').hasClass('depressed'))
        $('#searchmenuDropdown').slideUp 100
        $('#searchmenu').removeClass 'depressed'
      else
        $('#searchmenu').addClass 'depressed'
        $('#searchmenuDropdown').slideDown(100, ()-> $('#search-term-input-dd:visible').focus())
      @

    handleUserMenu: (ev)->
      $('#searchmenu').removeClass 'depressed'
      $('#searchmenuDropdown').slideUp 100

      if(Parse.User.current())
        $('#usermenuDropdown').addClass('logged-in')
      else
        $('#usermenuDropdown').removeClass('logged-in')

      if($('#usermenu').hasClass('depressed'))
        $('#usermenuDropdown').slideUp 100
        $('#usermenu').removeClass 'depressed'
      else
        $('#usermenu').addClass 'depressed'
        $('#usermenuDropdown').slideDown(100, () -> $('#login-email-dd:visible').focus())



  @
