define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'modal'
  'tooltip'
  'templates'
  'dashboard-profile-view'
  'dashboard-favorite-view'
  ], (Mi, Support, Parse, $) ->
  class Mi.Views.DashboardMasterView extends Support.CompositeView
    template: JST['app/scripts/templates/dashboard/dashboardMasterViewTemplate']
    newProfileTemplate: JST['app/scripts/templates/dashboard/dashboardNewProfileTemplate'],
    footerTemplate: JST['app/scripts/templates/footer'],
    profilePublishedMessage: JST['app/scripts/templates/email/profile_published'],
    emptyFavoritesTemplate: JST['app/scripts/templates/dashboard/dashboardEmptyFavoritesTemplate'],


    className: 'dashboard-master wrapper'

    events:
      'click #add-new-profile'            : 'chooseNewProfileType'
      'click .profile-button'             : 'toggleActiveProfile'
      'mouseenter .profile-button'        : 'showHoveredProfileType'
      'mouseleave .profile-button'        : 'showSelectedProfileType'
      'click #create-new-profile'         : 'createNewProfile'
      'click .sub-nav-delete'             : 'deleteProfileFromList'
      'click #delete-profile-confirm'     : 'deleteProfileRecord'
      'click .close-modal'                : 'closeModal'
      'click .open-modal'                 : 'showModal'
      'click .dashboard-live'             : 'makeProfilePrivate'
      'click .dashboard-private'          : 'makeProfileLive'
      'click #my-profiles'                : 'goToProfiles'
      'click #my-favorites'               : 'goToFavorites'
      'click input.viewFavProfile'        : "viewFavoriteProfile"
      'click #removeFavorite'             : 'removeFavorite'


    initialize: (options)->
      # make sure to clear upper background height setting from profile edit
      $(".upper-bkgd").css('height', '')

      # console.log 'dashboard master view initialized'
      @user = options.user
      @initialTab = options.tab
 
    render: ->
      if !@user
        @user = Parse.User.current()
      $('.footer-container').remove()
      console.log 'model as seen in dashboard', @user
      @$el.append( @template({user:@user}) )
      if @initialTab == 'favorites'
        @showMyFavorites()
      else
        @showMyProfiles()
      @

    goToProfiles: ->
      window.Mi.appRouter.navigate("#/dashboard/profiles", {trigger: true})


    showMyProfiles: =>
      if @profiles && @profiles.length
        @renderProfiles @profiles
      else
        @readProfiles()

    goToFavorites: ->
      window.Mi.favoritesScrollPos = undefined
      window.Mi.appRouter.navigate("#/dashboard/favorites", {trigger: true})

    showMyFavorites: =>
      if @favorites && @favorites.length
        @renderFavorites @favorites
      else
        @readFavorites()

    readProfiles: ->
      view = this
      user = Parse.User.current()
      pType = Parse.Object.extend({ className:"Profile"})
      query = new Parse.Query(pType)
      query.equalTo "parent", user
      query.descending "updatedAt","createAt"
      query.find
          success: (results) =>
            console.log results.length, ' profiles retrieved for user ' + user.id
            view.profiles = results
            view.renderProfiles(results)
          error: (error) =>
            console.log 'Unable to read user profiles: ' + error

    renderProfiles: (profiles) ->
      $('div.dashboard-profile-area').html ''
      $('div.profile-header-buttons .button-link').removeClass('active')
      $('#my-profiles').addClass('active')
      if window.Mi.appRouter.isSmallDisplay
        $('#add-new-profile').addClass('hidden')
      else
        $('#add-new-profile').removeClass('hidden')

      # fetching to avoid race condition where the data to be rendered has not been returned yet
      _.each profiles, ( profile ) =>
        likeType = Parse.Object.extend("Profile_likes")
        qry = new Parse.Query(likeType)
        qry.equalTo('parent', profile)
        qry.find
          success:  (results) =>
            if results.length > 0
              likes = results[0].get('likes')
            else
              likes = 0
            profileSummary = new Mi.Views.DashboardProfileView(profileId: profile.id, profile: profile, profileLikes: likes)
            @appendChildTo(profileSummary, ".dashboard-profile-area")
            percentComplete=@getProfileCompleteness(profile)
            @renderProgressBar(profileSummary.$el, percentComplete)
            if window.Mi.appRouter.isMobile
              $('.sub-nav-button.edit-profile, .sub-nav-button.sub-nav-delete').addClass('hidden')
            else
              $('.sub-nav-button.edit-profile, .sub-nav-button.sub-nav-delete').removeClass('hidden')
          error: (results, err) =>
            console.log "error reading likes: ", err
            profileSummary = new Mi.Views.DashboardProfileView(profileId: profile.id, profile: profile, profileLikes: 0)
            @appendChildTo(profileSummary, ".dashboard-profile-area")
            percentComplete=@getProfileCompleteness(profile)
            @renderProgressBar(profileSummary.$el, percentComplete)


      if $('div.footer-container').length == 0
        $('#footer').html @footerTemplate()



    readFavorites: =>
      view = this
      user = Parse.User.current()
      view.favorites = []
      pType = Parse.Object.extend {className:"User_favorites"}
      query = new Parse.Query(pType)
      query.equalTo "parent", user
      query.include "profile"
      query.descending "updatedAt","createAt"
      query.find
          success: (results) =>
            console.log results.length, ' favorites retrieved for user ' + user.id
            _.each results, (fav) ->
              view.favorites.push fav.get('profile')
            view.renderFavorites(view.favorites)
          error: (error) =>
            console.log 'Unable to read user favorites: ' + error

    renderEmptyFavorites: =>
      missingFavorites = @emptyFavoritesTemplate()
      $("div.dashboard-profile-area").append missingFavorites


    renderFavorites:  (favorites)->
      $('div.dashboard-profile-area').html ''
      $('div.profile-header-buttons .button-link').removeClass('active')
      $('#my-favorites').addClass('active')
      $('#add-new-profile').addClass('hidden')

      i=0
      if favorites && favorites.length
        _.each favorites, ( profile ) =>
          i++
          likeType = Parse.Object.extend("Profile_likes")
          setScroll = () ->
            if i==favorites.length && window.Mi.favoritesScrollPos
              $(window).scrollTop(1)
              $(window).scrollTop(0)
              $('body').scrollTop(window.Mi.favoritesScrollPos)

          qry = new Parse.Query(likeType)
          qry.equalTo('parent', profile)
          qry.find
            success:  (results) =>
              if results.length > 0
                likes = results[0].get('likes')
              else
                likes = 0
              profileSummary = new Mi.Views.DashboardFavoriteView(profileId: profile.id, profile: profile, profileLikes: likes)
              @appendChildTo(profileSummary, ".dashboard-profile-area")
              setTimeout(setScroll, 0)
            error: (results, err) =>
              console.log "error reading likes: ", err
              profileSummary = new Mi.Views.DashboardFavoriteView(profileId: profile.id, profile: profile, profileLikes: 0)
              @appendChildTo(profileSummary, ".dashboard-profile-area")
      else
        @renderEmptyFavorites()

      if $('div.footer-container').length == 0
        $('#footer').html @footerTemplate()

    viewProfile: ->
      target = event.target
      profileId = $(target).data('profileid')
      Mi.Routers.AppRouter.prototype.navigate('#/display-profile/' + profileId, true)

    viewFavoriteProfile: (event)->
      window.Mi.favoritesScrollPos = $('body').scrollTop()
      target = event.target
      profileId = $(target).data('profileid')
      Mi.Routers.AppRouter.prototype.navigate('#/display-profile/' + profileId, true)



    renderProgressBar: (summaryElement, percentage)->
      console.log 'renderProgressBar called, percentage complete:', percentage
      $(summaryElement).find(".percentage-complete").html(percentage + '% complete')
      # progress bar is 500px. because math
      $(summaryElement).find(".progress-bar").css("width", percentage + "%")

    addPrivateToolTip: (el) ->
      try $(el).tooltip('destroy') catch e
      $(el).tooltip
        trigger: 'hover focus'
        title: 'Click to go Live'
        placement: 'top'
    addLiveToolTip: (el) ->
      try $(el).tooltip('destroy') catch e
      $(el).tooltip
        trigger: 'hover focus'
        title: 'Click to make Private'
        placement: 'top'

    makeProfileLive: (event) ->
      target = event.target
      profileId = $(target).data('profileid')
      profile = @getProfile(profileId)
      completeness = @getProfileCompleteness(profile)
      if completeness >= 50
        profile.set("profilePublished", true)
        profile.save null,
          success: (response) =>
            $(target).removeClass('dashboard-private').addClass('dashboard-live').text("Live")
            msg = @profilePublishedMessage({ profileId: profileId, profile: profile.attributes})
            window.Mi.messagesRouter.sendEmail("across-mold.com", "signup@across-mold.com", "across-mold.com", "signup@across-mold.com", "Profile published: " + profile.get('profileName'), msg)
            @addLiveToolTip(target)
          error: (err) =>
            console.log "error: " + err
      else
        @showMessage("Can't make this profile Live.  Profile must be at least 50% complete to go Live.")

    makeProfilePrivate: (event)->
      target = event.target
      profileId = $(target).data('profileid')
      profile = @getProfile(profileId)
      profile.set("profilePublished",false)
      profile.save null,
        success: (response) =>
          $(target).removeClass('dashboard-live').addClass('dashboard-private').text("Private")
          _this.addPrivateToolTip(target)
        error: (err) =>
          console.log "error: " + err

    getProfile: (profileId) ->
      matchingProfile = null
      _.each @profiles, (profile) =>
        if profile.id == profileId
          matchingProfile = profile
      return matchingProfile

    chooseNewProfileType: ->
      if window.Mi.appRouter.isMobile
        window.Mi.messagesRouter.showMessage('Mobile devices are too small for profile creation. Please use a desktop or laptop computer to create and edit profiles.')
      else
        @chosenProfileType = '_3d_Printing'
        console.log 'chooseNewProfileType called'
        @$el.html('')
        @$el.append @newProfileTemplate(Mi: Mi)

    toggleActiveProfile: ( event ) ->
      $(".profile-button").removeClass "selected-profile"
      $(event.target).addClass "selected-profile"
      $(".profile-selection-desc").hide()
      targetedProfile =$(event.target).data("profiletype")
      $("#"+targetedProfile+"-desc").show()
      # assign selected profile to a variable for next step
      @chosenProfileType = $(event.target).data("profiletype")

    showSelectedProfileType: (event) ->
      selBtn = $('.selected-profile')
      $(".profile-selection-desc").hide()
      targetedProfile =$(selBtn).data("profiletype")
      $("#"+targetedProfile+"-desc").show()
      # assign selected profile to a variable for next step
      @

    showHoveredProfileType: (event) ->
      $(event.target).addClass "hovered-profile"
      $(".profile-selection-desc").hide()
      targetedProfile=$(event.target).data("profiletype")
      $("#"+targetedProfile+"-desc").show()
      @

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


    deleteProfileFromList: (event)->
      if @profiles.length > 1
        profileId = $(event.target).data('profileid')
        profileType = $(event.target).data('profiletype')
        $('span.confirm-delete-subtitle').text("Are you sure you want to delete this " + profileType + " profile?")
        $('#delete-profile-confirm').data('profileid', profileId).data('profiletype', profileType)
        $('#profile-delete-modal').show()
      else
        @showMessage("This is the only profile defined for this account. You can't delete last profile.")

    showMessage: (message) ->
      window.Mi.messagesRouter.showMessage(message)

    deleteProfileRecord: (event) ->
      profileId = $(event.target).data('profileid')
      pType = Parse.Object.extend({ className:"Profile"})
      query = new Parse.Query(pType)
      query.get profileId,
        success: (profile) =>
          profileDiv = $('#profile-summary-'+profile.id).closest('div.dashboard-profile')
          $(profileDiv).slideUp '300', (-> $(this).remove())
          console.log 'deleting profile: ', profile.id
          profile.destroy null
        error: (object, error) =>
          console.log 'error deleting profile ', profile.id , ' error: ', error
      $('#profile-delete-modal').hide()

    closeModal: (event)->
      modalname = $(event.target).data('closemodal')
      $('#'+modalname).hide()

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



    deleteUserFavorite: (user, profileId, done) =>
      if !user
        console.log 'attempted to remove favorite when not logged in.'
      if !profileId
        console.log 'attempted to delete favorite but not profile id provided.'

      favQry = new Parse.Query('User_favorites')
      favQry.equalTo('parent', user)
      favQry.include('profile')
      Parse.Promise.when([favQry.find()]).then (allFavs) =>
        _.each allFavs, (fav) ->
          if fav.get('profile').id == profileId
            console.log 'remove user favorite profile id: ' + profileId
            fav.destroy
              success: (obj) ->
                console.log 'user favorite removed: ' + profileId
                done();
              error: (obj, error) ->
                console.log 'error removing user favorite: ' + error
      @

    removeFavorite: (event) =>
      target = event.target
      profileId = $(target).data('profileid')
      removeIndex = -1;
      _.each @favorites, (fav, index) ->
        if fav.id == profileId
          removeIndex = index
          return
      if removeIndex > -1
        @favorites.splice removeIndex, 1
      @deleteUserFavorite Parse.User.current(), profileId, @showMyFavorites
      @


  @
