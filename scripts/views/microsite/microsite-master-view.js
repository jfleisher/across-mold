(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'jquery-ui', 'select2', 'parallax', 'templates', 'modernizr'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.MicrositeMasterView = (function(_super) {
      __extends(MicrositeMasterView, _super);

      function MicrositeMasterView() {
        this.scrollToTargetFromTop = __bind(this.scrollToTargetFromTop, this);
        this.scrollToTarget = __bind(this.scrollToTarget, this);
        this.checkLayout = __bind(this.checkLayout, this);
        this.initParallax = __bind(this.initParallax, this);
        this.actionNavigate = __bind(this.actionNavigate, this);
        this.doResize = __bind(this.doResize, this);
        _ref = MicrositeMasterView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MicrositeMasterView.prototype.masterTemplate = JST['app/scripts/templates/microsite/micrositeMaster'];

      MicrositeMasterView.prototype.masterTemplateLarge = JST['app/scripts/templates/microsite/micrositeMasterLarge'];

      MicrositeMasterView.prototype.masterTemplateMedium = JST['app/scripts/templates/microsite/micrositeMasterMedium'];

      MicrositeMasterView.prototype.masterTemplateSmall = JST['app/scripts/templates/microsite/micrositeMasterSmall'];

      MicrositeMasterView.prototype.subMenuTemplate = JST['app/scripts/templates/microsite/micrositeSubMenu'];

      MicrositeMasterView.prototype.searchTemplate = JST['app/scripts/templates/microsite/micrositeSearch'];

      MicrositeMasterView.prototype.ThreeDPrintingTemplate = JST['app/scripts/templates/microsite/microsite3Dprinting'];

      MicrositeMasterView.prototype.injectionMoldingTemplate = JST['app/scripts/templates/microsite/micrositeInjectionMolding'];

      MicrositeMasterView.prototype.dieCastingTemplate = JST['app/scripts/templates/microsite/micrositeDieCasting'];

      MicrositeMasterView.prototype.CNCmachiningTemplate = JST['app/scripts/templates/microsite/micrositeCNCmachining'];

      MicrositeMasterView.prototype.OtherTemplate = JST['app/scripts/templates/microsite/micrositeOther'];

      MicrositeMasterView.prototype.faqTemplate = JST['app/scripts/templates/microsite/FAQ'];

      MicrositeMasterView.prototype.aboutTemplate = JST['app/scripts/templates/microsite/about'];

      MicrositeMasterView.prototype.contactTemplate = JST['app/scripts/templates/microsite/contact'];

      MicrositeMasterView.prototype.termsTemplate = JST['app/scripts/templates/microsite/terms'];

      MicrositeMasterView.prototype.promoTemplate = JST['app/scripts/templates/modals/promo-modal'];

      MicrositeMasterView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      MicrositeMasterView.prototype.className = 'microsite-master';

      MicrositeMasterView.prototype.events = {
        'click .scrolldown': 'scrollToTarget',
        'click .scrolldown-top': 'scrollToTargetFromTop',
        'click #termslink': 'termspopup',
        'click .prevClose': 'prevClose',
        'click #profileimg': 'prevShow',
        'click .close-modal': 'closeModal',
        'click .open-modal': 'showModal',
        'resize window': 'checkLayout',
        'click #promo-video': 'showPromoVideo',
        'click .faq_background .question': 'expandFAQ',
        'click #ask-us-button': 'mailToAskUs',
        'click .action-btn': 'actionNavigate'
      };

      MicrositeMasterView.prototype.initialize = function(options) {
        console.log('microsite initialized');
        new Mi.Views.MenuView({
          user: Parse.User.current()
        });
        if (options) {
          this.requestedProfileInfo = options.category;
        } else {
          this.requestedProfileInfo = null;
        }
        $('body').delegate(".prevClose", 'click', this.prevClose);
        $(window).on('resize', this.doResize);
        return this;
      };

      MicrositeMasterView.prototype.windowWidth = $(window).width();

      MicrositeMasterView.prototype.doResize = function(evt) {
        var e;
        if ($(window).width() === this.windowWidth) {
          console.log('window resize being skipped');
          e = evt != null ? evt : {
            evt: window.event
          };
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          if (e.cancelBubble !== null) {
            e.cancelBubble = true;
          }
          return false;
        } else {
          this.windowWidth = $(window).width();
          console.log('window resize handled');
          return this.checkLayout();
        }
      };

      MicrositeMasterView.prototype.remove = function() {
        $(window).off('resize', this.doResize);
        this.$el.remove();
        return this;
      };

      MicrositeMasterView.prototype.actionNavigate = function(ev) {
        var dest;
        window.Mi.parallaxScrollPos = $('body').scrollTop();
        dest = $(ev.currentTarget).data('navigate');
        return window.Mi.appRouter.navigate(dest);
      };

      MicrositeMasterView.prototype.getImageAttr = function() {
        if ($('.device-xs:visible').length) {
          return 'image-sm';
        } else if ($('.device-sm:visible').length) {
          return 'image-md';
        } else {
          return 'image';
        }
      };

      MicrositeMasterView.prototype.getParallaxRatio = function() {
        if (window.innerHeight > window.innerWidth) {
          return 0.65;
        } else if (window.innerHeight / window.innerWidth < 0.5) {
          return 1;
        } else {
          return 0.8;
        }
      };

      MicrositeMasterView.prototype.parallaxBackgroundWidth = function() {
        if ($('.device-xs:visible').length) {
          return 900;
        } else if ($('.device-sm:visible').length) {
          return 1800;
        } else {
          return 2700;
        }
      };

      MicrositeMasterView.prototype.parallaxBackgroundHeight = function() {
        if ($('.device-xs:visible').length) {
          return 600;
        } else if ($('.device-sm:visible').length) {
          return 1200;
        } else {
          return 1800;
        }
      };

      MicrositeMasterView.prototype.initParallax = function() {
        var scrollOptions, setScroll;
        $('#parallax-images').html('');
        $('img[src="images/microsite_images/main-image1-sm.jpg"]').remove();
        $('img[src="images/microsite_images/main-image2-sm.jpg"]').remove();
        $('img[src="images/microsite_images/main-image3-sm.jpg"]').remove();
        $('img[src="images/microsite_images/main-image4-sm.jpg"]').remove();
        scrollOptions = {
          container: $('#parallax-images'),
          imageAttribute: this.getImageAttr(),
          coverRatio: this.getParallaxRatio(),
          mediaWidth: this.parallaxBackgroundWidth(),
          mediaHeight: this.parallaxBackgroundHeight(),
          speed: 0.4,
          parallax: !window.Mi.appRouter.isMobile
        };
        $('.img-holder').imageScroll(scrollOptions);
        setScroll = function() {
          $(window).scrollTop(1);
          $(window).scrollTop(0);
          if (window.Mi.parallaxScrollPos) {
            return $('body').scrollTop(window.Mi.parallaxScrollPos);
          }
        };
        return setTimeout(setScroll, 0);
      };

      MicrositeMasterView.prototype.render = function() {
        var checkDom, checkLayout, domLoop, e, initParallax, isParallax, width,
          _this = this;
        this.isParallax = false;
        $('.footer-container').remove();
        try {
          $('.scrolldown-button').tooltip('destroy');
        } catch (_error) {
          e = _error;
        }
        this.$el.html('');
        this.$el.append(this.subMenuTemplate);
        if (!this.requestedProfileInfo) {
          width = $(window).width();
          window.Mi.appRouter.GoogleAnalytics.trackPageView('/microsite-main-page');
          this.$el.append(this.masterTemplate);
          this.$el.find(".site-footer").append(this.footerTemplate);
          this.isParallax = true;
        } else {
          switch (this.requestedProfileInfo) {
            case 'search':
              this.$el.append(this.searchTemplate);
              break;
            case '3Dprinting':
              this.$el.append(this.ThreeDPrintingTemplate);
              window.Mi.appRouter.GoogleAnalytics.trackPageView('/3Dprinting');
              break;
            case 'InjectionMolding':
              this.$el.append(this.injectionMoldingTemplate);
              window.Mi.appRouter.GoogleAnalytics.trackPageView('/InjectionMolding');
              break;
            case 'DieCasting':
              this.$el.append(this.dieCastingTemplate);
              window.Mi.appRouter.GoogleAnalytics.trackPageView('/DieCasting');
              break;
            case 'CNCmachining':
              this.$el.append(this.CNCmachiningTemplate);
              window.Mi.appRouter.GoogleAnalytics.trackPageView('/microsite-CNCmachining');
              break;
            case 'Other':
              this.$el.append(this.OtherTemplate);
              window.Mi.appRouter.GoogleAnalytics.trackPageView('/microsite-Other');
              break;
            case 'faq':
              this.$el.append(this.faqTemplate);
              break;
            case 'contactus':
              this.$el.append(this.contactTemplate);
              break;
            case 'about':
              this.$el.append(this.aboutTemplate);
              break;
            case 'terms':
              this.$el.append(this.termsTemplate);
          }
        }
        $('#footer').html(this.footerTemplate);
        checkDom = function() {
          return $(".microsite-background").length || $(".help-pages-background").length;
        };
        checkLayout = this.checkLayout;
        isParallax = this.isParallax;
        initParallax = this.initParallax;
        domLoop = setInterval(function() {
          console.log('running!');
          if (checkDom()) {
            clearInterval(domLoop);
            checkLayout();
            if (isParallax) {
              initParallax();
            }
            return $('.stage').fadeIn(200, function() {
              if (!Modernizr.touch) {
                return $('.scrolldown-top-button').tooltip({
                  trigger: 'hover focus',
                  title: 'Click to scroll',
                  placement: 'bottom'
                });
              }
            });
          }
        }, 500);
        return this;
      };

      MicrositeMasterView.prototype.checkLayout = function() {
        var bufferHeight, imgHeight, imgLeft, salesImg, setSpecial, textHeight, windowCenter;
        salesImg = $('.sales-imgdiv');
        if (salesImg.length) {
          imgLeft = $('.sales-imgdiv').offset().left;
          windowCenter = $(document).width() / 2;
          textHeight = $('.sales-textdiv').height();
          imgHeight = $('.sales-imgdiv').height();
          bufferHeight = textHeight - imgHeight;
          if (imgLeft > windowCenter && bufferHeight > 0) {
            $('.sales-imgdiv').css('padding-top', bufferHeight + 'px');
          } else {
            $('.sales-imgdiv').css('padding-top', '0');
          }
        }
        if (this.isParallax) {
          this.initParallax();
        }
        setSpecial = function() {
          var topHt;
          topHt = $('.img-holder,.imageHolder').height();
          return $('.top-overlay').height(topHt);
        };
        return setTimeout(setSpecial, 100);
      };

      MicrositeMasterView.prototype.mailToAskUs = function() {
        return window.location.href = "mailto:contact@across-mold.com?subject=A question about Across Mold";
      };

      MicrositeMasterView.prototype.expandFAQ = function(event) {
        var expander, question;
        question = event.currentTarget;
        expander = $(question).children('.expander');
        $(question).next().children().slideToggle(100);
        return $(expander).toggleClass('expanded');
      };

      MicrositeMasterView.prototype.isTouchDevice = function() {
        return __indexOf.call(window, 'ontouchstart') >= 0 || __indexOf.call(window, 'onmsgesturechange') >= 0;
      };

      MicrositeMasterView.prototype.scrollToTarget = function(event) {
        if (Modernizr.touch) {
          return;
        }
        if (window.Mi.appRouter.isMobile) {
          return;
        }
        return this.doScroll(event.currentTarget, 1700);
      };

      MicrositeMasterView.prototype.scrollToTargetFromTop = function(event) {
        if (Modernizr.touch) {
          return;
        }
        return this.doScroll(event.currentTarget, 1000);
      };

      MicrositeMasterView.prototype.doScroll = function(target, speed) {
        var maxScroll, scrollTarget, submenu, targetedLink;
        targetedLink = '#' + $(target).data("scroll");
        console.log('doScroll fired, target link ' + targetedLink);
        $('html,body').stop();
        scrollTarget = $(targetedLink).offset().top - $('.fixed-navbar').height();
        submenu = $('.sub-menu:visible');
        if (submenu.length) {
          scrollTarget -= $(submenu).height() / 2;
        }
        maxScroll = $('html,body').height() - $(window).height();
        if (scrollTarget > maxScroll) {
          scrollTarget = maxScroll;
        }
        if (scrollTarget <= $(window).scrollTop()) {
          return;
        }
        return $('html,body').animate({
          scrollTop: scrollTarget
        }, speed);
      };

      MicrositeMasterView.prototype.closeModal = function(event) {
        var modalname;
        modalname = $(event.target).data('closemodal');
        return $('#' + modalname).hide();
      };

      MicrositeMasterView.prototype.prevShow = function(ev) {
        var previewId;
        previewId = $(ev.currentTarget).data('previewid');
        $('.largeprofile-preview').each(function(i, el) {
          if (el.id !== previewId) {
            return $(el).remove();
          }
        });
        return $("#" + previewId).appendTo('body').modal('show');
      };

      MicrositeMasterView.prototype.prevClose = function() {
        return $(".largeprofile-preview").modal('hide');
      };

      MicrositeMasterView.prototype.termspopup = function() {
        $('#account-dropdown').fadeOut(100);
        $(".popover").hide();
        $('.modal').modal('hide');
        return $(".terms").show();
      };

      MicrositeMasterView.prototype.showPromoVideo = function() {
        $('.modal-content, .modal').modal('hide');
        $('body').append(this.promoTemplate({
          videoUrl: Mi.CMS.promoVideoUrl
        }));
        $('#promo-modal').modal({
          backdrop: 'static',
          keyboard: false
        });
        $('#promo-modal').focus();
        return $('#promo-modal').on('click', '#promo-close', this.closePromoVideo);
      };

      MicrositeMasterView.prototype.closePromoVideo = function() {
        $('#promo-modal').modal('hide');
        return $('#promo-modal').remove();
      };

      return MicrositeMasterView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
