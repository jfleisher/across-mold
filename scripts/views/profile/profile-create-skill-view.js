(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'select2', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.ProfileCreateSkillView = (function(_super) {
      __extends(ProfileCreateSkillView, _super);

      function ProfileCreateSkillView() {
        this.grabImage = __bind(this.grabImage, this);
        this.savePhoto = __bind(this.savePhoto, this);
        this.uploadSkillPhoto = __bind(this.uploadSkillPhoto, this);
        this.showFirstTab = __bind(this.showFirstTab, this);
        _ref = ProfileCreateSkillView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ProfileCreateSkillView.prototype.skillTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillViewTemplate'];

      ProfileCreateSkillView.prototype.skillDocumentSlideTemplate = JST['app/scripts/templates/profile/editProfile/skillDocumentSlideshowRerender'];

      ProfileCreateSkillView.prototype.publishButtonTemplate = JST['app/scripts/templates/profile/editProfile/profileEditPublishStatusTemplate'];

      ProfileCreateSkillView.prototype.skillPhotosTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillPhotosTemplate'];

      ProfileCreateSkillView.prototype.skillDocumentsTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillDocumentsTemplate'];

      ProfileCreateSkillView.prototype.skillVideosTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillVideosTemplate'];

      ProfileCreateSkillView.prototype.events = {
        'click div.tab-button': 'tabNavigation',
        'click #save-skill-summary': 'updateSkillSummary',
        'click #add-skill-photo': 'addNewSkillPhoto',
        'click div.edit-photo': 'editSkillPhoto',
        'click .slide-navigate.photo': 'imageSlideShow',
        'change #skillImgUpload': 'grabImage',
        'click #save-skill-photo': 'saveSkillImage',
        'click #delete-skill-photo': 'confirmSkillPhotoDelete',
        'click #delete-skill-photo-confirm': 'deleteSkillPhoto',
        'click #add-skill-document': 'addNewSkillDocument',
        'click #edit-document': 'editSkillDocument',
        'click .slide-navigate.document': 'documentSlideShow',
        'change #skillDocUpload': 'grabSkillDocument',
        'click #save-skill-document': 'saveSkillDocument',
        'click #delete-skill-document': 'confirmSkillDocumentDelete',
        'click #delete-skill-document-confirm': 'deleteSkillDocument',
        'click #add-skill-video': 'addNewSkillVideo',
        'click #skill-video-edit-icon': 'editSkillVideo',
        'click .slide-navigate.video': 'videoSlideShow',
        'click #save-skill-video': 'saveSkillVideo',
        'click #delete-skill-video': 'confirmSkillVideoDelete',
        'click #delete-skill-video-confirm': 'deleteSkillVideo',
        'click #skill-audio-edit': 'editAudioLogin',
        'click .soundcloud-auth': 'initSoundCloud',
        'click #save-soundcloud-username': 'saveAudioLogin'
      };

      ProfileCreateSkillView.prototype.initialize = function(options) {
        console.log('create skill for profile: ', options.profile.id);
        this.profile = options.profile;
        this.skill = options.skill;
        this.skillIndex = options.index;
        this.renderActiveSkillPhoto(0);
        this.renderActiveSkillDocument(0);
        this.renderActiveSkillVideo(0);
        return this.loadUserAudio();
      };

      ProfileCreateSkillView.prototype.showFirstTab = function(skill) {
        var _ref1, _ref2, _ref3, _ref4;
        if (skill) {
          if (skill != null ? (_ref1 = skill.skillPhotos) != null ? _ref1.length : void 0 : void 0) {
            return this.toggleTab('photos');
          } else if (skill != null ? (_ref2 = skill.skillVideo) != null ? _ref2.length : void 0 : void 0) {
            return this.toggleTab('videos');
          } else if ((_ref3 = skill.skillAudio) != null ? _ref3.soundcloud : void 0) {
            return this.toggleTab('audio');
          } else if (skill != null ? (_ref4 = skill.skillDocuments) != null ? _ref4.length : void 0 : void 0) {
            return this.toggleTab('docs');
          } else {
            return this.toggleTab('photos');
          }
        }
      };

      ProfileCreateSkillView.prototype.render = function() {
        var _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
        this.$el.append(this.skillTemplate({
          skill: this.skill,
          profileType: this.profile.get('profileType'),
          Mi: Mi
        }));
        if (this.skill) {
          if ((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillPhotos) != null ? _ref2.length : void 0 : void 0) {
            this.toggleTab('photos');
          } else if ((_ref3 = this.skill) != null ? (_ref4 = _ref3.skillVideo) != null ? _ref4.length : void 0 : void 0) {
            this.toggleTab('videos');
          } else if ((_ref5 = this.skill.skillAudio) != null ? _ref5.soundcloud : void 0) {
            this.toggleTab('audio');
          } else if ((_ref6 = this.skill) != null ? (_ref7 = _ref6.skillDocuments) != null ? _ref7.length : void 0 : void 0) {
            this.toggleTab('docs');
          } else {
            this.toggleTab('photos');
          }
        }
        return this;
      };

      ProfileCreateSkillView.prototype.saveAndUpdateProgress = function() {
        var _this = this;
        return this.profile.save(null, {
          success: function(response) {
            if (_this.renderProgressBar) {
              return _this.renderProgressBar();
            } else {
              return _this.parent.renderProgressBar();
            }
          }
        });
      };

      ProfileCreateSkillView.prototype.renderProgressBar = function() {
        var getCompleteness, percentage, profile;
        if (this.profile) {
          profile = this.profile;
        } else {
          profile = this.parent.profile;
        }
        if (this.getProfileCompleteness) {
          getCompleteness = this.getProfileCompleteness;
        } else {
          getCompleteness = this.parent.getProfileCompleteness;
        }
        percentage = getCompleteness(profile);
        console.log('renderProgressBar called, percentage complete:', percentage);
        $(".percentage-complete").html(percentage);
        $(".progress-bar").css("width", percentage * 2.5);
        return $("#publish-status").html(this.publishButtonTemplate({
          isPublished: profile.attributes.profilePublished,
          lessThan50: percentage < 50
        }));
      };

      ProfileCreateSkillView.prototype.renderActiveSkillPhoto = function(index) {
        var slideInt, _ref1, _ref2,
          _this = this;
        if (((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillPhotos) != null ? _ref2.length : void 0 : void 0) > index) {
          return slideInt = setInterval(function() {
            if ($("#skill-photo-slideshow li.photo-slide-" + index).length) {
              clearInterval(slideInt);
              return _this.displayPhotoAt(index);
            } else {
              return console.log('no photos');
            }
          }, 500);
        }
      };

      ProfileCreateSkillView.prototype.displayPhotoAt = function(index) {
        $("#skill-photo-slideshow li").removeClass('active');
        $("li.photo-slide-" + index).addClass('active');
        return $(".skill-slideshow-subnav .slide-navigate.photo").attr("id", index);
      };

      ProfileCreateSkillView.prototype.resizeImages = function() {
        var ht, videoHt;
        if ($('.skill-element-container').length) {
          ht = $('.skill-element-container').width() / 700 * 430;
          $('#skill-video-slideshow, #skill-audio-player, #skill-document-slideshow, #skill-photo-slideshow').height(ht);
          videoHt = $('.skill-element-container').height() - $('.tab-navigation').height() - $('.skill-slideshow-subnav').height() + 1;
          return $('.skill-video-area iframe').height(videoHt);
        }
      };

      ProfileCreateSkillView.prototype.renderActiveSkillDocument = function(index) {
        var slideInt, _ref1, _ref2,
          _this = this;
        if (((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillDocuments) != null ? _ref2.length : void 0 : void 0) > index) {
          return slideInt = setInterval(function() {
            if ($("li.document-slide-" + index).length) {
              clearInterval(slideInt);
              return _this.displayDocumentAt(index);
            } else {
              return console.log('no documents');
            }
          }, 500);
        }
      };

      ProfileCreateSkillView.prototype.displayDocumentAt = function(index) {
        $("#skill-document-slideshow li").removeClass('active');
        $("li.document-slide-" + index).addClass('active');
        return $(".skill-slideshow-subnav .slide-navigate.document").attr("id", index);
      };

      ProfileCreateSkillView.prototype.renderActiveSkillVideo = function(index) {
        var videoInt, _ref1, _ref2,
          _this = this;
        console.log('render Video called');
        if (((_ref1 = this.skill) != null ? (_ref2 = _ref1.skillVideo) != null ? _ref2.length : void 0 : void 0) > index) {
          return videoInt = setInterval(function() {
            if ($('#skill-video-slideshow').length) {
              clearInterval(videoInt);
              return _this.displayVideoAt(index);
            } else {
              return console.log('no videos');
            }
          }, 500);
        }
      };

      ProfileCreateSkillView.prototype.parseVideoUrl = function(videoUrl) {
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

      ProfileCreateSkillView.prototype.buildVideoSrc = function(videoType, videoId) {
        if (videoType === 'youtube') {
          return 'src="http://www.youtube.com/embed/' + videoId + '?rel=0&wmode=transparent" autoplay="0" frameborder="0" wmode="transparent"';
        }
        if (videoType === 'vimeo') {
          return 'src="http://player.vimeo.com/video/' + videoId + '" wmode="transparent"';
        }
        return alert('Unrecognized video type');
      };

      ProfileCreateSkillView.prototype.displayVideoAt = function(index) {
        var video, videoIframe, videoSrc, videoUrl;
        videoUrl = this.skill.skillVideo[index].videoUrl;
        if (!videoUrl) {
          videoUrl = this.skill.skillVideo[index].youtubeUrl;
        }
        video = this.parseVideoUrl(videoUrl);
        if (video.type === 'vimeo') {
          $('div.edit-video').css('top', '79px').css('right', '52px').css('width', '37px').css('height', '37px');
          $('#skill-video-edit-icon').css('top', '8px').css('left', '7px');
        } else {
          $('div.edit-video').css('top', '105px').css('right', '').css('width', '30px').css('height', '30px');
          $('#skill-video-edit-icon').css('top', '').css('left', '');
        }
        videoSrc = this.buildVideoSrc(video.type, video.id);
        videoIframe = this.initVideo(videoSrc);
        $('li.description.video-slide-' + index).text(this.skill.skillVideo[index].description);
        $('#skill-video-edit-icon').data('index', index);
        $("#skill-video-slideshow li").removeClass('active');
        $("li.video-slide-" + index).addClass('active');
        $(".skill-slideshow-subnav .slide-navigate.video").attr("id", index);
        $('#skill-video-slideshow div.skill-video-area').html(videoIframe);
        return this.resizeImages();
      };

      ProfileCreateSkillView.prototype.loadUserAudio = function() {
        var _ref1;
        if (this.skill && ((_ref1 = this.skill.skillAudio) != null ? _ref1.soundcloud : void 0)) {
          return this.embedSCWidget(this.skill.skillAudio.soundcloud);
        }
      };

      ProfileCreateSkillView.prototype.tabNavigation = function(event) {
        var targetedTab;
        targetedTab = $(event.target).data("tabnav");
        console.log('tabNavigation called, targeted tab: ', $(event.target).data("tabnav"));
        return this.toggleTab(targetedTab);
      };

      ProfileCreateSkillView.prototype.toggleTab = function(tab) {
        $(".tab-element").removeClass("active");
        $(".tab-button").removeClass("active");
        $(".tab-button[data-tabnav~='" + tab + "']").addClass("active");
        switch (tab) {
          case "photos":
            return $("#photos-tab").addClass("active");
          case "videos":
            return $("#videos-tab").addClass("active");
          case "audio":
            return $("#audio-tab").addClass("active");
          case "docs":
            return $("#documents-tab").addClass("active");
        }
      };

      ProfileCreateSkillView.prototype.imageSlideShow = function(event) {
        var currentSlideNumber, targetSlideNumber, totalSlideCount;
        if (this.skill.skillPhotos.length < 2) {
          return;
        }
        currentSlideNumber = parseInt($(event.target).attr("id"));
        totalSlideCount = $("#skill-photo-slideshow li.counter").length;
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
        return this.displayPhotoAt(targetSlideNumber);
      };

      ProfileCreateSkillView.prototype.documentSlideShow = function(event) {
        var currentSlideNumber, targetSlideNumber, totalSlideCount;
        if (this.skill.skillDocuments.length < 2) {
          return;
        }
        currentSlideNumber = parseInt($(event.target).attr("id"));
        totalSlideCount = $("#skill-document-slideshow li.counter").length;
        if ($(event.target).data('slideshow') === 'next') {
          targetSlideNumber = currentSlideNumber + 1;
          if (targetSlideNumber >= totalSlideCount) {
            targetSlideNumber = 0;
          }
        } else {
          targetSlideNumber = currentSlideNumber - 1;
          if (targetSlideNumber < 0) {
            targetSlideNumber = totalSlideCount(-1);
          }
        }
        return this.displayDocumentAt(targetSlideNumber);
      };

      ProfileCreateSkillView.prototype.videoSlideShow = function(event) {
        var currentSlideNumber, targetSlideNumber, totalSlideCount;
        if (this.skill.skillVideo.length < 2) {
          return;
        }
        currentSlideNumber = parseInt($(event.target).attr("id"));
        totalSlideCount = $("#skill-video-slideshow li.counter").length;
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

      ProfileCreateSkillView.prototype.editAudioLogin = function() {
        $('#soundcloud-username').val(this.skill.skillAudio.soundcloud);
        return window.Mi.appRouter.showEdit('#skillAudioEdit');
      };

      ProfileCreateSkillView.prototype.saveAudioLogin = function() {
        this.skill.skillAudio.soundcloud = $('#soundcloud-username').val();
        this.saveAndUpdateProgress();
        return this.embedSCWidget();
      };

      ProfileCreateSkillView.prototype.linkify = function(inputText) {
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

      ProfileCreateSkillView.prototype.updateSkillSummary = function() {
        var newSkillSummary;
        newSkillSummary = $(".summary-textarea").val();
        $("#summary-display").html(newSkillSummary);
        console.log('updateSkillSummary called, newSkillSummary: ', newSkillSummary);
        this.skill.skillSummary = newSkillSummary;
        $("#skillSummaryEdit").hide();
        this.saveAndUpdateProgress();
        if (newSkillSummary) {
          return $('#summary-display').html(this.linkify(newSkillSummary));
        }
      };

      ProfileCreateSkillView.prototype.embedSCWidget = function() {
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

      ProfileCreateSkillView.prototype.uploadSkillPhoto = function(index, imageFile) {
        var error, success,
          _this = this;
        console.log('uploadSkillPhoto called');
        error = function(err) {
          alert('Failed to upload image');
          return console.log('Failed to upload profile image: ', err);
        };
        success = function(url) {
          console.log("File available at: " + url);
          $("#skillPhotoEdit").hide();
          if (index < _this.skill.skillPhotos.length) {
            return _this.updateSkillPhoto(index, url);
          } else {
            return _this.addSkillPhoto(url);
          }
        };
        return this.savePhoto(imageFile, this.imgcfg, success, error);
      };

      ProfileCreateSkillView.prototype.savePhoto = function(file, imgcfg, success, failure) {
        var canvas, context, pvwImage, reader, scaleHeight, scaleWidth, sheight, swidth, sx, sy, tgtLeft, tgtTop, xratio, yratio,
          _this = this;
        pvwImage = $(imgcfg.preview + ' img');
        tgtTop = $(pvwImage).position().top;
        tgtLeft = $(pvwImage).position().left;
        scaleWidth = $(pvwImage).width();
        scaleHeight = $(pvwImage).height();
        canvas = document.getElementById('imgUtil');
        if (canvas) {
          document.body.removeChild(canvas);
        }
        canvas = document.createElement("canvas");
        canvas.id = 'imgUtl';
        context = canvas.getContext('2d');
        canvas.width = imgcfg.width;
        canvas.height = imgcfg.height;
        if (imgcfg.backgroundColor) {
          context.fillStyle = imgcfg.backgroundColor;
          context.fillRect(0, 0, imgcfg.width, imgcfg.height);
        }
        xratio = imgcfg.width / imgcfg.editWidth;
        yratio = imgcfg.height / imgcfg.editHeight;
        sx = tgtLeft * xratio;
        sy = tgtTop * yratio;
        swidth = scaleWidth * xratio;
        sheight = scaleHeight * yratio;
        reader = new FileReader();
        reader.onload = function(event) {
          var img;
          console.log('load for resizing: ', file.name);
          img = new Image;
          img.onload = function() {
            var dataurl, imgData, parseFile;
            context.drawImage(img, sx, sy, swidth, sheight);
            dataurl = canvas.toDataURL("image/jpeg");
            imgData = {
              base64: dataurl.split(',')[1]
            };
            parseFile = new Parse.File(file.name, {
              base64: dataurl.substring(23)
            });
            return parseFile.save().then(function() {
              return success(parseFile.url());
            }, function() {
              return failure(parseFile.url());
            });
          };
          return img.src = event.target.result;
        };
        return reader.readAsDataURL(file);
      };

      ProfileCreateSkillView.prototype.updateSkillPhoto = function(index, filepath) {
        var _this = this;
        this.skill.skillPhotos[index].photoUrl = filepath;
        console.log('update path to photo: ', filepath);
        this.curPhotoUrl = filepath;
        return this.profile.save(null, {
          success: function(result) {
            return _this.renderSkillPhotos(_this.skill, _this.curPhotoUrl);
          },
          error: function(result) {
            return console.log(result);
          }
        });
      };

      ProfileCreateSkillView.prototype.addSkillPhoto = function(filepath) {
        var newSkillPhoto,
          _this = this;
        newSkillPhoto = {
          photoDesc: $(".skill-photo").val(),
          photoUrl: filepath
        };
        console.log('path to photo: ', filepath);
        console.log('newSkillPhoto: ', newSkillPhoto);
        this.skill.skillPhotos.push(newSkillPhoto);
        this.curPhotoUrl = filepath;
        return this.profile.save(null, {
          success: function(result) {
            return _this.renderSkillPhotos(_this.skill, _this.curPhotoUrl);
          },
          error: function(result) {
            return console.log(result);
          }
        });
      };

      ProfileCreateSkillView.prototype.imgcfg = {
        ratio: 1.64,
        width: 950,
        height: 580,
        editWidth: 570,
        editHeight: 348,
        resultWidth: 600,
        resultHeight: 366,
        preview: "#skillPicturePreview",
        backgroundColor: "#FFFFFF"
      };

      ProfileCreateSkillView.prototype.grabImage = function(event) {
        var files, imgcfg, reader;
        imgcfg = this.imgcfg;
        $('#save-skill-photo').val('Upload').removeAttr('disabled');
        files = event.target.files || e.dataTransfer.files;
        console.log(files);
        this.imageFile = files[0];
        reader = new FileReader();
        reader.onload = function(event) {
          var pvImg,
            _this = this;
          pvImg = $('<img></img>').attr("src", event.target.result).load(function() {
            var img;
            img = new Image;
            return img.src = event.target.result;
          });
          $(imgcfg.preview).html('').append(pvImg);
          $(pvImg).css('width', imgcfg.editWidth);
          return $(pvImg).cropimg({
            resultWidth: imgcfg.resultWidth,
            resultHeight: imgcfg.resultHeight,
            zoomDelay: 10,
            inputPrefix: 'ci-'
          });
        };
        if (this.imageFile) {
          return reader.readAsDataURL(this.imageFile);
        }
      };

      ProfileCreateSkillView.prototype.editSkillPhoto = function(event) {
        var currentIndex, currentPhoto, editDiv, photoUrl, pvwImg;
        this.imageFile = void 0;
        currentIndex = $('#photos-tab li.photo.active').data('index');
        if (currentIndex === void 0 || currentIndex === null) {
          this.addNewSkillPhoto(event);
          return;
        }
        currentPhoto = this.skill.skillPhotos[currentIndex];
        $('#photo-edit-title').text('Edit photo for ' + this.skill.skillType);
        $('#skillImgUpload').val('');
        editDiv = $('#skillPicturePreview');
        $('#save-skill-photo').val('Save').data('index', currentIndex).removeAttr('disabled');
        photoUrl = currentPhoto.photoUrl;
        if (!photoUrl) {
          photoUrl = 'images/placeholder_imgs/gallery_placeholder.jpg';
        }
        pvwImg = $('<img></img>').attr('src', photoUrl).width('100%');
        $(editDiv).html('').append(pvwImg);
        $('#photo-upload-desc').val(currentPhoto.photoDesc);
        $('#upload-skill-photo').hide();
        $('#delete-skill-photo').show();
        $('#skill-photo-upload-buttons').hide();
        return window.Mi.appRouter.showEdit('#skillPhotoEdit');
      };

      ProfileCreateSkillView.prototype.addNewSkillPhoto = function(event) {
        var pvwImg;
        this.imageFile = void 0;
        $('#photo-edit-title').text('Add photo for ' + this.skill.skillType);
        $('#skillImgUpload').val('');
        pvwImg = $('<img src="images/placeholder_imgs/gallery_placeholder.jpg" style="width:100%;"></img>');
        $('#skillPicturePreview').html('').append(pvwImg);
        $('#skillPicturePreview').attr('src', '');
        $('#photo-upload-desc').val(null);
        $('#upload-skill-photo').show();
        $('#save-skill-photo').val('Upload').attr('disabled', true).data('index', this.skill.skillPhotos.length);
        $('#delete-skill-photo').hide();
        return window.Mi.appRouter.showEdit('#skillPhotoEdit');
      };

      ProfileCreateSkillView.prototype.saveSkillImage = function() {
        var curDesc, curIndex;
        curIndex = $('#save-skill-photo').data('index');
        if (curIndex < this.skill.skillPhotos.length) {
          curDesc = $('#photo-upload-desc').val();
          this.skill.skillPhotos[curIndex].photoDesc = curDesc;
          $('#photos-tab li.description.active').text(curDesc);
          this.saveAndUpdateProgress();
        }
        if (this.imageFile) {
          this.uploadSkillPhoto(curIndex, this.imageFile);
        }
        return $('#skillPhotoEdit').hide();
      };

      ProfileCreateSkillView.prototype.confirmSkillPhotoDelete = function() {
        return window.Mi.appRouter.showEdit('#skill-photo-delete-modal');
      };

      ProfileCreateSkillView.prototype.deleteSkillPhoto = function(event) {
        var indexToDelete, showFile;
        indexToDelete = $('#save-skill-photo').data('index');
        if (indexToDelete > -1) {
          this.skill.skillPhotos.splice(indexToDelete, 1);
          this.saveAndUpdateProgress();
          $('#skillPhotoEdit').hide();
        }
        $('#skill-photo-delete-modal').hide();
        if (indexToDelete > 0) {
          showFile = this.skill.skillPhotos[indexToDelete - 1].photoUrl;
        } else if (this.skill.skillPhotos.length) {
          showFile = this.skill.skillPhotos[0].photoUrl;
        } else {
          showFile = void 0;
        }
        return this.renderSkillPhotos(this.skill, showFile);
      };

      ProfileCreateSkillView.prototype.get4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };

      ProfileCreateSkillView.prototype.createGuid = function() {
        return (this.get4() + this.get4() + "-" + this.get4() + "-" + this.get4() + "-" + this.get4() + "-" + this.get4() + this.get4() + this.get4()).toUpperCase();
      };

      ProfileCreateSkillView.prototype.renderSkillPhotos = function(skill, currentPhotoUrl) {
        var _this = this;
        $('#photos-tab').html(this.skillPhotosTemplate({
          skill: skill
        }));
        if (currentPhotoUrl) {
          _.each(skill.skillPhotos, function(photo, index) {
            if (photo.photoUrl === currentPhotoUrl) {
              return _this.renderActiveSkillPhoto(index);
            }
          });
        } else {
          this.renderActiveSkillPhoto(0);
        }
        return this.resizeImages();
      };

      ProfileCreateSkillView.prototype.renderSkillDocuments = function(skill, currentDocUrl) {
        var _this = this;
        $('#documents-tab').html(this.skillDocumentsTemplate({
          skill: skill
        }));
        if (currentDocUrl) {
          return _.each(skill.skillDocuments, function(doc, index) {
            if (doc.url === currentDocUrl) {
              return _this.renderActiveSkillDocument(index);
            }
          });
        } else {
          return this.renderActiveSkillDocument(0);
        }
      };

      ProfileCreateSkillView.prototype.renderSkillVideos = function(skill, currentVideoId) {
        var _this = this;
        $('#videos-tab').html(this.skillVideosTemplate({
          skill: skill
        }));
        if (currentVideoId) {
          return _.each(skill.skillVideo, function(video, index) {
            if (video.youtubeId === currentVideoId) {
              return _this.renderActiveSkillVideo(index);
            } else if (video.videoId === currentVideoId) {
              return _this.renderActiveSkillVideo(index);
            }
          });
        } else {
          return this.renderActiveSkillVideo(0);
        }
      };

      ProfileCreateSkillView.prototype.grabSkillDocument = function(event) {
        var files;
        $('#save-skill-document').val('Upload').removeAttr('disabled');
        files = event.target.files || event.dataTransfer.files;
        this.skillDoc = files[0];
        return this.forceDocUpload = true;
      };

      ProfileCreateSkillView.prototype.uploadSkillDocument = function(curIndex) {
        var docName, serverUrl,
          _this = this;
        $('#save-skill-document').attr('disabled', true);
        console.log('uploadDocument called');
        serverUrl = 'https://api.parse.com/1/files/' + this.skillDoc.name;
        docName = this.skillDoc.name;
        return $.ajax({
          type: "POST",
          beforeSend: function(request) {
            request.setRequestHeader("X-Parse-Application-Id", 'fbbuZEiOyi3wJXNgLKbBsTknPnsGFx2lKzDjyCyS');
            request.setRequestHeader("X-Parse-REST-API-Key", '6yPVARUIV1JyEdK3ZxREPl1vVeYLDViSAo2KJicw');
            return request.setRequestHeader("Content-Type", _this.skillDoc.type);
          },
          url: serverUrl,
          data: this.skillDoc,
          processData: false,
          contentType: false,
          success: function(data) {
            console.log("File available at: " + data.url);
            if (curIndex < _this.skill.skillDocuments.length) {
              _this.updateSkillDocument(curIndex, docName, data.url);
            } else {
              _this.addSkillDocument(docName, data.url);
            }
            return $('#skillDocumentEdit').hide();
          },
          error: function(data, error) {
            var obj;
            obj = jQuery.parseJSON(data);
            return alert(obj.error);
          }
        });
      };

      ProfileCreateSkillView.prototype.addSkillDocument = function(docName, fileUrl) {
        var newSkillDoc,
          _this = this;
        newSkillDoc = {
          name: docName,
          title: $(".skill-document-title").val(),
          desc: $(".skill-document-desc").val(),
          url: fileUrl
        };
        console.log('path to document: ', fileUrl);
        console.log('newSkillDocument: ', newSkillDoc);
        this.skill.skillDocuments.push(newSkillDoc);
        this.curDocumentUrl = fileUrl;
        return this.profile.save(null, {
          success: function(result) {
            return _this.renderSkillDocuments(_this.skill, _this.curDocumentUrl);
          },
          error: function(result) {
            return console.log(result);
          }
        });
      };

      ProfileCreateSkillView.prototype.editSkillDocument = function(event) {
        var currentDocument, currentIndex;
        currentIndex = $('#documents-tab li.document.active').data('index');
        if (currentIndex === void 0 || currentIndex === null) {
          this.addNewSkillDocument(event);
          return;
        }
        currentDocument = this.skill.skillDocuments[currentIndex];
        $('#document-edit-title').text('Edit document for ' + this.skill.skillType);
        $('#skillDocUpload').val('');
        $('#save-skill-document').val('Save').data('index', currentIndex).removeAttr('disabled');
        $('textarea.skill-document-desc').val(currentDocument.desc);
        $('input.skill-document-title').val(currentDocument.title);
        $('#delete-skill-document').show();
        return window.Mi.appRouter.showEdit('#skillDocumentEdit');
      };

      ProfileCreateSkillView.prototype.confirmSkillDocumentDelete = function() {
        return window.Mi.appRouter.showEdit('#skill-document-delete-modal');
      };

      ProfileCreateSkillView.prototype.addNewSkillDocument = function(event) {
        $('#document-edit-title').text('Add document for ' + this.skill.skillType);
        $('#skillDocUpload').val('');
        $('#save-skill-document').val('Upload').attr('disabled', true).data('index', this.skill.skillDocuments.length);
        $('input.skill-document-title').val(null);
        $('textarea.skill-document-desc').val(null);
        $('#delete-skill-document').hide();
        return window.Mi.appRouter.showEdit('#skillDocumentEdit');
      };

      ProfileCreateSkillView.prototype.saveSkillDocument = function() {
        var curIndex;
        curIndex = $('#save-skill-document').data('index');
        if (this.forceDocUpload || curIndex >= this.skill.skillDocuments.length) {
          return this.uploadSkillDocument(curIndex);
        } else {
          return this.updateSkillDocument(curIndex);
        }
      };

      ProfileCreateSkillView.prototype.updateSkillDocument = function(curIndex, docName, docUrl) {
        var curDesc, curTitle;
        curDesc = $('textarea.skill-document-desc').val();
        curTitle = $('input.skill-document-title').val();
        this.skill.skillDocuments[curIndex].title = curTitle;
        this.skill.skillDocuments[curIndex].desc = curDesc;
        if (docName) {
          this.skill.skillDocuments[curIndex].name = docName;
        }
        if (docUrl) {
          this.skill.skillDocuments[curIndex].url = docUrl;
        }
        $('#documents-tab li.active div.description').text(curDesc);
        $('#document-title-' + (curIndex + 1)).text(curTitle);
        $('#documents-tab li.active div.title').text(curTitle);
        this.saveAndUpdateProgress();
        $('#skillDocumentEdit').hide();
        return this.renderSkillDocuments(this.skill, this.skill.skillDocuments[curIndex].url);
      };

      ProfileCreateSkillView.prototype.deleteSkillDocument = function(event) {
        var indexToDelete, showFile;
        $('#skillDocumentDeleteConfirm').hide();
        indexToDelete = $('#save-skill-document').data('index');
        if (indexToDelete >= 0) {
          this.skill.skillDocuments.splice(indexToDelete, 1);
          this.saveAndUpdateProgress();
          $('#skillDocumentEdit').hide();
        }
        $('#skill-document-delete-modal').hide();
        if (indexToDelete > 0) {
          showFile = this.skill.skillDocuments[indexToDelete - 1].url;
        } else if (this.skill.skillDocuments.length) {
          showFile = this.skill.skillDocuments[0].url;
        } else {
          showFile = void 0;
        }
        return this.renderSkillDocuments(this.skill, showFile);
      };

      ProfileCreateSkillView.prototype.addNewSkillVideo = function(event) {
        $('#video-edit-title').text('Add video for ' + this.skill.skillType);
        $("#save-skill-video").data('index', this.skill.skillVideo.length);
        $('#video_url_edit').val('');
        $('#video_description_edit').val('');
        return window.Mi.appRouter.showEdit('#skillVideoEdit');
      };

      ProfileCreateSkillView.prototype.editSkillVideo = function(event) {
        var curIndex, videoUrl;
        curIndex = $('#skill-video-edit-icon').data('index');
        if (curIndex === void 0 || curIndex === null) {
          this.addNewSkillVideo(event);
          return;
        }
        videoUrl = this.skill.skillVideo[curIndex].videoUrl;
        if (!videoUrl) {
          videoUrl = this.skill.skillVideo[curIndex].youtubeUrl;
        }
        $('#video-edit-title').text('Edit video for ' + this.skill.skillType);
        $("#save-skill-video").data('index', curIndex);
        $('#video_url_edit').val(videoUrl);
        $('#video_description_edit').val(this.skill.skillVideo[curIndex].description);
        return window.Mi.appRouter.showEdit('#skillVideoEdit');
      };

      ProfileCreateSkillView.prototype.saveSkillVideo = function() {
        var curIndex, desc, newVideo, url, video;
        curIndex = $('#save-skill-video').data('index');
        url = $('#video_url_edit').val();
        desc = $('#video_description_edit').val();
        console.log('video input val:', url, 'index: ', curIndex);
        video = this.parseVideoUrl(url);
        if (curIndex < this.skill.skillVideo.length) {
          this.skill.skillVideo[curIndex].videoUrl = url;
          this.skill.skillVideo[curIndex].videoId = video.id;
          this.skill.skillVideo[curIndex].videoType = video.type;
          this.skill.skillVideo[curIndex].description = desc;
        } else {
          newVideo = {
            videoUrl: url,
            videoId: video.id,
            videoType: video.type,
            description: desc
          };
          this.skill.skillVideo.push(newVideo);
        }
        this.renderSkillVideos(this.skill, this.skill.skillVideo[curIndex].videoId);
        $('#skillVideoEdit').hide();
        return this.saveAndUpdateProgress();
      };

      ProfileCreateSkillView.prototype.initVideo = function(videoSrc) {
        var videoIframe;
        videoIframe = "<iframe id='videoplayer' type='text/html' " + videoSrc + "></iframe>";
        console.log('initVideo called, video url:', videoSrc);
        return videoIframe;
      };

      ProfileCreateSkillView.prototype.confirmSkillVideoDelete = function() {
        return window.Mi.appRouter.showEdit('#skill-video-delete-modal');
      };

      ProfileCreateSkillView.prototype.deleteSkillVideo = function(event) {
        var indexToDelete, videoId;
        $('#skillVideoDeleteConfirm').hide();
        indexToDelete = $('#save-skill-video').data('index');
        if (indexToDelete >= 0) {
          this.skill.skillVideo.splice(indexToDelete, 1);
          this.saveAndUpdateProgress();
          $('#skillVideoEdit').hide();
        }
        $('#skill-video-delete-modal').hide();
        if (indexToDelete > 0) {
          videoId = this.skill.skillVideo[indexToDelete - 1].videoId;
        } else if (this.skill.skillVideo.length) {
          videoId = this.skill.skillVideo[0].videoId;
        } else {
          videoId = void 0;
        }
        return this.renderSkillVideos(this.skill, videoId);
      };

      return ProfileCreateSkillView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
