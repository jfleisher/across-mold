define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'select2'
  'tooltip'
  'templates'
  'modal'
  'profile-create-skill-view'
  'gmap3'
  'cropimg'

  ], (Mi, Support, Parse, $) ->
  class Mi.Views.ProfileEditView extends Support.CompositeView
    masterTemplate: JST['app/scripts/templates/profile/editProfile/profileMasterTemplate'],
    titleTemplate: JST['app/scripts/templates/profile/editProfile/profileTitleViewTemplate'],
    headingTemplate: JST['app/scripts/templates/profile/editProfile/profileHeadingViewTemplate'],
    attributesTemplate: JST['app/scripts/templates/profile/editProfile/profileAttributesViewTemplate'],
    publishButtonTemplate: JST['app/scripts/templates/profile/editProfile/profileEditPublishStatusTemplate'],
    skillButtonTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillButtonTemplate'],
    titleOrgsTemplate: JST['app/scripts/templates/profile/editProfile/profileTitleOrgs'],
    titleTagsTemplate: JST['app/scripts/templates/profile/editProfile/profileTitleTags'],
    attributesUpdateTemplate: JST['app/scripts/templates/profile/editProfile/profileAttrsUpdate'],
    skillPhotosTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillPhotosTemplate'],
    skillDocumentsTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillDocumentsTemplate'],
    skillVideosTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillVideosTemplate'],
    footerTemplate: JST['app/scripts/templates/footer'],
    profileCreatedMessage: JST['app/scripts/templates/email/profile_created'],
    profilePublishedMessage: JST['app/scripts/templates/email/profile_published'],

    # modals for entering content
    profileModals: JST['app/scripts/templates/profile/modals/modal-profileEdits'],

    className: 'profile-master wrapper',

    events:
      'click #contact-done'               : 'updateProfileSettings'
      'click #edit-profile-photo'         : 'editProfilePhoto'

      'click #upload-headline-image'      : 'uploadHeadlineImage'
      'click #upload-profile-image'       : 'uploadProfileImage'
      'click .skill-button'               : 'displaySkill'
      'click #edit-skill-type'            : 'displaySkillEdit'
      'click #update-skill'               : 'updateSkillRecord'
      'click #delete-skill-confirm'       : 'deleteProfileSkill'
      'click #delete-profile-confirm'     : 'deleteProfileRecord'
      'click .go-live-button'             : 'profileMakeLive'
      'click .go-private-button'          : 'profileMakePrivate'
      'click #consentPublish'             : 'consentPublish'
      'click #declinePublish'             : 'declinePublish'

      'click .open-modal'                 : 'showModal'
      'click .close-modal'                : 'hideModal'

      'click #saveProfileBasics'          : 'saveProfileBasics'

      'click #save-features'              : 'updateProfileFeatures'
      'click #save-title-info'            : 'updateProfileTitle'
      'click #save-location'              : 'updateProfileLocation'

      'change #headlineImgUpload'         : 'grabImage'
      'change #profileImgUpload'          : 'grabImage'

      'click #edit-headline-image'        : 'editSkillHeadlineImage'
      'click #delete-headline-image'      : 'deleteSkillHeadlineImage'

      'click #add-skill'                  : 'newSkillModal'
      'click .submit-new-skill'           : 'newSkillAdd'

      'click #edit-location'              : 'editLocation'
      'click .clear-location-input'       : 'clearMapInput'
      'change #gmap-input'                : 'updateMapPreview'
      'keypress #gmap-input'              : 'editMapKeyPress'
      'blur #gmap-input'                  : 'updateMapPreview'

      'keyup #prof-url'                   : 'updateCustomUrlKeyUp'

    initialize: ( options ) ->
      $('body')
      $('.footer-container').remove()
      $(window).on('resize', @resizeImages)
      @user = Parse.User.current()
      if !@user
        Backbone.history.navigate('#/microsite', {trigger: true})
        return


      $(".upper-bkgd").css('height', '530px')

      new Mi.Views.MenuView user: Parse.User.current()

      @profileId = options.profileId
      @userProfile = undefined     #make sure it's empty to start
      console.log 'Profile edit view initialized, this user is', @user
      console.log 'Profile edit view initialized, this profile is', @profileId

      editView = this
      pType = Parse.Object.extend({className: "Profile"})

      query = new Parse.Query(pType)
      query.equalTo('parent', @user)
      query.get @profileId,
        success: (profile) ->
          console.log "Profile found: ", profile

          editView.userProfile = profile
          editView.standardizeProfileFields(profile)
          editView.appendModals(profile)
          editView.percentComplete = editView.getProfileCompleteness(profile)
        error: (profile, error)->
          console.log "Profile fetch failed: ", error
          Backbone.history.navigate('#/dashboard', {trigger: true})

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

    getProfileSkills: (profileType) ->
      profileSkills = []
      switch profileType
        when '_3d_printing' then profileSkills = Mi.CMS._3d_printing.skill_types
        when 'injection_molding' then profileSkills = Mi.CMS.injection_molding.skill_types
        when 'metal_die_casting' then profileSkills = Mi.CMS.metal_die_casting.skill_types
        when 'cnc_machining' then profileSkills = Mi.CMS.cnc_machining.skill_types
        when 'other' then profileSkills = Mi.CMS.other.skill_types
      return profileSkills

    getProfileTags: (profileType) ->
      profileTags = []
      switch profileType
        when '_3d_printing' then profileTags = Mi.CMS._3d_printing.tags
        when 'injection_molding' then profileTags = Mi.CMS.injection_molding.tags
        when 'metal_die_casting' then profileTags = Mi.CMS.metal_die_casting.tags
        when 'cnc_machining' then profileTags = Mi.CMS.cnc_machining.tags
        when 'other' then profileTags = Mi.CMS.other.tags
      return profileTags

    render: ->
      if !Parse.User.current()
        Backbone.history.navigate('#/microsite', {trigger: true})
        return

      editView = this

      initLayout = (profile) ->
        if !profile
          profile = {}

        editView.profileId = null
        editView.profileId = profile.id
        attributes = profile.attributes

        if !attributes
          attributes = {}

        editView.profileType = attributes.profileType
        editView.titleTmpl = editView.titleTemplate profile: attributes, Mi: Mi

        editView.headingTmpl = editView.headingTemplate profile: attributes, Mi: Mi
        editView.attributesTmpl = editView.attributesTemplate profile: attributes, Mi: Mi
        editView.$el.children(":not(.modal)").remove()
        editView.$el.append editView.titleTmpl, editView.headingTmpl
        editView.$el.find('.attributes-placeholder').append editView.attributesTmpl

        if (profile && profile.get && profile.get('skills').length > 3)
          $('div.skill-button.add-skill').hide()

        editView.resizeImages()

      setupPlugins = =>
        $('.footer-container').remove()
        profile = @userProfile.attributes

        # initialize select2 with proper tags according to profile type
        @profileOrgs = []
        switch profile.profileType
          when 'performer' then @profileOrgs = Mi.CMS._3d_printing.organizations
          when 'business' then @profileOrgs = Mi.CMS.injection_molding.organizations
          when 'venue' then @profileOrgs = Mi.CMS.metal_die_casting.organizations
          when 'executive' then @profileOrgs = Mi.CMS.cnc_machining.organizations
          when 'behindthescenes' then @profileOrgs = Mi.CMS.other.organizations

        @profileCertifications = []
        switch profile.profileType
          when 'performer' then @profileCertifications = Mi.CMS._3d_printing.certifications
          when 'business' then @profileCertifications = Mi.CMS.injection_molding.certifications
          when 'venue' then @profileCertifications = Mi.CMS.metal_die_casting.certifications
          when 'executive' then @profileCertifications = Mi.CMS.cnc_machining.certifications
          when 'behindthescenes' then @profileCertifications = Mi.CMS.other.certifications

        @profileSkills = @getProfileSkills(profile.profileType)
        @profileTags = @getProfileTags(profile.profileType)
        @initTooltips()
        @renderProgressBar()
        @renderInitialSkill()
        @populateSkillsListbox(@profileSkills)

        $(".privacy-select").select2
          matcher: (term, text) ->
            text.toUpperCase().indexOf(term.toUpperCase()) is 0

        if $(".equity-union-select").length
          $(".equity-union-select").select2
            matcher: (term, text) ->
              text.toUpperCase().indexOf(term.toUpperCase()) is 0
            tags: @profileOrgs
          $(".equity-union-select").select2('val', profile.organizations)

        if $(".certification-select").length
          $(".certification-select").select2
            matcher: (term, text) ->
              text.toUpperCase().indexOf(term.toUpperCase()) is 0
            tags: @profileCertifications
            $(".certification-select").select2('val', profile.certifications)

        $(".tags-select").select2
          matcher: (term, text) ->
            text.toUpperCase().indexOf(term.toUpperCase()) is 0
          tags: @profileTags
        $(".tags-select").select2('val', profile.tags)

        $(".attrs-feature-input").select2
          allowClear: true
          containerCssClass: 'attrs-feature-input'
          matcher: (term, text) ->
            text.toUpperCase().indexOf(term.toUpperCase()) is 0

        # initialize the map if the profile has a location, otherwise just init the autocomplete
        @initPlacesAutocomplete()
        if profile.location
          @initGoogleMaps("#location-map", profile.profileType, profile.latlng, profile.location)
          @resizeLocation()


      checkDom = ->
        return true
        return ($(".equity-union-select").length || $(".certification-select").length) && \
               $(".tags-select").length && \
               $(".attrs-feature-input").length && \
               $(".skill-area").length && \
               $(".skill-select").length && \
               $(".privacy-select").length

      domLoop = setInterval ->
        console.log('running!')
        if editView.userProfile
          initLayout(editView.userProfile)
        else
          initLayout()

        if checkDom()
          clearInterval(domLoop)
          setupPlugins()
          editView.updateDom('titleArea')
          $('#footer').html _this.footerTemplate()
      , 500

      @

    editProfilePhoto: ->
      profileUrl =  @userProfile.get('profilePictureUrl')

      if profileUrl && profileUrl.length
        img = $('<img></img>').attr('src', profileUrl)
      else
        img =$('<img></img>').attr('src','images/placeholder_imgs/profile_placeholder.png')

      $('#profilePicturePreview').html('').append(img)
      window.Mi.appRouter.showEdit('#profile-photo-modal')


    saveAndUpdateProgress: =>
      @standardizeProfileFields(@userProfile)
      profACL = new Parse.ACL(Parse.User.current())
      profACL.setPublicReadAccess(true)
      @userProfile.setACL(profACL)
      @userProfile.save null,
        success: (response) =>
          @renderProgressBar()
          @scanForCustomTags(@userProfile.get('tags'), @profileType)
          @profileSkills = @getProfileSkills(@profileType)
          @profileTags = @getProfileTags(@profileType)

    scanForCustomTags: (tagList, profileType) =>
      newTags = []
      existingTags = @profileTags
      _.each tagList, (tag) ->
        index = existingTags.indexOf(tag)
        if index == -1
          newTags.push(tag)
      if newTags.length
        @addCustomSkillTags(newTags, profileType)


    addCustomSkillTags: (newTags, profileType) =>
      if !newTags || !profileType || !newTags.length
        return

      pType = Parse.Object.extend('Profile_tags_custom')
      skQry = new Parse.Query(pType)
      skQry.equalTo('type', profileType)
      skQry.find
        success: (results) ->
          console.log "matching custom tags record: ", results.length
          if results.length
            customTags = results[0]
            vals = customTags.get('tags')
          else
            customTags = new pType
            customTags.set('type', profileType)
            vals = []

          _.each newTags, (tag) ->
            vals.push(tag)

          customTags.set('tags',vals.sort())
          customTags.save null,
            success: (result) ->
              window.Mi.appRouter.loadCMS()
              console.log "Added custom tags " + newTags + " for profile type of " + profileType

            error: (error) ->
              console.log "Error occurred adding custom tags " + newTags + " for profile type of " + profileType + ' - ' + error

        error: (error) ->
          console.log "Error occurred adding custom tags " + newTags + " for profile type of " + profileType + " - " + error




    profileMakeLive: ->
      @userProfile.set("profilePublished", true)
      @saveAndUpdateProgress()
      msg = @profilePublishedMessage({ profileId: @userProfile.id, profile: @userProfile.attributes})
      window.Mi.messagesRouter.sendEmail("across-mold.com", "signup@across-mold.com", "across-mold.com", "signup@across-mold.com", "Profile published: " + @userProfile.get('profileName'), msg)

    profileMakePrivate: ->
      @userProfile.set("profilePublished",false)
      @saveAndUpdateProgress()

    updateProfileType: =>
      $('#skill-select').empty()
      if $('#venue-box').prop('checked')
        $('#welcome-modal .profile-subtitle').text('Venue Profile Editor')
        @profileType = 'venue'
        @userProfile.set('profileType','venue')
        @profileSkills = @getProfileSkills('venue')
      else
        $('#welcome-modal .profile-subtitle').text('Business Profile Editor')
        @profileType = 'business'
        @userProfile.set('profileType',"business")
        @profileSkills = @getProfileSkills('business')
      @.attributesTmpl = @.attributesTemplate profile: @userProfile.attributes, Mi: Mi
      $('.attributes-area').remove()
      $('.attributes-placeholder').append(@.attributesTmpl)
      @addAttributeTooltips()
      @populateSkillsListbox(@profileSkills)

    matchLabelsToProfileType: ->
      doUpdate = () =>
        $('#skill-select-label').text(promptLabel)
        $('#profileName').attr('placeholder', @profileNamePlaceholder(@profileType))
        $('#skill-select').data('placeholder', placeholder)
        $('.skills-heading').text(skillsHeading)
        $('#new-skill-modal .profile-subtitle').text(addTitle)
        $('.skill-select span.select2-chosen').text(placeholder)
        $('#skill-edit-modal .deleteSkill-subtitle').text(renameTitle)
        $('#delete-skill').attr('value',deleteText)
        $('#skill-delete-modal .confirm-delete-subtitle').text(deleteConfirmation)
        $('#editor-title').text(editorName)
        $('#welcome-modal .profile-subtitle').text(editorName)
        try $('#add-skill').tooltip 'destroy' catch e
        $("#add-skill").tooltip
          container: 'body'
          trigger: 'hover focus'
          title: toolTipText
          placement: 'top'

      if @profileType == 'venue'
        skillsHeading = "Venues"
        renameTitle = "Rename Venue Type"
        deleteText = "Delete Venue"
        deleteConfirmation = "Are you sure you want to delete this venue?"
        promptLabel = 'Add the first Venue type for this business.'
        placeholder = 'Select a venue type'
        toolTipText = 'Add type'
        addTitle = 'Add Venue'
        editorName = 'Venue Profile Editor'
      else if @profileType == 'business'
        skillsHeading = "Services"
        renameTitle = "Rename Service"
        deleteText = "Delete Service"
        deleteConfirmation = "Are you sure you want to delete this service?"
        promptLabel='Add your first Business or Service.'
        placeholder = 'Select a product or service'
        toolTipText = 'Add service'
        addTitle = 'Add Business or Service'
        editorName = 'Business Profile Editor'
      else
        skillsHeading = "Skills"
        renameTitle = "Rename Skill"
        deleteText = "Delete Skill"
        deleteConfirmation = "Are you sure you want to delete this skill?"
        promptLabel='Add your first Skill.'
        placeholder = 'Select a skill'
        toolTipText = 'Add skill'
        addTitle = 'Add Skill'
        editorName = 'Profile Editor'
        switch @profileType
          when "performer" then editorName = 'Performer Profile Editor'
          when "executive" then editorName = 'Executive Profile Editor'
          when "behindthescenes" then editorName = 'Behind The Scenes Profile Editor'
          else editorName = 'Profile Editor'
      doUpdate()


    populateSkillsListbox: (skillTypes) ->
      skillOptions = []
      _.each skillTypes, (skill_type) ->
        skillOptions.push
          id: skill_type
          text: skill_type

      $("input.skill-select").select2
        maximumSelectionSize: 1

        matcher: (term, text) ->
          text.toUpperCase().indexOf(term.toUpperCase()) > -1

        data: skillOptions
        multiple: false
        createSearchChoice: (term, data) ->
          testfunc = () ->
            return this.text.localeCompare(term) == 0
          if $(data).filter( testfunc).length == 0
            return {id:term, text:term};

      @matchLabelsToProfileType()
      @

    checkForCustomSkill: (skillName, profileType) =>
      index = @profileSkills.indexOf(skillName)
      if index == -1
        @addCustomSkillType(skillName, profileType)

    addCustomSkillType: (skillName, profileType) =>
      pType = Parse.Object.extend('Profile_skill_types_custom')
      skQry = new Parse.Query(pType)
      skQry.equalTo('type', profileType)
      skQry.find
        success: (results) ->
          console.log "found matching custom skills: ", results.length
          if results.length
            customSkills = results[0]
            vals = customSkills.get('skill_types')
          else
            customSkills = new pType
            customSkills.set('type', profileType)
            vals = []

          vals.push(skillName)
          customSkills.set('skill_types',vals.sort())
          customSkills.save null,
            success: (result) ->
              window.Mi.appRouter.loadCMS()
              console.log "Added custom skill " + skillName + " for profile type of " + profileType
            error: (error) ->
              console.log "Error occurred adding custom skill " + skillName + " for profile type of " + profileType + ' - ' + error

        error: (error) ->
          console.log "Error occurred adding custom skill " + skillName + " for profile type of " + profileType + " - " + error



    newSkillAdd: =>
      skillName = $("#skill-type-add").select2('val')
      console.log 'newSkill called, type: ', skillName
      newSkill =
        skillType: skillName
        # add a placeholder photo/video in the future
        skillVideo: []
        skillPhotos: []
        skillAudio: {}
        skillDocuments: []
        skillHeadlinePhotoUrl: null
      skills=@userProfile.get("skills")
      skills.push(newSkill)
      @checkForCustomSkill(skillName, @profileType)

      ###########################################################################################
      # append a new skill button, remove active state of existing button, and make new skill active
      ############################################################################################
      $('img.headline-photo').attr('src','')
      @renderChildInto( new Mi.Views.ProfileCreateSkillView( skill: newSkill, profile: @userProfile, index: skills.length-1 ), ".skill-area" )
      @renderSkill(newSkill)
      container = $("<div></div>").addClass("skill-button-container")
      container.html @skillButtonTemplate( skillName: skillName, skillId: skills.length-1 )
      $(".sub-heading-nav").append container
      $("#new-skill-modal").hide()
      @toggleActive(skills.length-1, newSkill)
      @saveAndUpdateProgress()
      if @userProfile.get('skills').length > 3
        $('div.skill-button.add-skill').hide()
      @adjustSkillButtonWidth()

    saveProfileBasics: =>
      newProfileName = $("#profileName").val()
      newSkillName = $(".chosen-skill-select").select2('val')
      if !(newSkillName && newSkillName.length)
        @showMessage("Please select a service before you continue.")
        return

      @userProfile.set("profileName",newProfileName)
      @updateDom('titleArea')

      # add a new skill object to the skills array
      newSkill =
        skillType: newSkillName
        # add a placeholder photo/video in the future
        skillVideo: []
        skillPhotos: []
        skillAudio: {}
        skillDocuments: []
        skillHeadlinePhotoUrl: null

      @userProfile.get("skills").push(newSkill)
      @checkForCustomSkill(newSkillName, @userProfile.get('profileType'))

      # skill at index 0 is considered primary skill.
      skill = @userProfile.get("skills")[0]
      console.log 'skill is ', skill
      console.log 'newskill is ', newSkill

      profACL = new Parse.ACL(Parse.User.current())
      profACL.setPublicReadAccess(true)
      @userProfile.setACL(profACL)
      @userProfile.save null,
        success: ( result ) =>
          console.log 'save succesful, result:',result
          @renderProgressBar()
          @renderChildInto new Mi.Views.ProfileCreateSkillView( skill: skill, profile: @userProfile ), '.skill-area'
          @renderSkill(skill)
          container = $("<div></div>").addClass("skill-button-container")
          container.html @skillButtonTemplate( skillName: newSkillName, editSkill: true, skillId: 0)
          $(".sub-heading-nav").append container
          @toggleActive(0, skill)
          newProfileMessage = @profileCreatedMessage({ profileId: @userProfile.id, profile: @userProfile.attributes})
          window.Mi.messagesRouter.sendEmail("across-mold.com", "signup@across-mold.com", "across-mold.com", "signup@across-mold.com", "new Make It Globalprofile: " + @userProfile.get('profileName'), newProfileMessage)
        error: (error, result) =>
          console.log 'save failed for some damn reason, error: ', error
      window.Mi.appRouter.loadCMS()


      # populating profile page with data directly from input fields
      # so that the save and data display happen asynchronously
      $(".title-name").html(newProfileName)
      $("#welcome-modal").modal('hide')
      @renderSkill(newSkill)

    renderSkill: (skill) ->
      @renderSkillPhotos(skill)
      @renderSkillDocuments(skill)
      @renderSkillVideos(skill)
      @resizeImages()
      @adjustSkillButtonWidth()

    showMessage: (message) ->
      window.Mi.messagesRouter.showMessage(message)

    renderProgressBar: ->
      try $('.go-live-button').tooltip 'destroy' catch e
      try $('.go-private-button').tooltip 'destroy' catch e

      @percentComplete = @getProfileCompleteness(@userProfile)
      console.log 'renderProgressBar called, percentage complete:', @percentComplete
      $(".percentage-complete").html(@percentComplete)
      # progress bar is 500px. because math
      $(".progress-bar").css("width", (@percentComplete * 2.5))
      $("#publish-status").html @publishButtonTemplate( isPublished: @userProfile.get('profilePublished'), lessThan50: @percentComplete < 50  )
      if @percentComplete >= 50 && !@userProfile.get('promptedToPublish')
        @promptToPublish()

      $('.go-live-button').tooltip
        container: 'body'
        trigger:   'hover focus'
        title:     'Click to make this profile live'
        placement:  'bottom'

      $('.go-private-button').tooltip
        container: 'body'
        trigger:   'hover focus'
        title:     'Click to make this profile private'
        placement:  'bottom'


    promptToPublish: ->
      window.Mi.appRouter.showEdit("#prompt-user-to-publish")

    declinePublish: ->
      $("#prompt-user-to-publish").hide()
      @userProfile.set("promptedToPublish",true)
      @saveAndUpdateProgress()

    consentPublish: ->
      $("#prompt-user-to-publish").hide()
      @userProfile.set("promptedToPublish",true)
      @saveAndUpdateProgress()
      @profileMakeLive()

    titleSectionEdit: ->
      window.Mi.appRouter.showEdit("#profiletitle")

    contactInput: ->
      window.Mi.appRouter.showEdit("#profiletitle")

    updateCustomUrlKeyUp: (ev)->
      customVal = encodeURIComponent($(ev.currentTarget).val())
      if(customVal && customVal.length)
        $('div.contact-subtitle.final-url').text('www.across-mold.com/#/' + customVal)
      else
        $('div.contact-subtitle.final-url').text('www.across-mold.com/#/customUrl')

    updateProfileSettings: ->
      profileEmail = $('#prof-email').val().toLowerCase()
      profilePrivacy = $('#prof-privacy').val()
      profileUrl = encodeURIComponent($('#prof-url').val())

      editProfile = @userProfile
      updateProfile = () =>
        editProfile.set('profileContactEmail',profileEmail)
        editProfile.set('profilePublished',profilePrivacy=='Public')
        editProfile.set('profileCustomUrl',profileUrl)
        $('#contact-edit-modal').hide()
        @saveAndUpdateProgress()

      if profileUrl && profileUrl.length
        pType = Parse.Object.extend("Profile")
        urlQry = new Parse.Query(pType)
        urlQry.equalTo('profileCustomUrl', profileUrl)
        urlQry.find
          success: (results) =>
            console.log "found matching cusotom url, results: ", results
            if results
              if results.length == 0
                updateProfile()
              else if results.length == 1 && results[0].id == editProfile.id
                updateProfile()
              else
                alert('Custom URL: "' + profileUrl + '" is taken. Pick another URL.')
            else
              updateProfile()
          error: () =>
            alert('Error verifying custom url. Unable to save changes.')
      else
        updateProfile()




    updateProfileFeatures: ->
      profileFeatures = {}
      console.log 'updateProfileFeatures called'
      _.each $(".features-select-boxes select"), ( selecty ) =>
        profileFeatures[$(selecty).data("featurename")] = $(selecty).val()
      @userProfile.set("profileFeatures", profileFeatures)
      console.log 'profile object after adding features',@userProfile
      console.log 'user object after adding features',@user
      @saveAndUpdateProgress()
      $("#attributesFeaturesEdit").hide()
      @updateDom('attributesArea')

    updateProfileTitle: ->
      console.log 'updateProfileTitle called'
      if $(".edit-profile-name").val() != @userProfile.get("profileName")
        @userProfile.set("profileName", $(".edit-profile-name").val())
      tags = $(".tags-select").select2("val")
      @userProfile.set("tags", tags )
      if $(".equity-union-select").length
        @userProfile.set("organizations", $(".equity-union-select").select2("val"))
      if $(".certification-select").length
        @userProfile.set("certifications", $(".certification-select").select2("val"))
      @saveAndUpdateProgress()
      $("#titleSectionEdit").hide()
      @updateDom('titleArea')
      window.Mi.appRouter.loadCMS()

    updateDom: (areaToUpdate)->
      if areaToUpdate == 'titleArea'
        $(".title-name").html @userProfile.get("profileName")
        $(".user-tags").html @titleTagsTemplate(profile: @userProfile.attributes)

      if areaToUpdate == 'attributesArea'
        @updateProfileFeaturesTemplate()

    updateProfileFeaturesTemplate: ->
      $(".profile-features-area").html @attributesUpdateTemplate(profile: @userProfile.attributes, Mi: Mi)


    storeProfileSafeLocation: (profile, locResult) ->
      isRooftop = locResult.geometry.location_type == 'ROOFTOP'
      profileType = profile.get('profileType')
      if isRooftop 
        locality = locResult.address_components[2].long_name
        region = locResult.address_components[4].short_name
        safeLocation = locality + ', ' + region
        safeType = "APPROXIMATE"
      else
        safeLocation = locResult.formatted_address
        safeType = locResult.geometry.location_type

      loc = locResult.geometry.location
      lat = loc.lat()
      lng = loc.lng()
      safeType = locResult.geometry.location_type
      profile.set "latlng", [lat, lng]
      profile.set "lat", lat
      profile.set "lng", lng
      profile.set "locationType", safeType
      profile.set "geoLocation", new Parse.GeoPoint(lat, lng)
      profile.set "location", safeLocation
      console.log 'geocoder called, latlng of newLocation: ', safeLocation

    updateProfileLocation: ->
      newLocation = $("#gmap-input").val()

      if newLocation && newLocation.length
        geocoder = new google.maps.Geocoder()
        geocoder.geocode  address: newLocation , (results, status) =>
          if status is google.maps.GeocoderStatus.OK
            @storeProfileSafeLocation(@userProfile, results[0])
            @saveAndUpdateProgress()
            @initGoogleMaps("#location-map")
            $("#attributesLocationEdit").hide()
          else
            @userProfile.set("latlng", null)
            @userProfile.set("lat", null)
            @userProfile.set("lng", null)
            @userProfile.set("location", newLocation);
            @initGoogleMaps("#location-map")
            alert "Geocode was not successful for the following reason: " + status
          @resizeLocation()
      else
        @userProfile.set("latlng", null)
        @userProfile.set("lat", null)
        @userProfile.set("lng", null)
        @userProfile.set("location", null)
        @saveAndUpdateProgress()
        @clearProfileEditMap()

      console.log 'updateProfileLocation called, newLocation', newLocation
      $('#attributesLocationEdit').hide()


    renderInitialSkill: =>
      skill = @userProfile.get("skills")[0]
      console.log 'renderInitialSkill called, skill:', @userProfile.get("skills")[0]
      if skill
        @renderChildInto new Mi.Views.ProfileCreateSkillView( skill: skill, profile: @userProfile, index: 0 ), ".skill-area"
        @renderSkill(skill)
        @toggleActive(0, skill)
      else
        $('#profileName').attr('placeholder', @profileNamePlaceholder(@userProfile.get('profileType')))
        $("#welcome-modal").modal({ backdrop: 'static', keyboard: false})
        $('#profileName').focus()

      @adjustSkillButtonWidth()
      Mi.Views.ProfileCreateSkillView.prototype.showFirstTab(@skill)


    hideModal: ( event ) ->
      if (event.target.id != "welcome-modal")
        targetModal = $(event.target).data("closemodal")
        console.log targetModal
        $("##{targetModal}").hide()

    showModal: (event) ->
      console.log 'showModal called, eventTarget:', event.target
      if (event.target.id == "welcome-modal")
        modalID = $(event.target).data("modal")
        $("#"+modalID).modal({ backdrop: 'static', keyboard: false})
      else
        targetModal = $(event.target).data("openmodal")
        # because the data isn't available after initial creation
        if targetModal == 'titleSectionEdit'
          $(".edit-profile-name").val(@userProfile.get('profileName'))
          if $(".equity-union-select").length
            $(".equity-union-select").select2('val', @userProfile.get('organizations'))

          if $(".certification-select").length
              $(".certification-select").select2('val', @userProfile.get('certifications'))

          if $(".tags-select").length
            $(".tags-select").select2('val', @userProfile.get('tags'))


        if targetModal == 'contact-edit-modal'
          if @getProfileCompleteness then getCompleteness = @getProfileCompleteness else getCompleteness = @parent.getProfileCompleteness
          percentComplete = getCompleteness(@userProfile)
          $('#prof-email').val(@userProfile.get('profileContactEmail'))
          $('#prof-privacy').select2().prop('disabled','')
          if @userProfile.get('profilePublished')
            $('#prof-privacy').select2("val","Public")
          else
            $('#prof-privacy').select2("val","Private")
            if percentComplete < 50
              $('#prof-privacy').select2().prop('disabled','disabled')
          $('#contact-edit-modal .profile-title').text('Edit Profile Settings for ' +@userProfile.get('profileName'))

        window.Mi.appRouter.showEdit("##{targetModal}")

    profileNamePlaceholder: (profileType) ->
      switch profileType
        when 'anything'
          return 'business name'
        else
          return 'business name'
    

    initTooltips: ( event ) ->
      @addAttributeTooltips()

      $(".contact-edit").tooltip
        container: 'body'
        trigger: 'hover focus'
        title: 'Edit email, contact & sharing information for this profile'
        placement: 'bottom'

      $("#attributesSectionEdit").tooltip
        container: 'body'
        trigger: 'hover focus'
        title: 'Edit your profile picture, features, or location'
        placement: 'left'

      switch @userProfile.get('profileType')
        when undefined
          $(".title-section-icon").tooltip
            container: 'body'
            trigger: 'hover focus'
            title: 'Edit your name, certifications, or tags'
            placement: 'right'
          $("#add-skill").tooltip
            container: 'body'
            trigger: 'hover focus'
            title: 'Add Service'
            placement: 'top'
          $("#edit-skill-type").tooltip
            container: 'body'
            trigger:  'hover focus'
            title:    'Rename or delete this service'
            placement:'bottom'
        else
          $(".title-section-icon").tooltip
            container: 'body'
            trigger: 'hover focus'
            title: 'Edit your name, certifications, or tags'
            placement: 'right'
          $("#add-skill").tooltip
            container: 'body'
            trigger: 'hover focus'
            title: 'Add Service'
            placement: 'top'
          $("#edit-skill-type").tooltip
            container: 'body'
            trigger:  'hover focus'
            title:    'Rename or delete this service'
            placement:'bottom'

      $(".contact-icon").tooltip
        container: 'body'
        trigger: 'hover focus'
        title: 'Add contact email'
        placement: 'right'

      $(".headline-photo-icon").tooltip
        container: 'body'
        trigger:    'hover focus'
        title:      'Edit your headline photo'
        placement:  'bottom'


    addAttributeTooltips: ->
      $('div.attributes-photo .edit-icon').tooltip
        container: 'body'
        trigger:    'hover focus'
        title:      'Change the image that appears with profile search result'
        placement:  'right'

      $('.edit-icon.attr-section-icon').tooltip
        container: 'body'
        trigger:    'hover focus'
        title:      'Edit attributes describing this profile'
        placement:  'right'

      $('.attributes-location .edit-icon').tooltip
        container: 'body'
        trigger:    'hover focus'
        title:      'Edit the location associated with this profile'
        placement:  'right'


    appendModals: (profile) =>
      $('#profileModals').remove()
      $('#wrap').append @profileModals(Mi: Mi, profile: profile.attributes)
      $('#saveProfileBasics').click  @saveProfileBasics
      $('#venue-box').click @updateProfileType


    headlinePhotoPlaceholder: ->
      headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
      switch @userProfile.get('profileType')
        when '_3d_printing' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
        when 'injection_molding' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
        when 'metal_die_casting' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
        when 'cnc_machining' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
        when 'other' then headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg"
      return headlinePlaceHolder

    toggleActive: (index, skill)->
      @activeSkill = skill
      @activateSkillEdit(index, skill.skillType)

      $j = jQuery
      oldImage = $j 'img.headline-photo'
      oldImage.addClass 'remove'
      newImage = $('<img/>').addClass('headline-photo').css({opacity:0})
      if(skill.skillHeadlinePhotoUrl && skill.skillHeadlinePhotoUrl.length)
        $(newImage).attr('src', skill.skillHeadlinePhotoUrl)
      else
        $(newImage).attr('src', @headlinePhotoPlaceholder())
      $(newImage).insertBefore($(oldImage))

      oldImage.animate {opacity:0}, 300
      newImage.animate {opacity:1}, 300
      $(oldImage).remove()
      @addSkillToolTips()
      Mi.Views.ProfileCreateSkillView.prototype.showFirstTab(skill)
      if skill.skillSummary
        $('#summary-display').html(@linkify(skill.skillSummary))


    addSkillToolTips: ->
      $("#skill-summary-icon").tooltip
        container: 'body',
        trigger: 'hover focus',
        title: 'Edit summary description of this profile',
        placement: 'right'
      $('#skill-photo-edit-icon').tooltip
        container: 'body'
        trigger: 'hover focus'
        title: 'Edit Photo'
        placement: 'bottom'
      $("#add-skill-photo").tooltip
        container: 'body'
        trigger: 'hover focus'
        title: 'Add Photo'
        placement: 'top'
      $("#add-skill-document").tooltip
        container: 'body'
        trigger: 'hover focus'
        title: 'Add Document'
        placement: 'top'
      $("#skill-document-edit-icon").tooltip
        container: 'body'
        trigger: 'hover focus'
        title: 'Edit Document'
        placement: 'bottom'
      $('#skill-video-edit-icon').tooltip
        container: 'body'
        trigger:    'hover focus'
        title:      'Edit video link'
        placement:  'bottom'
      $('#add-skill-video').tooltip
        container: 'body'
        trigger:    'hover focus'
        title:      'Add video link'
        placement:  'top'

      switch @userProfile.get('profileType')
        when undefined
          $("#edit-skill-type").tooltip
            container: 'body'
            trigger:  'hover focus'
            title:    'Rename or delete this service'
            placement:'bottom'
        else
          $("#edit-skill-type").tooltip
            container: 'body'
            trigger:  'hover focus'
            title:    'Rename or delete this service'
            placement:'bottom'


    deactivateSkillEdit: ->
      btn = $(".skill-button.active")
      if !btn.length
        return
      skillid = btn.data("skillid")
      skillName = btn.find('div.skill-text').text()
      container=btn.parent()
      container.html @skillButtonTemplate(skillName: skillName, skillId: skillid)
      return container.find('div.skill-button')

    activateSkillEdit: (skillId, skillType)->
      @deactivateSkillEdit()

      btn = $(".skill-button[data-skillid='"+skillId+"']")
      if !btn.length
        return
      container = btn.parent()
      container.html @skillButtonTemplate(skillName: skillType, editSkill: true, skillId: $(btn).data('skillid'))
      $('.popover').hide()
      $('.modal').modal('hide')
      @activeSkillType = skillType
      container.find('div.skill-button')


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


    displaySkill: ( event ) ->
      index = $(event.currentTarget).data('skillid')
      if index >= 0
        skill = @userProfile.get('skills')[index]
        console.log 'displaySkill called, skill:', skill
        @renderChildInto( new Mi.Views.ProfileCreateSkillView( skill: skill, profile: @userProfile ), ".skill-area" )
        @renderSkill(skill)
        @toggleActive(index, skill)


    displaySkillEdit: (event) ->
      if @profileSkills.indexOf( @activeSkillType ) == -1
        @profileSkills.push(@activeSkillType)
        $('#skill-type-edit').data().select2.opts.data.push({id: @activeSkillType, text: @activeSkillType})

      $('#skill-type-edit').select2('val', @activeSkillType)
      @showModal(event)
      return false;

    adjustSkillButtonWidth: () ->
      buttons = $('.skill-button')
      if buttons.length < 2
        return

      updateWidths = () ->
        $(buttons).css('width','auto')
        availableWidth = $('.sub-heading-nav').width() - $('.skills-heading').width() - 30
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
              btnTxt = $(btn).find('.skill-text')
              if $(btnTxt).width() > 10
                $(btnTxt).css('width', $(btnTxt).width()-1 + 'px')

      setTimeout( updateWidths, 10)

    deleteProfileSkill: ( event ) ->
      skills=@userProfile.get("skills")
      deletedIndex=-1
      _.each skills, (skill, index) =>
        if @scrubbedSkillName(skill.skillType) == @scrubbedSkillName(@activeSkillType)
          console.log 'deleteSkill: ', @activeSkillType
          deletedIndex = index
        else if deletedIndex > -1
          btn = $('.skill-button[data-skillid="'+index+'"')
          $(btn).attr('data-skillid', index-1)

      if deletedIndex > -1
        skills.splice(deletedIndex, 1)
        @saveAndUpdateProgress()
        $('#skill-delete-modal').hide()
        $('.skill-button.active').parent().remove()
        @renderInitialSkill()
        if skills.length < 4
          $('div.skill-button.add-skill').show()

    updateSkillRecord: (event) =>
      newSkillName = $('#skill-type-edit').select2('val')
      if(!newSkillName)
        alert 'Skill type cannot be blank'
        return
      console.log 'updateSkill: ', @activeSkillType

      skills=@userProfile.get("skills")
      _.each skills, (skill, index) =>
        if @scrubbedSkillName(skill.skillType) == @scrubbedSkillName(@activeSkillType)
          console.log 'renameSkill: ', @activeSkillType
          skills[index].skillType=newSkillName
          @saveAndUpdateProgress()
          @activeSkillType = newSkillName
          btn = @deactivateSkillEdit()
          container = btn.parent()
          container.html @skillButtonTemplate(skillName: newSkillName, editSkill:true, skillId: index)
          $('#skill-edit-modal').hide()
          @checkForCustomSkill(newSkillName, @profileType)
          return @

    renderSkillPhotos: (skill) ->
      $('#photos-tab').html @skillPhotosTemplate(skill: skill)

    renderSkillDocuments: (skill) ->
      $('#documents-tab').html @skillDocumentsTemplate(skill: skill)

    renderSkillVideos: (skill) ->
      $('#videos-tab').html @skillVideosTemplate(skill: skill)


    deleteProfileRecord: (event) ->
      @userProfile.destroy
          success: (response) =>
            @showDashboard()
          error: (profile, error) =>
            alert('Error deleting profile: ' + error)
            @showDashboard()

    showDashboard: ->
      window.Mi.appRouter.navigate("#/dashboard")

    imgSettings:
      "profileImgUpload":
        width: 160
        height: 160
        editWidth: 160
        editHeight: 160
        resultWidth: 190
        resultHeight: 190
        preview: '#profilePicturePreview'
        enableButton: '#upload-profile-image'
        backgroundColor: '#FFFFFF'
      "headlineImgUpload":
        width: 1000
        height: 400
        editWidth: 570
        editHeight: 238
        resultWidth: 600
        resultHeight: 250
        preview: '#headlinePhotoPreview'
        enableButton: '#upload-headline-image'
        backgroundColor: '#FFFFFF'


    grabImage: ->
      imgcfg = @imgSettings[event.target.id]
      @previewArea = $(imgcfg.preview)
      $(imgcfg.enableButton).removeAttr('disabled')

      files = event.target.files || e.dataTransfer.files
      @file = files[0]

      # instantiate filereader, assign the src to the reader's onload event, and read that there data
      reader = new FileReader()
      reader.onload = ( event ) =>
        console.log 'preview area', @previewArea.selector
        pvImg = $('<img></img>').attr("src", event.target.result).load =>
          img =  new Image
          img.src = event.target.result
        @previewArea.html('').append(pvImg)
        $(pvImg).css('width',imgcfg.editWidth)
        $(pvImg).cropimg
          resultWidth: imgcfg.resultWidth
          resultHeight: imgcfg.resultHeight
          zoomDelay: 10,
          inputPrefix:'ci-'

      if @file
        reader.readAsDataURL( @file )

      return @file

    scrubbedSkillName: (skillName) ->
      return skillName.toLowerCase().replace(/\s/g, "")


    updateProfilePhoto: ( filepath ) =>
      @userProfile.set("profilePictureUrl", filepath)
      $("#profile-photo-modal").hide()
      if !@userProfile.get("profilePictureUrl")
        @userProfile.set("profilePictureUrl", filepath)
      @saveAndUpdateProgress()
      $("#profile-picture").css('background', 'url("' + filepath + '")')

    editSkillHeadlineImage: (event) ->
      @imageFile = undefined
      headlineImgUrl = @activeSkill.skillHeadlinePhotoUrl
      if headlineImgUrl && headlineImgUrl.length
        img = $('<img></img>').attr('src', headlineImgUrl)
        startCrop = false
      else
        img =$('<img></img>').attr('src',@headlinePhotoPlaceholder())
        startCrop = false

      $('#headlineImgUpload').val('')
      imgcfg = @imgSettings["headlineImgUpload"]
      $(img).width($(imgcfg.preview).width())
      $(img).height($(imgcfg.preview).height())
      $(imgcfg.preview).html('').append(img)
      $(imgcfg.enableButton).attr('disabled','disabled')
      if startCrop
        doCrop = () =>
          $(img).cropimg
              resultWidth: imgcfg.resultWidth
              resultHeight: imgcfg.resultHeight
              zoomDelay: 10,
              inputPrefix:'ci-'
        setTimeout doCrop, 100
      @showModal(event)

    deleteSkillHeadlineImage: ->
      @activeSkill.skillHeadlinePhotoUrl = null
      $("#headlinePhotoEdit").hide()
      @saveAndUpdateProgress()
      $("img.headline-photo").attr('src', @headlinePhotoPlaceholder())

    updateSkillHeadlinePhoto: ( filepath ) =>
      skills = @userProfile.get("skills")
      $j = jQuery
      activeButton = $j '.skill-button.active'
      index = activeButton.data('skillid')
      if(index==undefined)
        index=skills.length-1
      skills[index].skillHeadlinePhotoUrl = filepath
      $("#headlinePhotoEdit").hide()
      @saveAndUpdateProgress()
      $("img.headline-photo").attr('src', filepath)

    uploadHeadlineImage: ( event ) =>
      console.log 'Upload headline image'
      imgcfg = @imgSettings["headlineImgUpload"]
      doError = (err) ->
        alert 'Failed to upload image'
        console.log 'Failed to upload headline image: ', err
      @savePhoto(@file, imgcfg, @updateSkillHeadlinePhoto, doError)

    uploadProfileImage: ( event ) =>
      console.log 'Upload profile photo'
      doError = (err) ->
        alert 'Failed to upload image'
        console.log 'Failed to upload profile image: ', err
      imgcfg = @imgSettings["profileImgUpload"]
      @savePhoto(@file, imgcfg, @updateProfilePhoto, doError)

    savePhoto: (file, imgcfg, success, failure) =>
      pvwImage = $(imgcfg.preview + ' img')
      tgtTop = $(pvwImage).position().top
      tgtLeft = $(pvwImage).position().left
      scaleWidth = $(pvwImage).width()
      scaleHeight = $(pvwImage).height()
      canvas = document.getElementById('imgUtil')
      if canvas
        document.body.removeChild(canvas)

      canvas = document.createElement("canvas")
      canvas.id = 'imgUtl'
      #document.body.appendChild(canvas)
      context = canvas.getContext('2d')

      canvas.width = imgcfg.width
      canvas.height = imgcfg.height
      if imgcfg.backgroundColor
        context.fillStyle = imgcfg.backgroundColor
        context.fillRect(0,0,imgcfg.width, imgcfg.height)

      xratio = imgcfg.width/imgcfg.editWidth
      yratio = imgcfg.height/imgcfg.editHeight
      sx = tgtLeft * xratio
      sy = tgtTop * yratio
      swidth = scaleWidth * xratio
      sheight = scaleHeight * yratio

      reader = new FileReader()
      reader.onload = ( event ) =>
        console.log 'load for resizing: ', file.name
        img =  new Image
        img.onload = () ->
          context.drawImage img, sx, sy, swidth, sheight
          dataurl = canvas.toDataURL("image/jpeg")
          imgData =  {base64: dataurl.split(',')[1] }
          parseFile = new Parse.File(file.name, {base64: dataurl.substring(23)})
          parseFile.save().then(
            () ->
              success( parseFile.url() )
            () ->
              failure( parseFile.url() )
          )
        img.src = event.target.result
      reader.readAsDataURL( file )

    initPlacesAutocomplete: ->
      profile = @userProfile.attributes
      input = (document.getElementById("gmap-input"))
      @autocomplete = new google.maps.places.Autocomplete(input)

    initGoogleMaps: (mapId, profileType, latlng, location) ->
      $(mapId).gmap3('destroy')

      if !latlng
        latlng = @userProfile.get('latlng')
      if !location
        location = @userProfile.get('location')
      if !profileType
        profileType = @userProfile.get('profileType')
      locationType = @userProfile.get('locationType')

      circle = {}
      if locationType == "APPROXIMATE" or profileType == "performer" or profileType=="executive" or profileType == "behindthescenes"
        circle.options =
          center: latlng,
          radius : 10000,
          fillColor : "#008BB2",
          strokeColor : "#005BB7"
      zoom = 9

      marker = 
        address: location

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

    editMapKeyPress: (event) ->
      if event.keyCode == 13 || event.keyCode == 32
        @updateMapPreview()

    editLocation: ->
      $('#gmap-input').val( @userProfile.get('location'))
      @updateMapPreview()
      profileType = @userProfile.get('profileType')
      switch profileType
        when undefined
          placeholder = "Enter business address"
          @autocomplete.setTypes(['geocode'])
        else
          placeholder = "Enter business address"
          @autocomplete.setTypes(['geocode'])

      $('#gmap-input').attr('placeholder', placeholder)
      window.Mi.appRouter.showEdit('#attributesLocationEdit')

    clearProfileEditMap: ->
      $("#location-map").gmap3('destroy')
      $("#location-map").prepend('<img src="images/placeholder_imgs/location_placeholder_edit.jpg"/>')

    clearMapInput: ->
      $("#gmap-input").val("")
      $("#location-edit-preview").gmap3('destroy')
      $("#location-edit-preview").prepend('<img src="images/placeholder_imgs/location_placeholder_edit.jpg"/>')

    updateMapPreview: ->
      main = @
      doUpdate = ->
        newLocation = $('#gmap-input').val()
        if newLocation && newLocation.length
          geocoder = new google.maps.Geocoder()
          geocoder.geocode  address: newLocation , (results, status) =>
            if status is google.maps.GeocoderStatus.OK
              loc = results[0].geometry.location
              latlng = [loc.lat(), loc.lng()]
              main.initGoogleMaps "#location-edit-preview", main.userProfile.get('profileType'), latlng, newLocation
        else
          main.clearMapInput()
      setTimeout doUpdate, 200
  @
