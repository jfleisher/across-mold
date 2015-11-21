define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'select2'
  'gmap3'
  'modal'
  'templates'

  #'user-model'
  #'user-profile-model'
  'profile-skill-view'
  ], (Mi, Support, Parse, $) ->
  class Mi.Views.ProfileMasterView extends Support.CompositeView
    titleTemplate: JST['app/scripts/templates/profile/viewProfile/profileTitleViewTemplate'],
    headingTemplate: JST['app/scripts/templates/profile/viewProfile/profileHeadingViewTemplate'],
    attributesTemplate: JST['app/scripts/templates/profile/viewProfile/profileAttributesViewTemplate'],
    skillPhotosTemplate: JST['app/scripts/templates/profile/viewProfile/profileSkillPhotosTemplate'],
    skillDocumentsTemplate: JST['app/scripts/templates/profile/viewProfile/profileSkillDocumentsTemplate'],
    skillVideosTemplate: JST['app/scripts/templates/profile/viewProfile/profileSkillVideosTemplate'],
    footerTemplate: JST['app/scripts/templates/footer'],
    favoriteCreatedTemplate: JST['app/scripts/templates/modals/favorite-created-modal']

    className: 'profile-master wrapper',

    events:
      'click .skill-button'                     : 'displaySkill'
      'click .slide-navigate.photo'             : 'imageSlideShow'
      'click #share-modal'                      : 'showshare'
      'click #hide-share-modal'                 : 'hideshare'
      'click #contact-email'                    : 'contactMailTo'
      'click #save-profile'                     : 'saveProfileFavorite'
      'click #profile-like'                     : 'toggleLike'
      'click #fb-share'                         : 'fbuiShare'



    initialize: ( options ) ->
      # @options = options ||
      console.log 'ProfileMaster initialized'
      $(window).scrollTop(0)
      @profile = options.profile.attributes
      @getProfileEmail @profile
      @profileId = options.profileId
      @profileObject = options.profile
      @skill = @profile.skills[0]
      $(".upper-bkgd").css('height', '450px')
      # get the profiles objects from parse and call all methods that rely on the return
      # @fetchUser()

      setupPlugins = =>
        @initGoogleMaps "#location-map"
        @renderInitialSkill()

      pmv=@
      checkDom = ->
        return $(".title-area").length and $(".skill-area") and pmv.profileContactEmail != undefined

      footer = @footerTemplate
      domLoop = setInterval ->
        console.log('running!')
        if checkDom()
          clearInterval(domLoop)
          setupPlugins()
          $('.footer-container').remove()
          $('#footer').html footer()
      , 1000
      $(window).on('resize', @resizeImages)


    render: ->
      @renderProfile()
      @

    resizeImages: () =>
      @adjustSkillButtonWidth()
      if $('.cover-photo').length
        ht = $('.cover-photo').width() / 10 * 4
        $('.cover-photo').height(ht)

      if $('.skill-element-container').length
        ht = $('.skill-element-container').width() / 700 * 430
        $('#skill-video-slideshow, #skill-audio-player, #skill-document-slideshow, #skill-photo-slideshow').height(ht)
        videoHt = $('.skill-element-container').height() - $('.tab-navigation').height() - $('.skill-slideshow-subnav').height() + 1
        $('.skill-video-area iframe').height(videoHt)
      @resizeLocation()

    resizeLocation: () =>
      locMap = $('#location-map')
      if locMap.length
        $(locMap).height($(locMap).width())

    fbuiShare: (ev) =>
      profileUrl = @profile.profileCustomUrl
      if profileUrl && profileUrl.length
        profileUrl = "http://www.across-mold.com/#/" + profileUrl
      else
        profileUrl = "http://www.across-mold.com/#/display-profile/"+@profileId

      profileImgUrl = @profile.profilePictureUrl
      if !profileImgUrl || !profileImgUrl.length
        profileImgUrl = "http://www.across-mold.com/images/placeholder_imgs/profile_placeholder.png"

      skillSummary = "Tons of great talent and resources for your production can be found on across-mold.com."
      if @skill && @skill.skillSummary && @skill.skillSummary.length
        skillSummary = @skill.skillSummary

      FB.ui
        method: 'feed',
        name: @profile.profileName
        link: profileUrl
        picture: profileImgUrl
        caption: @profile.profileType
        description: skillSummary
        message: 'Look who I found on Across Mold!'

    toggleLike: ->
      curUser = Parse.User.current()
      profileOwner = @profileObject.get('parent')
      # don't allow owner to like their own profile
      if curUser && profileOwner && profileOwner.id == curUser.id
        console.log "Not allowed to LIKE your own profile."
        return

      if !window.Mi.likes
        window.Mi.likes = {}

      if window.Mi.likes[@profileId]
        window.Mi.likes[@profileId] *= -1
      else
        window.Mi.likes[@profileId] = 1
      increment = window.Mi.likes[@profileId]

      likeType = Parse.Object.extend("Profile_likes")
      qry = new Parse.Query(likeType)
      qry.equalTo('parent', @profileObject)
      qry.find
        success:  (results) =>
          try
            if results.length > 0
              results[0].set('likes', results[0].get('likes') + increment);
              if results[0].get('likes') > 0
                results[0].save null,
                  success: (result) =>
                    likes = result.get('likes')
                    $('#profile-like .overlay').text(likes)
                    console.log "liked profile " + @profileId + ": " + likes + " likes."
                    console.log 'saved like: ' + result
                  error: (result, err) =>
                    console.log 'error saving like ' + err
            else
              newLike = new likeType
              newLike.set('parent', @profileObject)
              newLike.set('likes', 1)
              newLike.save null,
                success: (result) ->
                  likes = result.get('likes')
                  $('#profile-like .overlay').text(likes)
                  console.log "liked profile " + @profileId + ": " + likes + " likes."
                error: (result, err) ->
                  console.log 'error saving like ' + err

          catch err
            console.log "error liking profile " + @profileId + ": " + err
        error: (results, err) ->
          console.log "error liking profile: ", err

    updateProfileLikes: ->
      likeType = Parse.Object.extend("Profile_likes")
      qry = new Parse.Query(likeType)
      qry.equalTo('parent', @profileObject)
      qry.find
        success:  (results) =>
          if results.length > 0
            likes = results[0].get('likes')
            $('#profile-like .overlay').text(likes)
        error: (results, err) ->
          console.log "error reading likes: ", err


    contactMailTo: ->
      if @profileContactEmail == null
        window.Mi.messagesRouter.showMessage("Sorry, but this profile has not provided a contact email.")
        return

      mailto = 'mailto:'+@profileContactEmail+'?subject=I discovered you on Across Mold'
      sendEmail = () ->
        window.location.href=mailto

      if Parse.User.current()
        sendEmail()
      else
        @userLogin sendEmail, "To contact, please log in or sign up."

    isUserFavorite: ->
      if Parse.User.current()
        isFavorite = false
        favQry = new Parse.Query('User_favorites')
        favQry.equalTo('parent', user)
        favQry.equalTo('profile', pObj)
        Parse.Promise.when([favQry.find()]).then (allFavs) =>
          if allFavs.length > 0
            isFavorite = true
        return isFavorite
      else
        return false

    saveProfileFavorite: ->
      pObj = @profileObject
      confirmSave = @confirmFavoriteSave

      doFavSave = (user) =>
        favType = Parse.Object.extend("User_favorites")
        favQry = new Parse.Query('User_favorites')
        favQry.equalTo('parent', user)
        favQry.equalTo('profile', pObj)
        favQry.find
          success:  (results) =>
            if results.length > 0
              confirmSave()
            else
              fav = new favType()
              fav.set('parent', user )
              fav.set('profile', pObj)
              fav.save null,
                success: (result) ->
                  console.log "favorite saved: " + result
                  confirmSave()
                error: (result, err) ->
                  console.log 'error saving favorite: ' + err

          error: (results, err) ->
            console.log "error reading favorites: ", err

      if Parse.User.current()
        doFavSave Parse.User.current()
      else
        @userLogin doFavSave, "To save a favorite, please log in or signup."


    confirmFavoriteSave: ->
      $('.modal').modal('hide')
      $('.popover').hide
      $('body').append Mi.Views.ProfileMasterView.prototype.favoriteCreatedTemplate()
      $('#favorite-created').modal({backdrop: 'static', keyboard: false})
      close = ->
        $('#favorite-created').modal 'hide'
      $('#favorite-created').delegate  '#fav-created-close','click', close

    initGoogleMaps: (mapId, profileType, latlng, location) ->
      $(mapId).gmap3('destroy')

      if !latlng
        latlng = @profile.latlng
      if !location
        location = @profile.location
      if !profileType
        profileType = @profile.profileType
      locationType = @profile.locationType

      circle = {}
      if locationType == "APPROXIMATE" or profileType == "performer" or profileType=="executive" or profileType == "behindthescenes"
        circle.options =
          center: latlng,
          radius : 10000,
          fillColor : "#008BB2",
          strokeColor : "#005BB7"
      zoom = 9

      marker = {}
      if locationType == "ROOFTOP"
        if profileType == 'business' or profileType=='venue'
          marker.address = location

      mapOptions =
        center: latlng
        zoom: zoom
        navigationControl: false
        mapTypeControl: false
        scaleControl: false
        draggable: false
        scrollwheel: false
        streetViewControl: false
        zoomControl: false

      updateMap= ->
        $(mapId).gmap3
          circle: circle
          marker: marker
          map:
            options: mapOptions

      setTimeout updateMap, 300


      console.log 'google maps init, location:', location

    getProfileEmail: (profile)->
      pmv = @
      pmv.profileContactEmail = profile.ContactEmail
      if !@profileContactEmail
        if profile.parent
          pmv.profileContactEmail = profile.parent.get('email')
        else
          pmv.profileContactEmail = null

      return pmv.profileContactEmail


    renderProfile: ->
      @$el.append @titleTemplate( profile: @profile, profileId: @profileId, profileContactEmail: @profileContactEmail )
      @$el.append @headingTemplate( profile: @profile )
      @resizeImages()
      @$el.find('.attributes-placeholder').append @attributesTemplate( profile: @profile, Mi: Mi )
      @updateProfileLikes()

    headlinePhotoPlaceholder: ->
      headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
      switch @profile.profileType
        when 'business' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
        when 'venue' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
        when 'executive' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
        when 'behindthescenes' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
      return headlinePlaceHolder



    toggleActive: (index, skill)->
      console.log "toggleActive called, skillType: ", skill.skillType
      toggle = skill.skillType.toLowerCase().replace(/\s/g, "")
      $j = jQuery
      oldImage = $j 'img.headline-photo'
      oldImage.addClass 'remove'
      newImage = $('<img/>').addClass('headline-photo').css({opacity:0})
      if(skill && skill.skillHeadlinePhotoUrl && skill.skillHeadlinePhotoUrl.length)
        $(newImage).attr('src', skill.skillHeadlinePhotoUrl)
      else
        $(newImage).attr('src', @headlinePhotoPlaceholder())
      $(newImage).insertBefore($(oldImage))

      oldImage.animate {opacity:0}, 300
      newImage.animate {opacity:1}, 300

      $(".skill-button").removeClass("active")
      $(".skill-button[data-skillid='"+index+"']").addClass("active")
      $(oldImage).remove()
      Mi.Views.ProfileSkillView.prototype.showFirstTab(@skill)
      if skill && skill.skillSummary
        $('#summary-display').html(@linkify(skill.skillSummary))


    linkify: (inputText) ->
      if !inputText
        return null

      # URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
      replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')

      # URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>')

      # Change email addresses to mailto:: links.
      replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>')


    renderInitialSkill: =>
      @renderChildInto( new Mi.Views.ProfileSkillView( profile: @profile, skill: @skill ), ".skill-area" )
      @renderSkill(@skill)
      @toggleActive(0,@skill)

    renderSkill: (skill) ->
      @renderSkillPhotos(skill)
      @renderSkillDocuments(skill)
      @renderSkillVideos(skill)
      @resizeImages()
      @adjustSkillButtonWidth()
      Mi.Views.ProfileSkillView.prototype.showFirstTab(skill)

    renderSkillPhotos: (skill, currentPhotoUrl) ->
      $('#photos-tab').html @skillPhotosTemplate(skill: skill)
      _.each skill.skillPhotos, (photo, index) =>
        if photo.photoUrl == currentPhotoUrl
          @renderActiveSkillPhoto(index)
      if !currentPhotoUrl
        @renderActiveSkillPhoto(0)


    renderActiveSkillPhoto: (index) ->
      #no-op if user has no photos
      if @skill?.skillPhotos?.length > index
        slideInt = setInterval =>
          if $("#skill-photo-slideshow li.photo-slide-"+index).length
            $("#skill-photo-slideshow li").removeClass('active')
            $("li.photo-slide-"+index).addClass('active')
            $(".skill-slideshow-subnav .slide-navigate.photo").attr("id",index)
            clearInterval(slideInt)
          else
            console.log 'no photos'

        , 500

    renderSkillDocuments: (skill, currentDocumentUrl) ->
      $('#documents-tab').html @skillDocumentsTemplate(skill: skill)
      _.each skill.skillDocuments, (document, index) =>
        if document.documentUrl == currentDocumentUrl
          @renderActiveSkillDocument(index)
      if !currentDocumentUrl
        @renderActiveSkillDocument(0)


    renderActiveSkillDocument: (index) ->
      #no-op if user has no documents
      if @skill?.skillDocuments?.length > index
        slideInt = setInterval =>
          if $("li.document-slide-"+index).length
            $("#skill-document-slideshow li").removeClass('active')
            $("li.document-slide-"+index).addClass('active')
            $(".skill-slideshow-subnav .slide-navigate.document").attr("id", index)
            clearInterval(slideInt)
          else
            console.log 'no documents'

        , 500


    renderSkillVideos: (skill, currentVideoId) ->
      $('#videos-tab').html @skillVideosTemplate(skill: skill)
      _.each skill.skillVideo, (video, index) =>
        if video.youtubeId == currentVideoId
          @renderActiveSkillVideo(index)
        if !currentVideoId
          @renderActiveSkillVideo(0)

    renderActiveSkillVideo: (index) ->
      if @skill?.skillVideo?.length > index
        slideInt = setInterval =>
          if $("li.video-slide-"+index).length
            $("#skill-video-slideshow li").removeClass('active')
            $("li.video-slide-"+index).addClass('active')
            $(".skill-slideshow-subnav .slide-navigate.video").attr("id", index)
            clearInterval(slideInt)
          else
            console.log 'no videos'

        , 500

    displaySkill: ( event ) ->
      id = $(event.currentTarget).data('skillid')
      @skill = @profile.skills[id]
      console.log 'displaySkill ' + @skill.skillType
      @renderChildInto( new Mi.Views.ProfileSkillView( profile: @profile, skill: @skill), ".skill-area" )
      @renderSkill(@skill)
      @toggleActive(id,@skill)

    adjustSkillButtonWidth: () ->
      buttons = $('.skill-button')
      if buttons.length < 2
        return

      doAdjustment = () ->
        $(buttons).css('width','auto')
        availableWidth = $('.sub-heading-nav').width() - $('.skills-heading').width() - 20
        if availableWidth < 0
          return

        avgWidth = availableWidth / buttons.length
        if avgWidth < 0
          return

        getTotalWidth = () =>
          totalWidth = 0
          _.each buttons, (btn, index) ->
            totalWidth += parseInt($(btn).width(), 10);
          return totalWidth

        while getTotalWidth() > availableWidth
          _.each buttons, (btn, index) ->
            if $(btn).width() > avgWidth
              $(btn).css('width', $(btn).width()-1 + 'px')

      setTimeout doAdjustment, 100

    showshare: ->
      $('#account-dropdown').fadeOut()
      $('.modal').modal('hide')
      $(".popover").hide()
      if $('.device-xs:visible').length
        $(".share-profile-modal").addClass('bottom').show()
      else
        $(".share-profile-modal").removeClass('bottom').show()

    hideshare: ->
      $(".share-profile-modal").hide()



  @
