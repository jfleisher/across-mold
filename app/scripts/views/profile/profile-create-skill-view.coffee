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
  class Mi.Views.ProfileCreateSkillView extends Support.CompositeView
    skillTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillViewTemplate'],
    skillDocumentSlideTemplate: JST['app/scripts/templates/profile/editProfile/skillDocumentSlideshowRerender'],
    publishButtonTemplate: JST['app/scripts/templates/profile/editProfile/profileEditPublishStatusTemplate'],
    skillPhotosTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillPhotosTemplate'],
    skillDocumentsTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillDocumentsTemplate'],
    skillVideosTemplate: JST['app/scripts/templates/profile/editProfile/profileSkillVideosTemplate'],

    events:
      'click div.tab-button'                         : 'tabNavigation'
      'click #save-skill-summary'                    : 'updateSkillSummary'

      'click #add-skill-photo'                       : 'addNewSkillPhoto'
      'click div.edit-photo'                         : 'editSkillPhoto'
      'click .slide-navigate.photo'                  : 'imageSlideShow'
      'change #skillImgUpload'                       : 'grabImage'
      'click #save-skill-photo'                      : 'saveSkillImage'
      'click #delete-skill-photo'                    : 'confirmSkillPhotoDelete'
      'click #delete-skill-photo-confirm'            : 'deleteSkillPhoto'

      'click #add-skill-document'                    : 'addNewSkillDocument'
      'click #edit-document'                         : 'editSkillDocument'
      'click .slide-navigate.document'               : 'documentSlideShow'
      'change #skillDocUpload'                       : 'grabSkillDocument'
      'click #save-skill-document'                   : 'saveSkillDocument'
      'click #delete-skill-document'                 : 'confirmSkillDocumentDelete'
      'click #delete-skill-document-confirm'         : 'deleteSkillDocument'

      'click #add-skill-video'                       : 'addNewSkillVideo'
      'click #skill-video-edit-icon'                 : 'editSkillVideo'
      'click .slide-navigate.video'                  : 'videoSlideShow'
      'click #save-skill-video'                      : 'saveSkillVideo'
      'click #delete-skill-video'                    : 'confirmSkillVideoDelete'
      'click #delete-skill-video-confirm'            : 'deleteSkillVideo'

      'click #skill-audio-edit'                      : 'editAudioLogin'
      'click .soundcloud-auth'                       : 'initSoundCloud'
      'click #save-soundcloud-username'              : 'saveAudioLogin'



    initialize: ( options ) ->
      console.log 'create skill for profile: ', options.profile.id
      @profile = options.profile
      @skill = options.skill
      @skillIndex = options.index
      @renderActiveSkillPhoto(0)
      @renderActiveSkillDocument(0)
      @renderActiveSkillVideo(0)
      @loadUserAudio()

    showFirstTab: (skill) =>
      if skill
        if skill?.skillPhotos?.length
          @toggleTab('photos')
        else if skill?.skillVideo?.length
          @toggleTab('videos')
        else if skill.skillAudio?.soundcloud
          @toggleTab('audio')
        else if skill?.skillDocuments?.length
          @toggleTab('docs')
        else
          @toggleTab('photos')

    render: ->
      @$el.append @skillTemplate( skill: @skill, profileType: @profile.get('profileType'), Mi: Mi )
      if @skill
        if @skill?.skillPhotos?.length
          @toggleTab('photos')
        else if @skill?.skillVideo?.length
          @toggleTab('videos')
        else if @skill.skillAudio?.soundcloud
          @toggleTab('audio')
        else if @skill?.skillDocuments?.length
          @toggleTab('docs')
        else
          @toggleTab('photos')
      @

    saveAndUpdateProgress: ->
      @profile.save null,
        success: (response) =>
          if @renderProgressBar
            @renderProgressBar()
          else
            @parent.renderProgressBar()

    renderProgressBar: ->
      if @profile then profile = @profile else profile = @parent.profile
      if @getProfileCompleteness then getCompleteness = @getProfileCompleteness else getCompleteness = @parent.getProfileCompleteness
      percentage = getCompleteness(profile)
      console.log 'renderProgressBar called, percentage complete:', percentage
      $(".percentage-complete").html(percentage)
      # progress bar is 250px. because math
      $(".progress-bar").css("width", (percentage * 2.5))
      $("#publish-status").html @publishButtonTemplate( isPublished: profile.attributes.profilePublished, lessThan50: percentage < 50  )


    renderActiveSkillPhoto: (index) ->
      #no-op if user has no photos
      if @skill?.skillPhotos?.length > index
        slideInt = setInterval =>
          if $("#skill-photo-slideshow li.photo-slide-"+index).length
            clearInterval(slideInt)
            @displayPhotoAt(index)
          else
            console.log 'no photos'

        , 500

    displayPhotoAt: (index) ->
      $("#skill-photo-slideshow li").removeClass('active')
      $("li.photo-slide-"+ index).addClass('active')
      $(".skill-slideshow-subnav .slide-navigate.photo").attr("id", index)

    resizeImages: () ->
      if $('.skill-element-container').length
        ht = $('.skill-element-container').width() / 700 * 430
        $('#skill-video-slideshow, #skill-audio-player, #skill-document-slideshow, #skill-photo-slideshow').height(ht)
        videoHt = $('.skill-element-container').height() - $('.tab-navigation').height() - $('.skill-slideshow-subnav').height() + 1
        $('.skill-video-area iframe').height(videoHt)


    renderActiveSkillDocument: (index) ->
      #no-op if user has no documents
      if @skill?.skillDocuments?.length > index
        slideInt = setInterval =>
          if $("li.document-slide-"+index).length
            clearInterval(slideInt)
            @displayDocumentAt(index)
          else
            console.log 'no documents'

        , 500

    displayDocumentAt: (index) ->
      $("#skill-document-slideshow li").removeClass('active')
      $("li.document-slide-"+index).addClass('active')
      $(".skill-slideshow-subnav .slide-navigate.document").attr("id", index)


    renderActiveSkillVideo: (index) ->
      console.log 'render Video called'
      if @skill?.skillVideo?.length > index
        videoInt = setInterval =>
          if $('#skill-video-slideshow').length
            clearInterval(videoInt)
            @displayVideoAt(index)
          else
            console.log 'no videos'
        , 500

    parseVideoUrl: (videoUrl) ->
      video = {}
      video.id = videoUrl.split(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)[2]
      if video.id
         video.type = 'youtube'
         return video

      video.id = videoUrl.split(/^.*vimeo.com\/(.*)/)[1]
      if video.id
         video.type = 'vimeo'
         return video

      alert('Unrecognized video url')
      video

    buildVideoSrc: (videoType, videoId) ->
      if videoType == 'youtube'
        return 'src="http://www.youtube.com/embed/' + videoId + '?rel=0&wmode=transparent" autoplay="0" frameborder="0" wmode="transparent"'
      if videoType == 'vimeo'
        return 'src="http://player.vimeo.com/video/' + videoId + '" wmode="transparent"'
      alert('Unrecognized video type')


    displayVideoAt: (index) ->
      videoUrl = @skill.skillVideo[index].videoUrl
      if !videoUrl
        videoUrl = @skill.skillVideo[index].youtubeUrl

      video =@parseVideoUrl(videoUrl)
      if video.type == 'vimeo'
        $('div.edit-video').css('top','79px').css('right','52px').css('width','37px').css('height','37px')
        $('#skill-video-edit-icon').css('top', '8px').css('left','7px')
      else
        $('div.edit-video').css('top','105px').css('right','').css('width','30px').css('height','30px')
        $('#skill-video-edit-icon').css('top', '').css('left','')

      videoSrc = @buildVideoSrc(video.type, video.id)
      videoIframe = @initVideo(videoSrc)
      $('li.description.video-slide-'+index).text(@skill.skillVideo[index].description)
      $('#skill-video-edit-icon').data('index', index)
      $("#skill-video-slideshow li").removeClass('active')
      $("li.video-slide-"+index).addClass('active')
      $(".skill-slideshow-subnav .slide-navigate.video").attr("id", index)
      $('#skill-video-slideshow div.skill-video-area').html(videoIframe)
      @resizeImages()

    loadUserAudio: ->
      if @skill && @skill.skillAudio?.soundcloud
        @embedSCWidget(@skill.skillAudio.soundcloud)

    tabNavigation: (event) ->
      targetedTab = $(event.target).data("tabnav")
      console.log 'tabNavigation called, targeted tab: ', $(event.target).data("tabnav")
      @toggleTab(targetedTab)

    toggleTab: (tab) ->
      $(".tab-element").removeClass("active")
      $(".tab-button").removeClass("active")
      $(".tab-button[data-tabnav~='"+tab+"']").addClass("active")
      switch tab
        when "photos" then $("#photos-tab").addClass("active")
        when "videos" then $("#videos-tab").addClass("active")
        when "audio" then $("#audio-tab").addClass("active")
        when "docs" then $("#documents-tab").addClass("active")


    imageSlideShow: ( event ) ->
      if @skill.skillPhotos.length < 2
        return

      # photo logic
      currentSlideNumber = parseInt($(event.target).attr("id"))
      totalSlideCount = $("#skill-photo-slideshow li.counter").length

      if $(event.target).data('slideshow') == 'next'
        targetSlideNumber = currentSlideNumber + 1
        if targetSlideNumber >= totalSlideCount
          targetSlideNumber = 0

      else
        targetSlideNumber = currentSlideNumber - 1
        if targetSlideNumber < 0
          targetSlideNumber = totalSlideCount - 1

      @displayPhotoAt(targetSlideNumber)


    documentSlideShow: ( event ) ->
      if @skill.skillDocuments.length < 2
        return

      currentSlideNumber = parseInt($(event.target).attr("id"))
      totalSlideCount = $("#skill-document-slideshow li.counter").length

      if $(event.target).data('slideshow') == 'next'
        targetSlideNumber = currentSlideNumber + 1
        if targetSlideNumber >= totalSlideCount
          targetSlideNumber = 0
      else
        targetSlideNumber = currentSlideNumber - 1
        if targetSlideNumber < 0
          targetSlideNumber = totalSlideCount -1

      @displayDocumentAt(targetSlideNumber)

    videoSlideShow: (event) ->
      if @skill.skillVideo.length < 2
        return

      currentSlideNumber = parseInt($(event.target).attr("id"))
      totalSlideCount = $("#skill-video-slideshow li.counter").length

      if $(event.target).data('slideshow') == 'next'
        targetSlideNumber = currentSlideNumber + 1
        if targetSlideNumber >= totalSlideCount
          targetSlideNumber = 0
      else
        targetSlideNumber = currentSlideNumber - 1
        if targetSlideNumber < 0
          targetSlideNumber = totalSlideCount - 1

      @displayVideoAt(targetSlideNumber)

    editAudioLogin: ->
      $('#soundcloud-username').val(@skill.skillAudio.soundcloud)
      window.Mi.appRouter.showEdit('#skillAudioEdit')

    saveAudioLogin: ->
      @skill.skillAudio.soundcloud = $('#soundcloud-username').val()
      @saveAndUpdateProgress()
      @embedSCWidget()


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

    updateSkillSummary: ->
      newSkillSummary = $(".summary-textarea").val()
      $("#summary-display").html(newSkillSummary)
      console.log 'updateSkillSummary called, newSkillSummary: ', newSkillSummary
      @skill.skillSummary = newSkillSummary
      $("#skillSummaryEdit").hide()
      @saveAndUpdateProgress()
      if newSkillSummary
        $('#summary-display').html(@linkify(newSkillSummary))

    embedSCWidget: ->
      if !@skill?.skillAudio?.soundcloud
        scUsername = $(".soundcloud-username-input").val()
        @skill.skillAudio.soundcloud = scUsername
        @saveAndUpdateProgress()
        $("#skillAudioEdit").hide()
      else
        scUsername = @skill.skillAudio.soundcloud
        $("#skillAudioEdit").hide()

      trackUrl = "http://soundcloud.com/" + scUsername

      SC.oEmbed trackUrl,
        auto_play: false
        maxheight: 430
      , (oEmbed) ->
        console.log "oEmbed response: " + oEmbed
        $(".audio-track-area").html oEmbed.html

    uploadSkillPhoto: (index, imageFile) =>
      console.log 'uploadSkillPhoto called'

      error = (err) ->
        alert 'Failed to upload image'
        console.log 'Failed to upload profile image: ', err

      success = (url) =>
        console.log "File available at: " + url
        $("#skillPhotoEdit").hide()
        if index < @skill.skillPhotos.length
          @updateSkillPhoto(index, url)
        else
          @addSkillPhoto(url)

      @savePhoto imageFile, @imgcfg, success, error

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


    updateSkillPhoto: (index, filepath) ->
      @skill.skillPhotos[index].photoUrl = filepath
      console.log 'update path to photo: ',filepath
      @curPhotoUrl = filepath
      @profile.save null,
        success: (result) =>
          @renderSkillPhotos(@skill, @curPhotoUrl)
        error: (result) =>
          console.log result


    addSkillPhoto: (filepath) ->
      newSkillPhoto =
        photoDesc: $(".skill-photo").val()
        photoUrl: filepath

      console.log 'path to photo: ',filepath
      console.log 'newSkillPhoto: ',newSkillPhoto
      @skill.skillPhotos.push newSkillPhoto
      @curPhotoUrl = filepath
      @profile.save null,
        success: (result) =>
          @renderSkillPhotos(@skill, @curPhotoUrl)
        error: (result) =>
          console.log result

    imgcfg:
      ratio: 1.64
      width: 950
      height: 580
      editWidth: 570
      editHeight: 348
      resultWidth: 600
      resultHeight: 366
      preview: "#skillPicturePreview"
      backgroundColor: "#FFFFFF"

    grabImage: ( event ) =>
      imgcfg = @imgcfg
      $('#save-skill-photo').val('Upload').removeAttr('disabled')
      files = event.target.files || e.dataTransfer.files
      console.log files
      # file var now holds the image
      @imageFile = files[0]
      # instantiate filereader, assign the src to the reader's onload event, and read data
      reader = new FileReader()

      reader.onload = ( event ) ->
        pvImg = $('<img></img>').attr("src", event.target.result).load =>
          img =  new Image
          img.src = event.target.result
        $(imgcfg.preview).html('').append(pvImg)
        $(pvImg).css 'width', imgcfg.editWidth
        $(pvImg).cropimg
          resultWidth: imgcfg.resultWidth
          resultHeight: imgcfg.resultHeight
          zoomDelay: 10,
          inputPrefix:'ci-'

      if @imageFile
        reader.readAsDataURL( @imageFile )



    editSkillPhoto: (event) ->
      @imageFile = undefined
      currentIndex = $('#photos-tab li.photo.active').data('index');
      if currentIndex == undefined || currentIndex == null
        @addNewSkillPhoto(event)
        return

      currentPhoto = @skill.skillPhotos[currentIndex]
      $('#photo-edit-title').text('Edit photo for ' + @skill.skillType)
      $('#skillImgUpload').val('')

      editDiv = $('#skillPicturePreview')
      $('#save-skill-photo').val('Save')
        .data('index',currentIndex)
        .removeAttr('disabled')

      photoUrl = currentPhoto.photoUrl
      if(!photoUrl)
        photoUrl='images/placeholder_imgs/gallery_placeholder.jpg'

      pvwImg = $('<img></img>')
        .attr('src', photoUrl)
        .width('100%')
      $(editDiv).html('').append(pvwImg)

      $('#photo-upload-desc').val(currentPhoto.photoDesc)
      $('#upload-skill-photo').hide()
      $('#delete-skill-photo').show()
      $('#skill-photo-upload-buttons').hide()
      window.Mi.appRouter.showEdit('#skillPhotoEdit')


    addNewSkillPhoto: (event) ->
      @imageFile = undefined
      $('#photo-edit-title').text('Add photo for ' + @skill.skillType)
      $('#skillImgUpload').val('')
      pvwImg = $('<img src="images/placeholder_imgs/gallery_placeholder.jpg" style="width:100%;"></img>')
      $('#skillPicturePreview').html('').append(pvwImg)
      $('#skillPicturePreview').attr('src','')
      $('#photo-upload-desc').val(null)
      $('#upload-skill-photo').show()
      $('#save-skill-photo').val('Upload')
        .attr('disabled', true)
        .data('index', @skill.skillPhotos.length)
      $('#delete-skill-photo').hide()
      window.Mi.appRouter.showEdit('#skillPhotoEdit')

    saveSkillImage: ->
      curIndex = $('#save-skill-photo').data('index')
      if curIndex < @skill.skillPhotos.length
        curDesc = $('#photo-upload-desc').val()
        @skill.skillPhotos[curIndex].photoDesc = curDesc
        $('#photos-tab li.description.active').text(curDesc)
        @saveAndUpdateProgress()

      if @imageFile
          @uploadSkillPhoto(curIndex, @imageFile)

      $('#skillPhotoEdit').hide()

    confirmSkillPhotoDelete: ->
      window.Mi.appRouter.showEdit('#skill-photo-delete-modal')

    deleteSkillPhoto: (event) ->
      indexToDelete = $('#save-skill-photo').data('index')
      if(indexToDelete>-1)
        @skill.skillPhotos.splice(indexToDelete, 1)
        @saveAndUpdateProgress()
        $('#skillPhotoEdit').hide()

      $('#skill-photo-delete-modal').hide()
      if indexToDelete > 0
        showFile = @skill.skillPhotos[indexToDelete-1].photoUrl
      else if @skill.skillPhotos.length
        showFile = @skill.skillPhotos[0].photoUrl
      else
        showFile = undefined
      @renderSkillPhotos(@skill, showFile)



    get4: ->
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)

    createGuid: ->
      return (@get4() + @get4() + "-" + @get4() + "-" + @get4() + "-" + @get4() + "-" + @get4() + @get4() + @get4()).toUpperCase()

    renderSkillPhotos: (skill, currentPhotoUrl) ->
      $('#photos-tab').html @skillPhotosTemplate(skill: skill)
      if currentPhotoUrl
        _.each skill.skillPhotos, (photo, index) =>
          if photo.photoUrl == currentPhotoUrl
            @renderActiveSkillPhoto(index)
      else
        @renderActiveSkillPhoto(0)
      @resizeImages()


    renderSkillDocuments: (skill, currentDocUrl) ->
      $('#documents-tab').html @skillDocumentsTemplate(skill: skill)
      if currentDocUrl
        _.each skill.skillDocuments, (doc, index) =>
          if doc.url == currentDocUrl
            @renderActiveSkillDocument(index)
      else
        @renderActiveSkillDocument(0)

    renderSkillVideos: (skill, currentVideoId)->
      $('#videos-tab').html @skillVideosTemplate(skill: skill)
      if currentVideoId
        _.each skill.skillVideo, (video, index) =>
          if video.youtubeId == currentVideoId
            @renderActiveSkillVideo(index)
          else if video.videoId == currentVideoId
            @renderActiveSkillVideo(index)
      else
        @renderActiveSkillVideo(0)

    grabSkillDocument: (event) ->
      $('#save-skill-document').val('Upload').removeAttr('disabled')
      files = event.target.files || event.dataTransfer.files
      @skillDoc = files[0]
      @forceDocUpload = true

    uploadSkillDocument: (curIndex)->
      $('#save-skill-document').attr('disabled', true)
      console.log 'uploadDocument called'
      serverUrl = 'https://api.parse.com/1/files/' + @skillDoc.name
      docName = @skillDoc.name
      $.ajax
        type: "POST"
        beforeSend: (request) =>
          request.setRequestHeader("X-Parse-Application-Id", 'fbbuZEiOyi3wJXNgLKbBsTknPnsGFx2lKzDjyCyS')
          request.setRequestHeader("X-Parse-REST-API-Key", '6yPVARUIV1JyEdK3ZxREPl1vVeYLDViSAo2KJicw')
          request.setRequestHeader("Content-Type", @skillDoc.type)

        url: serverUrl
        data: @skillDoc
        processData: false
        contentType: false
        success: (data) =>
          console.log "File available at: " + data.url
          if curIndex < @skill.skillDocuments.length
            @updateSkillDocument(curIndex, docName, data.url)
          else
            @addSkillDocument(docName, data.url)
          $('#skillDocumentEdit').hide()

        error: (data, error) ->
          obj = jQuery.parseJSON(data)
          alert(obj.error)

    addSkillDocument: (docName, fileUrl) ->
      newSkillDoc =
        name: docName
        title: $(".skill-document-title").val()
        desc: $(".skill-document-desc").val()
        url: fileUrl

      console.log 'path to document: ',fileUrl
      console.log 'newSkillDocument: ',newSkillDoc
      @skill.skillDocuments.push newSkillDoc
      @curDocumentUrl = fileUrl
      @profile.save null,
        success: (result) =>
          @renderSkillDocuments(@skill, @curDocumentUrl)
        error: (result) =>
          console.log result

    editSkillDocument: (event) ->
      currentIndex = $('#documents-tab li.document.active').data('index');
      if currentIndex == undefined || currentIndex == null
        @addNewSkillDocument(event)
        return

      currentDocument = @skill.skillDocuments[currentIndex]
      $('#document-edit-title').text('Edit document for ' + @skill.skillType)
      $('#skillDocUpload').val('')
      $('#save-skill-document').val('Save')
        .data('index',currentIndex)
        .removeAttr('disabled')
      $('textarea.skill-document-desc').val(currentDocument.desc)
      $('input.skill-document-title').val(currentDocument.title)
      $('#delete-skill-document').show()
      window.Mi.appRouter.showEdit('#skillDocumentEdit')


    confirmSkillDocumentDelete: ->
      window.Mi.appRouter.showEdit('#skill-document-delete-modal')

    addNewSkillDocument: (event) ->
      $('#document-edit-title').text('Add document for ' + @skill.skillType)
      $('#skillDocUpload').val('')
      $('#save-skill-document').val('Upload')
        .attr('disabled', true)
        .data('index', @skill.skillDocuments.length)
      $('input.skill-document-title').val(null)
      $('textarea.skill-document-desc').val(null)
      $('#delete-skill-document').hide()
      window.Mi.appRouter.showEdit('#skillDocumentEdit')

    saveSkillDocument: ->
      curIndex = $('#save-skill-document').data('index')
      if @forceDocUpload || curIndex >= @skill.skillDocuments.length
        @uploadSkillDocument(curIndex)
      else
        @updateSkillDocument(curIndex)

    updateSkillDocument: (curIndex, docName, docUrl)->
      curDesc = $('textarea.skill-document-desc').val()
      curTitle = $('input.skill-document-title').val()
      @skill.skillDocuments[curIndex].title = curTitle
      @skill.skillDocuments[curIndex].desc = curDesc
      if(docName)
        @skill.skillDocuments[curIndex].name = docName
      if(docUrl)
        @skill.skillDocuments[curIndex].url = docUrl

      $('#documents-tab li.active div.description').text(curDesc)
      $('#document-title-'+(curIndex+1)).text(curTitle)
      $('#documents-tab li.active div.title').text(curTitle)
      @saveAndUpdateProgress()
      $('#skillDocumentEdit').hide()
      @renderSkillDocuments(@skill, @skill.skillDocuments[curIndex].url)

    deleteSkillDocument: (event) ->
      $('#skillDocumentDeleteConfirm').hide()
      indexToDelete = $('#save-skill-document').data('index')
      if indexToDelete >= 0
        @skill.skillDocuments.splice(indexToDelete, 1)
        @saveAndUpdateProgress()
        $('#skillDocumentEdit').hide()

      $('#skill-document-delete-modal').hide()
      if indexToDelete > 0
        showFile = @skill.skillDocuments[indexToDelete-1].url
      else if @skill.skillDocuments.length
        showFile = @skill.skillDocuments[0].url
      else
        showFile = undefined
      @renderSkillDocuments(@skill, showFile)


    addNewSkillVideo: (event) ->
      $('#video-edit-title').text('Add video for ' + @skill.skillType)
      $("#save-skill-video").data('index', @skill.skillVideo.length)
      $('#video_url_edit').val('')
      $('#video_description_edit').val('')
      window.Mi.appRouter.showEdit('#skillVideoEdit')

    editSkillVideo: (event) ->
      curIndex = $('#skill-video-edit-icon').data('index')
      if curIndex == undefined || curIndex == null
        @addNewSkillVideo(event)
        return

      videoUrl = @skill.skillVideo[curIndex].videoUrl
      if !videoUrl
        videoUrl = @skill.skillVideo[curIndex].youtubeUrl

      $('#video-edit-title').text('Edit video for ' + @skill.skillType)
      $("#save-skill-video").data('index', curIndex)
      $('#video_url_edit').val(videoUrl)
      $('#video_description_edit').val(@skill.skillVideo[curIndex].description)
      window.Mi.appRouter.showEdit('#skillVideoEdit')

    saveSkillVideo: ->
      curIndex = $('#save-skill-video').data('index')
      url = $('#video_url_edit').val()
      desc = $('#video_description_edit').val()
      # add validation to ensure no more than 3 videos are uploaded/exist
      console.log 'video input val:',url, 'index: ', curIndex

      video = @parseVideoUrl(url)
      if(curIndex < @skill.skillVideo.length)
        @skill.skillVideo[curIndex].videoUrl = url
        @skill.skillVideo[curIndex].videoId = video.id
        @skill.skillVideo[curIndex].videoType = video.type
        @skill.skillVideo[curIndex].description = desc
      else
        newVideo =
          videoUrl: url
          videoId: video.id
          videoType: video.type
          description: desc
        @skill.skillVideo.push(newVideo)

      @renderSkillVideos(@skill, @skill.skillVideo[curIndex].videoId)
      $('#skillVideoEdit').hide()
      @saveAndUpdateProgress()

    initVideo: (videoSrc) ->
      videoIframe = "<iframe id='videoplayer' type='text/html' " + videoSrc + "></iframe>"
      console.log 'initVideo called, video url:', videoSrc
      return videoIframe

    confirmSkillVideoDelete: ->
      window.Mi.appRouter.showEdit('#skill-video-delete-modal')

    deleteSkillVideo: (event) ->
      $('#skillVideoDeleteConfirm').hide()
      indexToDelete = $('#save-skill-video').data('index')
      if indexToDelete >= 0
        @skill.skillVideo.splice(indexToDelete, 1)
        @saveAndUpdateProgress()
        $('#skillVideoEdit').hide()

      $('#skill-video-delete-modal').hide()
      if indexToDelete > 0
        videoId = @skill.skillVideo[indexToDelete-1].videoId
      else if @skill.skillVideo.length
        videoId = @skill.skillVideo[0].videoId
      else
        videoId = undefined
      @renderSkillVideos(@skill, videoId)



  @
