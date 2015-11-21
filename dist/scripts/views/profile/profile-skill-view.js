(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'select2', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.ProfileSkillView = (function(_super) {
      __extends(ProfileSkillView, _super);

      function ProfileSkillView() {
        this.showFirstTab = __bind(this.showFirstTab, this);
        _ref = ProfileSkillView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ProfileSkillView.prototype.skillTemplate = JST['app/scripts/templates/profile/viewProfile/profileSkillViewTemplate'];

      ProfileSkillView.prototype.events = {
        'click .tab-button': 'tabNavigation',
        'click .slide-navigate.photo': 'imageSlideShow',
        'click .slide-navigate.document': 'documentSlideShow',
        'click .slide-navigate.video': 'videoSlideShow'
      };

      ProfileSkillView.prototype.initialize = function(options) {
        this.skill = options.skill;
        this.profile = options.profile;
        if (this.profile.location) {
          this.profile.location_google = 'http://www.google.com/maps?q=' + this.profile.location.replace(' ', '+');
        }
        console.log('skill view initialized, skill: ', this.skill);
        this.currentVideoIndex = 0;
        this.loadUserVideo();
        return this.loadUserAudio();
      };

      ProfileSkillView.prototype.showFirstTab = function(skill) {
        var _ref1, _ref2, _ref3, _ref4;
        if (skill) {
          if (skill != null ? (_ref1 = skill.skillPhotos) != null ? _ref1.length : void 0 : void 0) {
            this.toggleTab('photos');
          } else if (skill != null ? (_ref2 = skill.skillVideo) != null ? _ref2.length : void 0 : void 0) {
            this.toggleTab('videos');
          } else if ((_ref3 = skill.skillAudio) != null ? _ref3.soundcloud : void 0) {
            this.toggleTab('audio');
          } else if (skill != null ? (_ref4 = skill.skillDocuments) != null ? _ref4.length : void 0 : void 0) {
            this.toggleTab('docs');
          } else {
            this.toggleTab('photos');
          }
          return this.resizeImages();
        }
      };

      ProfileSkillView.prototype.render = function() {
        this.$el.append(this.skillTemplate({
          profile: this.profile,
          skill: this.skill
        }));
        this.$el.find("li.photo-slide-0").addClass('active');
        this.$el.find("li.document-slide-0").addClass('active');
        return this.$el.find("li.video-slide-0").addClass('active');
      };

      ProfileSkillView.prototype.resizeImages = function() {
        var ht, videoHt;
        if ($('.skill-element-container').length) {
          ht = $('.skill-element-container').width() / 700 * 430;
          $('#skill-video-slideshow, #skill-audio-player, #skill-document-slideshow, #skill-photo-slideshow').height(ht);
          videoHt = $('.skill-element-container').height() - $('.tab-navigation').height() - $('.skill-slideshow-subnav').height() + 1;
          return $('.skill-video-area iframe').height(videoHt);
        }
      };

      ProfileSkillView.prototype.tabNavigation = function(event) {
        var targetedTab;
        targetedTab = $(event.target).data("tabnav");
        console.log('tabNavigation called, targeted tab: ', $(event.target).data("tabnav"));
        return this.toggleTab(targetedTab);
      };

      ProfileSkillView.prototype.parseVideoUrl = function(videoUrl) {
        var video;
        video = {};
        video.id = videoUrl.split(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)[2];
        if (video.id) {
          video.type = 'youtube';
          return video;
        }
        video.id = videoUrl.split(/^.*vimeo.com\/(.*)/)[1];
        if (video.id) {
          video.type = 'vimeo';
          return video;
        }
        alert('Unrecognized video url');
        return video;
      };

      ProfileSkillView.prototype.toggleTab = function(tab) {
        $(".tab-button").removeClass("active");
        $(".tab-button[data-tabnav~='" + tab + "']").addClass("active");
        $(".tab-element").removeClass("active");
        switch (tab) {
          case "photos":
            $("#photos-tab").addClass("active");
            break;
          case "videos":
            $("#videos-tab").addClass("active");
            break;
          case "audio":
            $("#audio-tab").addClass("active");
            break;
          case "docs":
            $("#documents-tab").addClass("active");
        }
        return this.resizeImages();
      };

      ProfileSkillView.prototype.imageSlideShow = function(event) {
        var currentSlideNumber, targetSlideNumber, totalSlideCount;
        if (this.skill.skillPhotos.length < 2) {
          return;
        }
        currentSlideNumber = parseInt($(event.target).attr("id"));
        totalSlideCount = this.skill.skillPhotos.length;
        if ($(event.target).data('slideshow') === 'next') {
          targetSlideNumber = currentSlideNumber + 1;
          if (targetSlideNumber >= totalSlideCount) {
            targetSlideNumber = 0;
          }
        } else {
          targetSlideNumber = currentSlideNumber - 1;
          if (targetSlideNumber < 0) {
            targetSlideNumber = totalSlideCount - 1;
          }
        }
        $("#skill-photo-slideshow li").removeClass('active');
        $("#skill-photo-slideshow li.photo-slide-" + targetSlideNumber).addClass('active');
        return $(".slide-navigate.photo").attr("id", targetSlideNumber);
      };

      ProfileSkillView.prototype.documentSlideShow = function(event) {
        var currentSlideNumber, targetSlideNumber, totalSlideCount;
        if (this.skill.skillDocuments.length < 2) {
          return;
        }
        currentSlideNumber = parseInt($(event.target).attr("id"));
        totalSlideCount = this.skill.skillDocuments.length;
        if ($(event.target).data('slideshow') === 'next') {
          targetSlideNumber = currentSlideNumber + 1;
          if (targetSlideNumber >= totalSlideCount) {
            targetSlideNumber = 0;
          }
        } else {
          targetSlideNumber = currentSlideNumber - 1;
          if (targetSlideNumber < 0) {
            targetSlideNumber = totalSlideCount - 1;
          }
        }
        $("#skill-document-slideshow li").removeClass('active');
        $("#skill-document-slideshow li.document-slide-" + targetSlideNumber).addClass('active');
        return $(".slide-navigate.document").attr("id", targetSlideNumber);
      };

      ProfileSkillView.prototype.loadUserAudio = function() {
        var _ref1;
        if ((_ref1 = this.skill.skillAudio) != null ? _ref1.soundcloud : void 0) {
          return this.embedSCWidget(this.skill.skillAudio.soundcloud);
        }
      };

      ProfileSkillView.prototype.embedSCWidget = function() {
        var scUsername, trackUrl, _ref1, _ref2;
        if (!((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillAudio) != null ? _ref2.soundcloud : void 0 : void 0)) {
          scUsername = $(".soundcloud-username-input").val();
          this.skill.skillAudio.soundcloud = scUsername;
          this.saveAndUpdateProgress();
          $("#skillAudioEdit").hide();
        } else {
          scUsername = this.skill.skillAudio.soundcloud;
          $("#skillAudioEdit").hide();
        }
        trackUrl = "http://soundcloud.com/" + scUsername;
        return SC.oEmbed(trackUrl, {
          auto_play: false,
          maxheight: 430
        }, function(oEmbed) {
          console.log("oEmbed response: " + oEmbed);
          return $(".audio-track-area").html(oEmbed.html);
        });
      };

      ProfileSkillView.prototype.videoSlideShow = function(event) {
        var currentSlideNumber, targetSlideNumber, totalSlideCount;
        if (this.skill.skillVideo.length < 2) {
          return;
        }
        currentSlideNumber = parseInt($(event.target).attr("id"));
        totalSlideCount = this.skill.skillVideo.length;
        if ($(event.target).data('slideshow') === 'next') {
          targetSlideNumber = currentSlideNumber + 1;
          if (targetSlideNumber >= totalSlideCount) {
            targetSlideNumber = 0;
          }
        } else {
          targetSlideNumber = currentSlideNumber - 1;
          if (targetSlideNumber < 0) {
            targetSlideNumber = totalSlideCount - 1;
          }
        }
        return this.displayVideoAt(targetSlideNumber);
      };

      ProfileSkillView.prototype.buildVideoSrc = function(videoType, videoId) {
        if (videoType === 'youtube') {
          return 'src="http://www.youtube.com/embed/' + videoId + '?rel=0&wmode=transparent" autoplay="0" frameborder="0" wmode="transparent"';
        }
        if (videoType === 'vimeo') {
          return 'src="http://player.vimeo.com/video/' + videoId + '?wmode=transparent" wmode="transparent"';
        }
        return console.log('Unrecognized video type');
      };

      ProfileSkillView.prototype.displayVideoAt = function(index) {
        var video, videoIframe, videoSrc, videoUrl;
        videoUrl = this.skill.skillVideo[index].videoUrl;
        if (!videoUrl) {
          videoUrl = this.skill.skillVideo[index].youtubeUrl;
        }
        video = this.parseVideoUrl(videoUrl);
        videoSrc = this.buildVideoSrc(video.type, video.id);
        videoIframe = this.initVideo(videoSrc);
        $('li.description.video-slide-' + index).text(this.skill.skillVideo[index].description);
        $("#skill-video-slideshow li").removeClass('active');
        $("li.video-slide-" + index).addClass('active');
        $(".skill-slideshow-subnav .slide-navigate.video").attr("id", index);
        $('#skill-video-slideshow .skill-video-area').html(videoIframe);
        return this.resizeImages();
      };

      ProfileSkillView.prototype.initVideo = function(videoSrc) {
        var videoIframe;
        videoIframe = "<iframe id='videoplayer' type='text/html'" + videoSrc + "></iframe>";
        console.log('initVideo called, video url:', videoSrc);
        return videoIframe;
      };

      ProfileSkillView.prototype.loadUserVideo = function() {
        var videoInt, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
          _this = this;
        console.log('loadUserVideo called');
        if (((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillVideo) != null ? (_ref3 = _ref2[0]) != null ? _ref3.youtubeUrl : void 0 : void 0 : void 0) || ((_ref4 = this.skill) != null ? (_ref5 = _ref4.skillVideo) != null ? (_ref6 = _ref5[0]) != null ? _ref6.videoUrl : void 0 : void 0 : void 0)) {
          return videoInt = setInterval(function() {
            if ($(".skill-video-area").length) {
              _this.displayVideoAt(0);
              return clearInterval(videoInt);
            } else {
              return console.log('nope');
            }
          }, 500);
        }
      };

      return ProfileSkillView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
