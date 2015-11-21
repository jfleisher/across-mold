define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'jquery-ui'
  'select2'
  'parallax'
  'templates'
  'modernizr'
], (Mi, Support, Parse, $) ->
  class Mi.Views.MicrositeMasterView extends Support.CompositeView
    masterTemplate: JST['app/scripts/templates/microsite/micrositeMaster'],
    masterTemplateLarge: JST['app/scripts/templates/microsite/micrositeMasterLarge'],
    masterTemplateMedium: JST['app/scripts/templates/microsite/micrositeMasterMedium'],
    masterTemplateSmall: JST['app/scripts/templates/microsite/micrositeMasterSmall'],
    subMenuTemplate: JST['app/scripts/templates/microsite/micrositeSubMenu'],
    searchTemplate: JST['app/scripts/templates/microsite/micrositeSearch'],
    ThreeDPrintingTemplate: JST['app/scripts/templates/microsite/microsite3Dprinting'],
    injectionMoldingTemplate: JST['app/scripts/templates/microsite/micrositeInjectionMolding'],
    dieCastingTemplate: JST['app/scripts/templates/microsite/micrositeDieCasting'],
    CNCmachiningTemplate: JST['app/scripts/templates/microsite/micrositeCNCmachining'],
    OtherTemplate: JST['app/scripts/templates/microsite/micrositeOther'],
    faqTemplate: JST['app/scripts/templates/microsite/FAQ'],
    aboutTemplate: JST['app/scripts/templates/microsite/about'],
    contactTemplate: JST['app/scripts/templates/microsite/contact'],
    termsTemplate: JST['app/scripts/templates/microsite/terms'],
    promoTemplate: JST['app/scripts/templates/modals/promo-modal'],
    footerTemplate: JST['app/scripts/templates/footer'],

    className: 'microsite-master'

    events :
      'click .scrolldown'               : 'scrollToTarget'
      'click .scrolldown-top'           : 'scrollToTargetFromTop'
      'click #termslink'                : 'termspopup'
      'click .prevClose'                : 'prevClose'
      'click #profileimg'               : 'prevShow'
      'click .close-modal'              : 'closeModal'
      'click .open-modal'               : 'showModal'
      'resize window'                   : 'checkLayout'
      'click #promo-video'              : 'showPromoVideo'
      'click .faq_background .question' : 'expandFAQ'
      'click #ask-us-button'            : 'mailToAskUs'
      'click .action-btn'               : 'actionNavigate'

    initialize: ( options )->
      console.log 'microsite initialized'

      new Mi.Views.MenuView user: Parse.User.current()

      if options
        @requestedProfileInfo = options.category
      else
        @requestedProfileInfo = null

      $('body').delegate(".prevClose", 'click', @prevClose)
      $(window).on 'resize', @doResize
      @

    windowWidth: $(window).width()

    doResize: (evt) =>
      if $(window).width() == @windowWidth
        console.log 'window resize being skipped'
        e = evt ? evt:window.event
        if e.stopPropagation then e.stopPropagation()
        if e.cancelBubble != null then e.cancelBubble = true
        return false
      else
        @windowWidth = $(window).width()
        console.log 'window resize handled'
        @checkLayout()

    remove: ->
      $(window).off('resize', @doResize)
      @$el.remove()
      @

    actionNavigate: (ev) =>
      window.Mi.parallaxScrollPos = $('body').scrollTop()
      dest = $(ev.currentTarget).data('navigate')
      window.Mi.appRouter.navigate(dest)

    getImageAttr: () ->
      if $('.device-xs:visible').length
        return 'image-sm'
      else if $('.device-sm:visible').length
        return 'image-md'
      else
        return 'image'

    getParallaxRatio: ()->
      if window.innerHeight > window.innerWidth
        return 0.65
      else if window.innerHeight/window.innerWidth < 0.5
        return 1
      else
        return 0.8

    parallaxBackgroundWidth: ->
      if $('.device-xs:visible').length
        return 900
      else if $('.device-sm:visible').length
        return 1800
      else
        return 2700

    parallaxBackgroundHeight: ->
      if $('.device-xs:visible').length
        return 600
      else if $('.device-sm:visible').length
        return 1200
      else
        return 1800

    initParallax: =>
      $('#parallax-images').html('')
      $('img[src="images/microsite_images/main-image1-sm.jpg"]').remove()
      $('img[src="images/microsite_images/main-image2-sm.jpg"]').remove()
      $('img[src="images/microsite_images/main-image3-sm.jpg"]').remove()
      $('img[src="images/microsite_images/main-image4-sm.jpg"]').remove()

      scrollOptions =
        container: $('#parallax-images')
        imageAttribute: @getImageAttr()
        coverRatio: @getParallaxRatio()
        mediaWidth: @parallaxBackgroundWidth()
        mediaHeight: @parallaxBackgroundHeight()
        speed: 0.4
        parallax: !window.Mi.appRouter.isMobile


      $('.img-holder').imageScroll scrollOptions
      setScroll = () ->
        $(window).scrollTop(1);
        $(window).scrollTop(0);
        if window.Mi.parallaxScrollPos
          $('body').scrollTop(window.Mi.parallaxScrollPos)
      setTimeout setScroll, 0

    render: ->
      @isParallax = false
      $('.footer-container').remove()
      try $('.scrolldown-button').tooltip 'destroy' catch e

      @$el.html('')
      @$el.append @subMenuTemplate
      if !@requestedProfileInfo
        width = $(window).width()
        window.Mi.appRouter.GoogleAnalytics.trackPageView '/microsite-main-page'
        @$el.append @masterTemplate
        @$el.find(".site-footer").append @footerTemplate
        @isParallax = true
      else
        switch @requestedProfileInfo
          when 'search' then @$el.append @searchTemplate
          when '3Dprinting'
            @$el.append @ThreeDPrintingTemplate
            window.Mi.appRouter.GoogleAnalytics.trackPageView '/3Dprinting'

          when 'InjectionMolding'
            @$el.append @injectionMoldingTemplate
            window.Mi.appRouter.GoogleAnalytics.trackPageView '/InjectionMolding'

          when 'DieCasting'
            @$el.append @dieCastingTemplate
            window.Mi.appRouter.GoogleAnalytics.trackPageView '/DieCasting'

          when 'CNCmachining'
            @$el.append @CNCmachiningTemplate
            window.Mi.appRouter.GoogleAnalytics.trackPageView '/microsite-CNCmachining'

          when 'Other'
            @$el.append @OtherTemplate
            window.Mi.appRouter.GoogleAnalytics.trackPageView '/microsite-Other'

          when 'faq'
            @$el.append @faqTemplate

          when 'contactus'
             @$el.append @contactTemplate
          when 'about'
             @$el.append @aboutTemplate
          when 'terms'
             @$el.append @termsTemplate

      $('#footer').html @footerTemplate

      checkDom = ->
        return $(".microsite-background").length || $(".help-pages-background").length

      checkLayout = @checkLayout
      isParallax = @isParallax
      initParallax = @initParallax
      domLoop = setInterval =>
        console.log('running!')
        if checkDom()
          clearInterval(domLoop)
          checkLayout()

          if isParallax
            initParallax()

          $('.stage').fadeIn 200, () ->
            if !Modernizr.touch
              $('.scrolldown-top-button').tooltip
                trigger: 'hover focus'
                title: 'Click to scroll'
                placement: 'bottom'

      , 500

      @

    checkLayout: () =>
      salesImg = $('.sales-imgdiv')
      if salesImg.length
        imgLeft = $('.sales-imgdiv').offset().left
        windowCenter = $(document).width()/2
        textHeight = $('.sales-textdiv').height()
        imgHeight = $('.sales-imgdiv').height()
        bufferHeight = textHeight - imgHeight
        if imgLeft > windowCenter && bufferHeight > 0
          $('.sales-imgdiv').css('padding-top', bufferHeight + 'px')
        else
          $('.sales-imgdiv').css('padding-top', '0')
      if @isParallax
        @initParallax()

      setSpecial =  () ->
        topHt = $('.img-holder,.imageHolder').height()
        $('.top-overlay').height(topHt)
        #slide2 = $('#parallax-images img')[2]
        #slide2 = $('img[src="images/microsite_images/main-image2-sm.jpg"],img[src="images/microsite_images/main-image2-md.jpg"],img[src="images/microsite_images/main-image2-lg.jpg"]')
        #slide2left = ($(slide2).width() - $(window).width())/3
        #$(slide2).css('margin-left',slide2left)
      setTimeout( setSpecial, 100)

    mailToAskUs: () ->
      window.location.href="mailto:contact@across-mold.com?subject=A question about Across Mold"


    expandFAQ: (event) ->
      question = event.currentTarget
      expander = $(question).children('.expander')
      $(question).next().children().slideToggle(100)
      $(expander).toggleClass('expanded')

    isTouchDevice: () ->
      return 'ontouchstart' in window  || 'onmsgesturechange' in window


    scrollToTarget: ( event ) =>
      if Modernizr.touch
        return

      if window.Mi.appRouter.isMobile
        return
      @doScroll(event.currentTarget, 1700)

    # top scroll is shorter so animation must be faster
    scrollToTargetFromTop: ( event ) =>
      if Modernizr.touch
        return

      @doScroll(event.currentTarget, 1000)


    doScroll: (target, speed) ->
      targetedLink = '#' + $(target).data("scroll")
      console.log 'doScroll fired, target link ' + targetedLink

      $('html,body').stop()
      scrollTarget = $(targetedLink).offset().top - $('.fixed-navbar').height();

      submenu = $('.sub-menu:visible')
      if submenu.length
        scrollTarget -= $(submenu).height()/2

      maxScroll = $('html,body').height() - $(window).height()
      if scrollTarget > maxScroll
        scrollTarget = maxScroll

      if scrollTarget <= $(window).scrollTop()
        return;
      $('html,body').animate({ scrollTop: scrollTarget}, speed);


    closeModal: (event)->
      modalname = $(event.target).data('closemodal')
      $('#'+modalname).hide()

    prevShow: (ev) ->
      previewId = $(ev.currentTarget).data('previewid')
      $('.largeprofile-preview').each (i, el) ->
        if el.id != previewId
          $(el).remove()
      $("#"+previewId).appendTo('body').modal('show')

    prevClose: ->
      $(".largeprofile-preview").modal('hide')

    termspopup: ->
      $('#account-dropdown').fadeOut 100
      $(".popover").hide()
      $('.modal').modal('hide')
      $(".terms").show()


    showPromoVideo:  ->
      $('.modal-content, .modal').modal('hide')
      $('body').append @promoTemplate({ videoUrl: Mi.CMS.promoVideoUrl} )
      $('#promo-modal').modal({ backdrop: 'static', keyboard: false})
      $('#promo-modal').focus()
      $('#promo-modal').on('click','#promo-close', @closePromoVideo)

    closePromoVideo: ->
      $('#promo-modal').modal('hide')
      $('#promo-modal').remove()

  @
