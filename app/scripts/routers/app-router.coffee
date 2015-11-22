define [
  'site_config'
  'backbone-support'
  'parse'
  'modal'
  'menu-view'
  'profile-master-view'
  'profile-edit-view'
  'registration-master-view'
  'registration-log-in-view'
  'quotation-view'
  'dashboard-master-view'
  'dashboard-profile-view'
  'dashboard-favorite-view'
  'microsite-master-view'
  'search-master-view'
  'login-layer'
  'helpers'
  'select2'
  'gmap3'
  'parallax'
  'mandrill'

], (Mi, Support, Parse) ->
  class Mi.Routers.AppRouter extends Support.SwappingRouter

    loginTemplate:      JST['app/scripts/templates/modals/login-modal']
    messageTemplate:    JST['app/scripts/templates/modals/message-modal']
    menuTemplate:       JST['app/scripts/templates/menuTemplate']
    quotationTemplate:  JST['app/scripts/templates/modals/quotationEditTemplate']
    waitTemplate:        JST['app/scripts/templates/modals/wait-modal']
        

    routes:
      #''                                          : 'showLogin'
      ''                                          : 'showMicrosite'
      'microsite(/)(:category)'                   : 'showMicrosite'
      'display-profile(/:profileId)'              : 'showProfile'
      'register'                                  : 'showRegistration'
      'dashboard'                                 : 'forwardToDashboard'
      'dashboard(/)profiles'                      : 'showDashboard'
      'dashboard(/)favorites'                     : 'showFavorites'
      'edit-profile(/:profileId)'                 : 'editProfile'
      'search(/q/)(:term)(/)(:location)(/)'       : 'search'
      'quotation'                                 : 'editQuote'
      ':url'                                      : 'customUrl'

    isMobile: navigator.userAgent.match(/Mobi/) != null
    isSmallDisplay: $('.device-xs:visible, .device-sm:visible').length > 0

    GoogleAnalytics:
      init: (webPropertyId) ->
        @_initQueue webPropertyId
        scriptTag = @_createScriptTag()
        @_injectScriptTag scriptTag
        true

      _initQueue: (webPropertyId) ->
        window._gaq ?= []
        window._gaq.push ['_setAccount', webPropertyId]
        window._gaq.push ['_trackPageview']

      _createScriptTag: ->
        scriptTag = document.createElement 'script'
        scriptTag.type = 'text/javascript'
        scriptTag.async = true
        protocol = location.protocol
        scriptTag.src = "#{ protocol }//stats.g.doubleclick.net/dc.js"
        scriptTag

      _injectScriptTag: (scriptTag) ->
        firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore scriptTag, firstScriptTag

      trackPageView: (url) ->
        return  # google analytics not initialized
        window._gaq.push ['_trackPageview', url]

      trackEvent: (category, action, label = null, value = null, nonInteraction = null) ->
        trackedEvent = ['_trackEvent', category, action]
        for argument in [label, value, nonInteraction]
          if argument? then trackedEvent.push argument else break
        window._gaq.push trackedEvent

    loadCMS: ->
      CMS = Mi.CMS
      refreshSearchAutoComplete = Mi.Views.MenuView.prototype.initSearchAutocomplete

      pType = Parse.Object.extend("site_config")
      cfg = new Parse.Query(pType)
      cfg.find
        success: (results) =>
          console.log "config items loaded: ", results.length
          _.each results, (setting) ->
            CMS[setting.get('name')] = setting.get('value')

      ptype = Parse.Object.extend('Profile_labels')
      labels = new Parse.Query(ptype)
      labels.find
        success: (results) =>
          console.log "found field label data, results: ", results
          if results
           _.each results, (result) =>
             fld = result.get('field')
             CMS.labels[fld] = result.get('label')
             CMS.prompts[fld] = result.get('prompt')

      ptype = Parse.Object.extend('Profile_types')
      profile_types = new Parse.Query(ptype)
      profile_types.ascending('name')
      profile_types.find
       success: (results) =>
         console.log "found profile type data, results: ", results
         if results
           _.each results, (result) =>
             type = result.get('type')
             if type != 'default'
               CMS.profile_types.push(result.get('name'))
               CMS.profile_index.push(type)
             CMS.profile_desc[type] = result.get('description')

      ptype = Parse.Object.extend('Profile_skill_types')
      skill_types = new Parse.Query(ptype)
      skill_types.find
       success: (results) =>
         console.log "found profile skill types data, results: ", results
         if results
           _.each results, (result) =>
             profileType = result.get('type')
             values = result.get('skill_types')
             if values
               CMS[profileType].skill_types = _.sortBy(values, 'text')
             ptypeCustom = Parse.Object.extend('Profile_skill_types_custom')
             customQry = new Parse.Query(ptypeCustom)
             customQry.equalTo('type', profileType)
             customQry.find
               success: (results) =>
                 console.log "found custom profile skill types data, results: ", results
                 if results && results[0]
                   customValues = results[0].get('skill_types')
                   CMS[profileType].skill_types = _.sortBy(values.concat(customValues), 'text')
                   refreshSearchAutoComplete()

      ptype = Parse.Object.extend('Profile_organizations')
      organizations = new Parse.Query(ptype)
      organizations.find
       success: (results) =>
         console.log "found profile organizations data, results: ", results
         if results
           _.each results, (result) =>
             values = result.get('organizations')
             if values
               CMS[result.get('type')].organizations=_.sortBy(values, 'text')

      ptype = Parse.Object.extend('Profile_tags')
      tags = new Parse.Query(ptype)
      tags.find
       success: (results) =>
         console.log "found profile organizations data, results: ", results
         if results
           _.each results, (result) =>
             profileType = result.get('type')
             values = result.get('tags')
             if values
               CMS[profileType].tags=_.sortBy(values, 'text')
             ptypeCustom = Parse.Object.extend('Profile_tags_custom')
             customQry = new Parse.Query(ptypeCustom)
             customQry.equalTo('type', profileType)
             customQry.find
              success: (results) =>
                console.log "found custom profile tags data, results: ", results
                if results && results[0]
                  customValues = results[0].get('tags')
                  CMS[profileType].tags = _.sortBy(values.concat(customValues), 'text')
                  refreshSearchAutoComplete()

      ptype = Parse.Object.extend('Profile_certifications')
      certifications = new Parse.Query(ptype)
      certifications.find
       success: (results) =>
         console.log "found profile certifications data, results: ", results
         if results
           _.each results, (result) =>
             values = result.get('certifications')
             if values
               CMS[result.get('type')].certifications=_.sortBy(values, 'text')

      ptype = Parse.Object.extend('Profile_summary_placeholders')
      summary = new Parse.Query(ptype)
      summary.find
       success: (results) =>
         console.log "found profile summary placeholder data, results: ", results
         if results
           _.each results, (result) =>
             CMS[result.get('type')].summary_placeholder=result.get('placeholder')

      ptype = Parse.Object.extend('Profile_attributes')
      attrs = new Parse.Query(ptype)
      attrs.find
        success: (results) =>
          console.log "found profile attributes data, results: ", results
          if results
            _.each results, (result) =>
              CMS[result.get('type')].attributes[result.get('attribute')] = result.get('values')

    initNavBar: ->
      $('.fixed-navbar').html('')
      #new Mi.Views.MenuView user: Parse.User.current()

    initialize: ->
      Parse.initialize("q8RSB55zBX88cv27GWzRjXLHX3Ijk8haCfhIGbEH", "1WbjEiZ6dyiq0hxWEMciHr5jUmArpjdJjeNNVpw4")
      @currentUser = Parse.User.current()
      @loadCMS()
      #@GoogleAnalytics.init("UA-53184751-1")
      @el = $("#main-stage")


      console.log 'currentUser in router init:', @currentUser
      console.log 'AppRouter initialized, version 0.0.1'
      $('body').delegate '#menu-log-in', 'click', @userLogin
      $('body').delegate '#submit-login', 'click', @doLogin
      $('body').delegate '#submit-login-dd', 'click', @doLogin_dd

      @

    cleanStage: ->
      $('div.imageHolder').remove()
      $('#login-box').modal('hide')
      $(".modal-content").modal('hide')
      $('.modal-backdrop').remove()
      $(window).scrollTop(0)
      $('#main-stage').scrollTop(0)

    showLogin: ->
      view = new Mi.Views.LoginLayer()
      @swap view
      @initPage('Login')

    showEdit: (el) ->
      $('.popover').hide()
      $('.modal').modal('hide')
      $(el).show()


    userLogin: (doOnReturn, title) ->
      $('.popover').hide
      $('.modal').modal('hide')
      $('body').append Mi.Routers.AppRouter.prototype.loginTemplate({title: title})
      $('#login-box').modal({backdrop: 'static', keyboard: false})
      $('#login-email').focus()
      $('#login-box .modal-title').text(title)
      closeLogin = ->
        $('#login-box').modal('hide')
      $('#login-box').delegate  '#login-close','click', closeLogin
      if doOnReturn && $.isFunction(doOnReturn)
        AppRouter.loginReturnAction = doOnReturn
      else
        AppRouter.loginReturnAction = null
      new Mi.Views.MenuView user: Parse.User.current()

      @

    doLogin: ->
      console.log 'login attempted'

      username = $("#login-email").val().toLowerCase()
      pass = $("#login-password").val()
      Parse.User.logIn username, pass,
        success: ( user ) =>
          console.log 'login successful'
          $('.fixed-navbar').html('')
          new Mi.Views.MenuView user: Parse.User.current()
          $("#login-box").modal('hide').remove()
          if AppRouter.loginReturnAction
            AppRouter.loginReturnAction()
          else
            window.Mi.appRouter.navigate('#/dashboard')


        error: ( user, error )->
          alert "Login Failed: invalid email or password"
          console.log 'login failed. error: ', error
      @


    doLogin_dd: ->
      console.log 'login attempted'

      username = $("#login-email-dd").val().toLowerCase()
      pass = $("#login-password-dd").val()
      Parse.User.logIn username, pass,
        success: ( user ) =>
          console.log 'login successful'
          $('.fixed-navbar').html('')
          new Mi.Views.MenuView user: Parse.User.current()
          $("#login-box").modal('hide').remove()
          if AppRouter.loginReturnAction
            AppRouter.loginReturnAction()
          else
            window.Mi.appRouter.navigate('#/dashboard')


        error: ( user, error )->
          alert "Login Failed: invalid email or password"
          console.log 'login failed. error: ', error
      @



    search: (term, location) ->
      @cleanStage()
      view = new Mi.Views.SearchMasterView user: @currentUser, term: term, location: location
      $.extend view,
        userLogin: this.userLogin
        showProfile: this.showProfile
      @swap view
      @initPage('Search')
      @

    customUrl: (url) ->
      pType = Parse.Object.extend("Profile")
      query = new Parse.Query(pType)
      query.equalTo('profilePublished', true)
      query.equalTo('profileCustomUrl', url)
      showProfile = @showProfile
      doSearch = () ->
        window.Mi.appRouter.navigate 'search/q/'+url,
          trigger: true

      query.find
        success: (results) ->
          if results.length
            showProfile(results[0].id)
          else
            doSearch()
        error: (error) ->
          console.log "CustomUrl Error: " + error.code + " " + error.message
          doSearch()

    showMicrosite: ( category ) ->
      $('.modal').modal('hide')
      $('.stage').fadeOut 'fast', () =>
         @cleanStage()
         view = new Mi.Views.MicrositeMasterView category: category
         $.extend view,
           login: this.login
         @swap view
         @initPage(category)
         @

    standardizeProfileFields: (profile) ->
      if profile.get('currentlyPromoted') == undefined
        profile.set('currentlyPromoted', false)
      if profile.get('lastEdited') == undefined
        profile.set('lastEdited', new Date())
      if profile.get('organizations') == undefined
        profile.set('organizations', [])
      if profile.get('certifications') == undefined
        profile.set('certifications', [])
      if profile.get('profileOwner') == undefined
        profile.set('profileOwner', @user.get("email"))
      if profile.get('profileType') == undefined
        profile.set('profileType', {})
      if profile.get('skills') == undefined
        profile.set('skills', [])
      if profile.get('tags') == undefined
        profile.set('tags', [])
      if profile.get('profilePictureUrl') == undefined
        profile.set('profilePictureUrl', null)
      if profile.get('profileCustomUrl') == undefined
        profile.set('profileCustomUrl', null)
      if profile.get('profileContactEmail') == undefined
        profile.set('profileContactEmail', null)
      if profile.get('profilePublished') == undefined
        profile.set('profilePublished', false)
      if profile.get('promptedToPublish') == undefined
        profile.set('promptedToPublish', false)

      searchValues =[]
      name = profile.get('profileName')
      if name
        searchValues.push(name)
        searchValues.push(name.split(' '))
      searchValues.push(profile.get('organizations'))
      searchValues.push(profile.get('certifications'))
      searchValues.push(profile.get('profileType'))
      searchValues.push(profile.get('profileCustomUrl'))
      tags = profile.get('tags')
      if tags
        searchValues.push(tags)
        _.each tags, (val) ->
          searchValues.push(val.split(' '))

      _.each profile.get('skills'), (skill) ->
        searchValues.push(skill.skillType)

      searchValues = _.flatten searchValues
      finalSearchValues = []
      _.each searchValues, (val) ->
        if val
          finalSearchValues.push( val.toString().toLowerCase() )

      profile.set('searchValues', finalSearchValues)


    getProfileCompleteness: (profile)->
        completeness = 0
        console.log 'getProfileCompleteness called, profile to check:', profile
        if profile
          if profile.get('location') then completeness += 5
          if profile.get('tags').length then completeness += 10
          if profile.get('profileFeatures') then completeness += 10
          if profile.get('profilePictureUrl') then completeness += 10
          if profile.get('organizations') && profile.get('organizations').length then completeness += 5
          if profile.get('certifications') && profile.get('certifications').length then completeness += 5
          if profile.get('skills')
            skillheadlinePts = 20
            skillsummaryPts = 20
            skillaudioPts = 5
            skilldocPts = 5
            skillvidPts = 5
            skillphotoPts = 5
            initialSkill = profile.get('skills')[0]
            _.each profile.get('skills'), (skill) ->
              if skill.skillHeadlinePhotoUrl && skill.skillHeadlinePhotoUrl.length
                completeness += skillheadlinePts
                skillheadlinePts =0
              if skill.skillSummary
                completeness += skillsummaryPts
                skillsummaryPts = 0
              if skill.skillAudio?.soundcloud
                completeness += skillaudioPts
                skillaudioPts = 0
              if skill.skillDocuments?.length
                completeness += skilldocPts
                skilldocPts = 0
              if skill.skillVideo?.length
                completeness += skillvidPts
                skillvidPts = 0
              if skill.skillPhotos?.length
                completeness += skillphotoPts
                skillphotoPts = 0

        return completeness

    updateProfileACL: =>
      pType = Parse.Object.extend("Profile")
      qry = new Parse.Query(pType)
      qry.find
        success: (results) =>
          _.each results, (profile) ->
            parent = profile.get('parent')
            profACL = new Parse.ACL(parent)
            profACL.setPublicReadAccess(true)
            profile.setACL(profACL)
            profile.save null,
              success: (profile) =>
                console.log("set profile acl: " + profile.id + " parent:" + parent.id)

    showProfile: ( profileId ) =>
      @cleanStage()
      profileQuery = new Parse.Query("Profile")
      profileQuery.include('parent')
      profileQuery.get profileId,
        success: (profile) =>
          console.log 'profile found, rendering: ', profile
          view = new Mi.Views.ProfileMasterView profile: profile, profileId: profile.id
          $.extend view,
            userLogin: AppRouter.prototype.userLogin
          @swap(view)
          @initPage('Profile')
        error: (error) =>
          console.log "profile not found or something, err: ", error

    editProfile: ( profileId ) ->
      @cleanStage()
      console.log 'currentUser in editprofile route:', @currentUser
      view = new Mi.Views.ProfileEditView user: @currentUser, profileId: profileId
      $.extend view,
        getProfileCompleteness: this.getProfileCompleteness
        standardizeProfileFields: this.standardizeProfileFields
        login: this.login

      @swap view
      @initPage('Edit Profile')


    editQuote: (ev) =>
      @cleanStage()
      view = new Mi.Views.EditQuotationView()
      @swap view
      @initPage('Quotation')
      $('div.footer-container').remove()
      @

    showRegistration: ->
      @cleanStage()
      view = new Mi.Views.RegistrationMasterView()
      @swap view
      @initPage('Registration')
      $('div.footer-container').remove()

    initPage: (location) ->
      $('html, body').removeClass('modal-open')
      if location and location.length
        $('head title').html("Across Mold - " + location)
      else
        $('head title').html("Across Mold")

    forwardToDashboard: () =>
      this.navigate "#/dashboard/profiles", {trigger: true}

    showDashboard: (tabName)->
      setupDashboard = () =>
        @cleanStage()
        $('#account-dropdown').fadeOut()
        view = new Mi.Views.DashboardMasterView user: @currentUser, tab: tabName
        $.extend view,
          getProfileCompleteness: this.getProfileCompleteness
          standardizeProfileFields: this.standardizeProfileFields
          login: this.login
        @swap view
        @initPage('Dashboard')

      if Parse.User.current()
        setupDashboard()
      else
        @userLogin( setupDashboard, "To view dashboard, please log in." )

    showFavorites: () ->
      @showDashboard('favorites')

    showDefault: ->
      # maybe just nav to microsite as default, with further nav accessible through drop down?
      window.Mi.appRouter.navigate('/')

    editCurrentUserAccount: (event)->
      $('#account-settings-modal').remove()
      if @currentUser
        $("#account-settings-modal").remove()
        $('div.stage').append(@accountEdit( user: @currentUser.attributes))
        $(".popover").hide()
        $('.modal').modal('hide')
        $("#account-settings-modal").modal({ backdrop: 'static', keyboard: false})

    hideModal: (evt) ->
        targetModal = $(evt.currentTarget).data("closemodal")
        console.log targetModal
        $("##{targetModal}").hide()

    showModal: (el) ->
      console.log 'showModal called, el:', el
      targetModal = $(el).data("openmodal")
      $(".popover").hide()
      $('.modal').modal('hide')
      $("##{targetModal}").show()


  @
