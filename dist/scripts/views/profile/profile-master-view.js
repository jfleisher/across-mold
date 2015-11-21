(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'select2', 'gmap3', 'modal', 'templates', 'profile-skill-view'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.ProfileMasterView = (function(_super) {
      __extends(ProfileMasterView, _super);

      function ProfileMasterView() {
        this.renderInitialSkill = __bind(this.renderInitialSkill, this);
        this.fbuiShare = __bind(this.fbuiShare, this);
        this.resizeLocation = __bind(this.resizeLocation, this);
        this.resizeImages = __bind(this.resizeImages, this);
        _ref = ProfileMasterView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ProfileMasterView.prototype.titleTemplate = JST['app/scripts/templates/profile/viewProfile/profileTitleViewTemplate'];

      ProfileMasterView.prototype.headingTemplate = JST['app/scripts/templates/profile/viewProfile/profileHeadingViewTemplate'];

      ProfileMasterView.prototype.attributesTemplate = JST['app/scripts/templates/profile/viewProfile/profileAttributesViewTemplate'];

      ProfileMasterView.prototype.skillPhotosTemplate = JST['app/scripts/templates/profile/viewProfile/profileSkillPhotosTemplate'];

      ProfileMasterView.prototype.skillDocumentsTemplate = JST['app/scripts/templates/profile/viewProfile/profileSkillDocumentsTemplate'];

      ProfileMasterView.prototype.skillVideosTemplate = JST['app/scripts/templates/profile/viewProfile/profileSkillVideosTemplate'];

      ProfileMasterView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      ProfileMasterView.prototype.favoriteCreatedTemplate = JST['app/scripts/templates/modals/favorite-created-modal'];

      ProfileMasterView.prototype.className = 'profile-master wrapper';

      ProfileMasterView.prototype.events = {
        'click .skill-button': 'displaySkill',
        'click .slide-navigate.photo': 'imageSlideShow',
        'click #share-modal': 'showshare',
        'click #hide-share-modal': 'hideshare',
        'click #contact-email': 'contactMailTo',
        'click #save-profile': 'saveProfileFavorite',
        'click #profile-like': 'toggleLike',
        'click #fb-share': 'fbuiShare'
      };

      ProfileMasterView.prototype.initialize = function(options) {
        var checkDom, domLoop, footer, pmv, setupPlugins,
          _this = this;
        console.log('ProfileMaster initialized');
        $(window).scrollTop(0);
        this.profile = options.profile.attributes;
        this.getProfileEmail(this.profile);
        this.profileId = options.profileId;
        this.profileObject = options.profile;
        this.skill = this.profile.skills[0];
        $(".upper-bkgd").css('height', '450px');
        setupPlugins = function() {
          _this.initGoogleMaps("#location-map");
          return _this.renderInitialSkill();
        };
        pmv = this;
        checkDom = function() {
          return $(".title-area").length && $(".skill-area") && pmv.profileContactEmail !== void 0;
        };
        footer = this.footerTemplate;
        domLoop = setInterval(function() {
          console.log('running!');
          if (checkDom()) {
            clearInterval(domLoop);
            setupPlugins();
            $('.footer-container').remove();
            return $('#footer').html(footer());
          }
        }, 1000);
        return $(window).on('resize', this.resizeImages);
      };

      ProfileMasterView.prototype.render = function() {
        this.renderProfile();
        return this;
      };

      ProfileMasterView.prototype.resizeImages = function() {
        var ht, videoHt;
        this.adjustSkillButtonWidth();
        if ($('.cover-photo').length) {
          ht = $('.cover-photo').width() / 10 * 4;
          $('.cover-photo').height(ht);
        }
        if ($('.skill-element-container').length) {
          ht = $('.skill-element-container').width() / 700 * 430;
          $('#skill-video-slideshow, #skill-audio-player, #skill-document-slideshow, #skill-photo-slideshow').height(ht);
          videoHt = $('.skill-element-container').height() - $('.tab-navigation').height() - $('.skill-slideshow-subnav').height() + 1;
          $('.skill-video-area iframe').height(videoHt);
        }
        return this.resizeLocation();
      };

      ProfileMasterView.prototype.resizeLocation = function() {
        var locMap;
        locMap = $('#location-map');
        if (locMap.length) {
          return $(locMap).height($(locMap).width());
        }
      };

      ProfileMasterView.prototype.fbuiShare = function(ev) {
        var profileImgUrl, profileUrl, skillSummary;
        profileUrl = this.profile.profileCustomUrl;
        if (profileUrl && profileUrl.length) {
          profileUrl = "http://www.across-mold.com/#/" + profileUrl;
        } else {
          profileUrl = "http://www.across-mold.com/#/display-profile/" + this.profileId;
        }
        profileImgUrl = this.profile.profilePictureUrl;
        if (!profileImgUrl || !profileImgUrl.length) {
          profileImgUrl = "http://www.across-mold.com/images/placeholder_imgs/profile_placeholder.png";
        }
        skillSummary = "Tons of great talent and resources for your production can be found on across-mold.com.";
        if (this.skill && this.skill.skillSummary && this.skill.skillSummary.length) {
          skillSummary = this.skill.skillSummary;
        }
        return FB.ui({
          method: 'feed',
          name: this.profile.profileName,
          link: profileUrl,
          picture: profileImgUrl,
          caption: this.profile.profileType,
          description: skillSummary,
          message: 'Look who I found on Across Mold!'
        });
      };

      ProfileMasterView.prototype.toggleLike = function() {
        var curUser, increment, likeType, profileOwner, qry,
          _this = this;
        curUser = Parse.User.current();
        profileOwner = this.profileObject.get('parent');
        if (curUser && profileOwner && profileOwner.id === curUser.id) {
          console.log("Not allowed to LIKE your own profile.");
          return;
        }
        if (!window.Mi.likes) {
          window.Mi.likes = {};
        }
        if (window.Mi.likes[this.profileId]) {
          window.Mi.likes[this.profileId] *= -1;
        } else {
          window.Mi.likes[this.profileId] = 1;
        }
        increment = window.Mi.likes[this.profileId];
        likeType = Parse.Object.extend("Profile_likes");
        qry = new Parse.Query(likeType);
        qry.equalTo('parent', this.profileObject);
        return qry.find({
          success: function(results) {
            var err, newLike;
            try {
              if (results.length > 0) {
                results[0].set('likes', results[0].get('likes') + increment);
                if (results[0].get('likes') > 0) {
                  return results[0].save(null, {
                    success: function(result) {
                      var likes;
                      likes = result.get('likes');
                      $('#profile-like .overlay').text(likes);
                      console.log("liked profile " + _this.profileId + ": " + likes + " likes.");
                      return console.log('saved like: ' + result);
                    },
                    error: function(result, err) {
                      return console.log('error saving like ' + err);
                    }
                  });
                }
              } else {
                newLike = new likeType;
                newLike.set('parent', _this.profileObject);
                newLike.set('likes', 1);
                return newLike.save(null, {
                  success: function(result) {
                    var likes;
                    likes = result.get('likes');
                    $('#profile-like .overlay').text(likes);
                    return console.log("liked profile " + this.profileId + ": " + likes + " likes.");
                  },
                  error: function(result, err) {
                    return console.log('error saving like ' + err);
                  }
                });
              }
            } catch (_error) {
              err = _error;
              return console.log("error liking profile " + _this.profileId + ": " + err);
            }
          },
          error: function(results, err) {
            return console.log("error liking profile: ", err);
          }
        });
      };

      ProfileMasterView.prototype.updateProfileLikes = function() {
        var likeType, qry,
          _this = this;
        likeType = Parse.Object.extend("Profile_likes");
        qry = new Parse.Query(likeType);
        qry.equalTo('parent', this.profileObject);
        return qry.find({
          success: function(results) {
            var likes;
            if (results.length > 0) {
              likes = results[0].get('likes');
              return $('#profile-like .overlay').text(likes);
            }
          },
          error: function(results, err) {
            return console.log("error reading likes: ", err);
          }
        });
      };

      ProfileMasterView.prototype.contactMailTo = function() {
        var mailto, sendEmail;
        if (this.profileContactEmail === null) {
          window.Mi.messagesRouter.showMessage("Sorry, but this profile has not provided a contact email.");
          return;
        }
        mailto = 'mailto:' + this.profileContactEmail + '?subject=I discovered you on Across Mold';
        sendEmail = function() {
          return window.location.href = mailto;
        };
        if (Parse.User.current()) {
          return sendEmail();
        } else {
          return this.userLogin(sendEmail, "To contact, please log in or sign up.");
        }
      };

      ProfileMasterView.prototype.isUserFavorite = function() {
        var favQry, isFavorite,
          _this = this;
        if (Parse.User.current()) {
          isFavorite = false;
          favQry = new Parse.Query('User_favorites');
          favQry.equalTo('parent', user);
          favQry.equalTo('profile', pObj);
          Parse.Promise.when([favQry.find()]).then(function(allFavs) {
            if (allFavs.length > 0) {
              return isFavorite = true;
            }
          });
          return isFavorite;
        } else {
          return false;
        }
      };

      ProfileMasterView.prototype.saveProfileFavorite = function() {
        var confirmSave, doFavSave, pObj,
          _this = this;
        pObj = this.profileObject;
        confirmSave = this.confirmFavoriteSave;
        doFavSave = function(user) {
          var favQry, favType;
          favType = Parse.Object.extend("User_favorites");
          favQry = new Parse.Query('User_favorites');
          favQry.equalTo('parent', user);
          favQry.equalTo('profile', pObj);
          return favQry.find({
            success: function(results) {
              var fav;
              if (results.length > 0) {
                return confirmSave();
              } else {
                fav = new favType();
                fav.set('parent', user);
                fav.set('profile', pObj);
                return fav.save(null, {
                  success: function(result) {
                    console.log("favorite saved: " + result);
                    return confirmSave();
                  },
                  error: function(result, err) {
                    return console.log('error saving favorite: ' + err);
                  }
                });
              }
            },
            error: function(results, err) {
              return console.log("error reading favorites: ", err);
            }
          });
        };
        if (Parse.User.current()) {
          return doFavSave(Parse.User.current());
        } else {
          return this.userLogin(doFavSave, "To save a favorite, please log in or signup.");
        }
      };

      ProfileMasterView.prototype.confirmFavoriteSave = function() {
        var close;
        $('.modal').modal('hide');
        $('.popover').hide;
        $('body').append(Mi.Views.ProfileMasterView.prototype.favoriteCreatedTemplate());
        $('#favorite-created').modal({
          backdrop: 'static',
          keyboard: false
        });
        close = function() {
          return $('#favorite-created').modal('hide');
        };
        return $('#favorite-created').delegate('#fav-created-close', 'click', close);
      };

      ProfileMasterView.prototype.initGoogleMaps = function(mapId, profileType, latlng, location) {
        var circle, locationType, mapOptions, marker, updateMap, zoom;
        $(mapId).gmap3('destroy');
        if (!latlng) {
          latlng = this.profile.latlng;
        }
        if (!location) {
          location = this.profile.location;
        }
        if (!profileType) {
          profileType = this.profile.profileType;
        }
        locationType = this.profile.locationType;
        circle = {};
        if (locationType === "APPROXIMATE" || profileType === "performer" || profileType === "executive" || profileType === "behindthescenes") {
          circle.options = {
            center: latlng,
            radius: 10000,
            fillColor: "#008BB2",
            strokeColor: "#005BB7"
          };
        }
        zoom = 9;
        marker = {};
        if (locationType === "ROOFTOP") {
          if (profileType === 'business' || profileType === 'venue') {
            marker.address = location;
          }
        }
        mapOptions = {
          center: latlng,
          zoom: zoom,
          navigationControl: false,
          mapTypeControl: false,
          scaleControl: false,
          draggable: false,
          scrollwheel: false,
          streetViewControl: false,
          zoomControl: false
        };
        updateMap = function() {
          return $(mapId).gmap3({
            circle: circle,
            marker: marker,
            map: {
              options: mapOptions
            }
          });
        };
        setTimeout(updateMap, 300);
        return console.log('google maps init, location:', location);
      };

      ProfileMasterView.prototype.getProfileEmail = function(profile) {
        var pmv;
        pmv = this;
        pmv.profileContactEmail = profile.ContactEmail;
        if (!this.profileContactEmail) {
          if (profile.parent) {
            pmv.profileContactEmail = profile.parent.get('email');
          } else {
            pmv.profileContactEmail = null;
          }
        }
        return pmv.profileContactEmail;
      };

      ProfileMasterView.prototype.renderProfile = function() {
        this.$el.append(this.titleTemplate({
          profile: this.profile,
          profileId: this.profileId,
          profileContactEmail: this.profileContactEmail
        }));
        this.$el.append(this.headingTemplate({
          profile: this.profile
        }));
        this.resizeImages();
        this.$el.find('.attributes-placeholder').append(this.attributesTemplate({
          profile: this.profile,
          Mi: Mi
        }));
        return this.updateProfileLikes();
      };

      ProfileMasterView.prototype.headlinePhotoPlaceholder = function() {
        var headlinePlaceHolder;
        headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
        switch (this.profile.profileType) {
          case 'business':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
            break;
          case 'venue':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
            break;
          case 'executive':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
            break;
          case 'behindthescenes':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
        }
        return headlinePlaceHolder;
      };

      ProfileMasterView.prototype.toggleActive = function(index, skill) {
        var $j, newImage, oldImage, toggle;
        console.log("toggleActive called, skillType: ", skill.skillType);
        toggle = skill.skillType.toLowerCase().replace(/\s/g, "");
        $j = jQuery;
        oldImage = $j('img.headline-photo');
        oldImage.addClass('remove');
        newImage = $('<img/>').addClass('headline-photo').css({
          opacity: 0
        });
        if (skill && skill.skillHeadlinePhotoUrl && skill.skillHeadlinePhotoUrl.length) {
          $(newImage).attr('src', skill.skillHeadlinePhotoUrl);
        } else {
          $(newImage).attr('src', this.headlinePhotoPlaceholder());
        }
        $(newImage).insertBefore($(oldImage));
        oldImage.animate({
          opacity: 0
        }, 300);
        newImage.animate({
          opacity: 1
        }, 300);
        $(".skill-button").removeClass("active");
        $(".skill-button[data-skillid='" + index + "']").addClass("active");
        $(oldImage).remove();
        Mi.Views.ProfileSkillView.prototype.showFirstTab(this.skill);
        if (skill && skill.skillSummary) {
          return $('#summary-display').html(this.linkify(skill.skillSummary));
        }
      };

      ProfileMasterView.prototype.linkify = function(inputText) {
        var replacePattern1, replacePattern2, replacePattern3, replacedText;
        if (!inputText) {
          return null;
        }
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        return replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
      };

      ProfileMasterView.prototype.renderInitialSkill = function() {
        this.renderChildInto(new Mi.Views.ProfileSkillView({
          profile: this.profile,
          skill: this.skill
        }), ".skill-area");
        this.renderSkill(this.skill);
        return this.toggleActive(0, this.skill);
      };

      ProfileMasterView.prototype.renderSkill = function(skill) {
        this.renderSkillPhotos(skill);
        this.renderSkillDocuments(skill);
        this.renderSkillVideos(skill);
        this.resizeImages();
        this.adjustSkillButtonWidth();
        return Mi.Views.ProfileSkillView.prototype.showFirstTab(skill);
      };

      ProfileMasterView.prototype.renderSkillPhotos = function(skill, currentPhotoUrl) {
        var _this = this;
        $('#photos-tab').html(this.skillPhotosTemplate({
          skill: skill
        }));
        _.each(skill.skillPhotos, function(photo, index) {
          if (photo.photoUrl === currentPhotoUrl) {
            return _this.renderActiveSkillPhoto(index);
          }
        });
        if (!currentPhotoUrl) {
          return this.renderActiveSkillPhoto(0);
        }
      };

      ProfileMasterView.prototype.renderActiveSkillPhoto = function(index) {
        var slideInt, _ref1, _ref2,
          _this = this;
        if (((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillPhotos) != null ? _ref2.length : void 0 : void 0) > index) {
          return slideInt = setInterval(function() {
            if ($("#skill-photo-slideshow li.photo-slide-" + index).length) {
              $("#skill-photo-slideshow li").removeClass('active');
              $("li.photo-slide-" + index).addClass('active');
              $(".skill-slideshow-subnav .slide-navigate.photo").attr("id", index);
              return clearInterval(slideInt);
            } else {
              return console.log('no photos');
            }
          }, 500);
        }
      };

      ProfileMasterView.prototype.renderSkillDocuments = function(skill, currentDocumentUrl) {
        var _this = this;
        $('#documents-tab').html(this.skillDocumentsTemplate({
          skill: skill
        }));
        _.each(skill.skillDocuments, function(document, index) {
          if (document.documentUrl === currentDocumentUrl) {
            return _this.renderActiveSkillDocument(index);
          }
        });
        if (!currentDocumentUrl) {
          return this.renderActiveSkillDocument(0);
        }
      };

      ProfileMasterView.prototype.renderActiveSkillDocument = function(index) {
        var slideInt, _ref1, _ref2,
          _this = this;
        if (((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillDocuments) != null ? _ref2.length : void 0 : void 0) > index) {
          return slideInt = setInterval(function() {
            if ($("li.document-slide-" + index).length) {
              $("#skill-document-slideshow li").removeClass('active');
              $("li.document-slide-" + index).addClass('active');
              $(".skill-slideshow-subnav .slide-navigate.document").attr("id", index);
              return clearInterval(slideInt);
            } else {
              return console.log('no documents');
            }
          }, 500);
        }
      };

      ProfileMasterView.prototype.renderSkillVideos = function(skill, currentVideoId) {
        var _this = this;
        $('#videos-tab').html(this.skillVideosTemplate({
          skill: skill
        }));
        return _.each(skill.skillVideo, function(video, index) {
          if (video.youtubeId === currentVideoId) {
            _this.renderActiveSkillVideo(index);
          }
          if (!currentVideoId) {
            return _this.renderActiveSkillVideo(0);
          }
        });
      };

      ProfileMasterView.prototype.renderActiveSkillVideo = function(index) {
        var slideInt, _ref1, _ref2,
          _this = this;
        if (((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillVideo) != null ? _ref2.length : void 0 : void 0) > index) {
          return slideInt = setInterval(function() {
            if ($("li.video-slide-" + index).length) {
              $("#skill-video-slideshow li").removeClass('active');
              $("li.video-slide-" + index).addClass('active');
              $(".skill-slideshow-subnav .slide-navigate.video").attr("id", index);
              return clearInterval(slideInt);
            } else {
              return console.log('no videos');
            }
          }, 500);
        }
      };

      ProfileMasterView.prototype.displaySkill = function(event) {
        var id;
        id = $(event.currentTarget).data('skillid');
        this.skill = this.profile.skills[id];
        console.log('displaySkill ' + this.skill.skillType);
        this.renderChildInto(new Mi.Views.ProfileSkillView({
          profile: this.profile,
          skill: this.skill
        }), ".skill-area");
        this.renderSkill(this.skill);
        return this.toggleActive(id, this.skill);
      };

      ProfileMasterView.prototype.adjustSkillButtonWidth = function() {
        var buttons, doAdjustment;
        buttons = $('.skill-button');
        if (buttons.length < 2) {
          return;
        }
        doAdjustment = function() {
          var availableWidth, avgWidth, getTotalWidth, _results,
            _this = this;
          $(buttons).css('width', 'auto');
          availableWidth = $('.sub-heading-nav').width() - $('.skills-heading').width() - 20;
          if (availableWidth < 0) {
            return;
          }
          avgWidth = availableWidth / buttons.length;
          if (avgWidth < 0) {
            return;
          }
          getTotalWidth = function() {
            var totalWidth;
            totalWidth = 0;
            _.each(buttons, function(btn, index) {
              return totalWidth += parseInt($(btn).width(), 10);
            });
            return totalWidth;
          };
          _results = [];
          while (getTotalWidth() > availableWidth) {
            _results.push(_.each(buttons, function(btn, index) {
              if ($(btn).width() > avgWidth) {
                return $(btn).css('width', $(btn).width() - 1 + 'px');
              }
            }));
          }
          return _results;
        };
        return setTimeout(doAdjustment, 100);
      };

      ProfileMasterView.prototype.showshare = function() {
        $('#account-dropdown').fadeOut();
        $('.modal').modal('hide');
        $(".popover").hide();
        if ($('.device-xs:visible').length) {
          return $(".share-profile-modal").addClass('bottom').show();
        } else {
          return $(".share-profile-modal").removeClass('bottom').show();
        }
      };

      ProfileMasterView.prototype.hideshare = function() {
        return $(".share-profile-modal").hide();
      };

      return ProfileMasterView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
