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
  class Mi.Views.ProfileSkillView extends Support.CompositeView
    skillTemplate: JST['app/scripts/templates/profile/viewProfile/profileSkillViewTemplate'],

    events:
      'click .tab-button'                            : 'tabNavigation'
      'click .slide-navigate.photo'                  : 'imageSlideShow'
      'click .slide-navigate.document'               : 'documentSlideShow'
      'click .slide-navigate.video'                  : 'videoSlideShow'

    initialize: (options)->
      @skill = options.skill
      @profile = options.profile
      if @profile.location
        @profile.location_google = 'http://www.google.com/maps?q=' + @profile.location.replace(' ','+')
      console.log 'skill view initialized, skill: ', @skill

      # set current video slide to 0
      @currentVideoIndex = 0
      @loadUserVideo()
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
        @resizeImages()

    render: ->
      # passing in a single skill for this view's model, i think
      # also, activate the first slide and slide description
      @$el.append( @skillTemplate( profile: @profile, skill: @skill ) )
      @$el.find("li.photo-slide-0").addClass('active')
      @$el.find("li.document-slide-0").addClass('active')
      @$el.find("li.video-slide-0").addClass('active')

    resizeImages: () ->
      if $('.skill-element-container').length
        ht = $('.skill-element-container').width() / 700 * 430
        $('#skill-video-slideshow, #skill-audio-player, #skill-document-slideshow, #skill-photo-slideshow').height(ht)
        videoHt = $('.skill-element-container').height() - $('.tab-navigation').height() - $('.skill-slideshow-subnav').height() + 1
        $('.skill-video-area iframe').height(videoHt)

    tabNavigation: (event) ->
      targetedTab = $(event.target).data("tabnav")
      console.log 'tabNavigation called, targeted tab: ', $(event.target).data("tabnav")
      @toggleTab(targetedTab)

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

    toggleTab: (tab) ->
      $(".tab-button").removeClass("active")
      $(".tab-button[data-tabnav~='"+tab+"']").addClass("active")
      $(".tab-element").removeClass("active")
      switch tab
        when "photos" then $("#photos-tab").addClass("active")
        when "videos" then $("#videos-tab").addClass("active")
        when "audio" then $("#audio-tab").addClass("active")
        when "docs" then $("#documents-tab").addClass("active")
      @resizeImages()

    imageSlideShow: ( event ) ->
      if @skill.skillPhotos.length < 2
        return

      # photo logic
      currentSlideNumber = parseInt($(event.target).attr("id"))
      totalSlideCount = @skill.skillPhotos.length

      if $(event.target).data('slideshow') == 'next'
        targetSlideNumber = currentSlideNumber + 1
        if targetSlideNumber >= totalSlideCount
          targetSlideNumber = 0
      else
        targetSlideNumber = currentSlideNumber - 1
        if targetSlideNumber < 0
          targetSlideNumber = totalSlideCount - 1

      $("#skill-photo-slideshow li").removeClass('active')
      $("#skill-photo-slideshow li.photo-slide-"+ targetSlideNumber ).addClass('active')
      $(".slide-navigate.photo").attr("id", targetSlideNumber)


    documentSlideShow: ( event ) ->
      if @skill.skillDocuments.length < 2
        return
      currentSlideNumber = parseInt($(event.target).attr("id"))
      totalSlideCount = @skill.skillDocuments.length

      if $(event.target).data('slideshow') == 'next'
        targetSlideNumber = currentSlideNumber + 1
        if targetSlideNumber >= totalSlideCount
          targetSlideNumber = 0
      else
        targetSlideNumber = currentSlideNumber - 1
        if targetSlideNumber < 0
          targetSlideNumber = totalSlideCount - 1

      $("#skill-document-slideshow li").removeClass('active')
      $("#skill-document-slideshow li.document-slide-"+ targetSlideNumber ).addClass('active')
      $(".slide-navigate.document").attr("id", targetSlideNumber)


    loadUserAudio: ->
      if @skill.skillAudio?.soundcloud
        @embedSCWidget(@skill.skillAudio.soundcloud)

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

    videoSlideShow: (event) ->
      if @skill.skillVideo.length < 2
        return

      currentSlideNumber = parseInt($(event.target).attr("id"))
      totalSlideCount = @skill.skillVideo.length

      if $(event.target).data('slideshow') == 'next'
        targetSlideNumber = currentSlideNumber + 1
        if targetSlideNumber >= totalSlideCount
          targetSlideNumber = 0
      else
        targetSlideNumber = currentSlideNumber - 1
        if targetSlideNumber < 0
          targetSlideNumber = totalSlideCount - 1

      @displayVideoAt(targetSlideNumber)


    buildVideoSrc: (videoType, videoId) ->
      if videoType == 'youtube'
        return 'src="http://www.youtube.com/embed/' + videoId + '?rel=0&wmode=transparent" autoplay="0" frameborder="0" wmode="transparent"'
      if videoType == 'vimeo'
        return 'src="http://player.vimeo.com/video/' + videoId + '?wmode=transparent" wmode="transparent"'
      console.log('Unrecognized video type')


    displayVideoAt: (index) ->
      videoUrl = @skill.skillVideo[index].videoUrl
      if !videoUrl
          videoUrl = @skill.skillVideo[index].youtubeUrl
      video = @parseVideoUrl(videoUrl)
      videoSrc = @buildVideoSrc(video.type, video.id)
      videoIframe = @initVideo(videoSrc)

      $('li.description.video-slide-'+index).text(@skill.skillVideo[index].description)
      $("#skill-video-slideshow li").removeClass('active')
      $("li.video-slide-"+index).addClass('active')
      $(".skill-slideshow-subnav .slide-navigate.video").attr("id", index)
      $('#skill-video-slideshow .skill-video-area').html(videoIframe)
      @resizeImages()

    initVideo: (videoSrc) ->
      videoIframe = "<iframe id='videoplayer' type='text/html'" + videoSrc + "></iframe>"
      console.log 'initVideo called, video url:', videoSrc
      return videoIframe

    loadUserVideo: ->
      #no-op if user has no video
      console.log 'loadUserVideo called'

      if @skill?.skillVideo?[0]?.youtubeUrl || @skill?.skillVideo?[0]?.videoUrl
        videoInt = setInterval =>
          if $(".skill-video-area").length
            @displayVideoAt(0)
            clearInterval(videoInt)
          else
            console.log 'nope'

        , 500

  @
