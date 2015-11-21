(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'select2', 'tooltip', 'templates', 'modal', 'profile-create-skill-view', 'gmap3', 'cropimg'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.ProfileEditView = (function(_super) {
      __extends(ProfileEditView, _super);

      function ProfileEditView() {
        this.savePhoto = __bind(this.savePhoto, this);
        this.uploadProfileImage = __bind(this.uploadProfileImage, this);
        this.uploadHeadlineImage = __bind(this.uploadHeadlineImage, this);
        this.updateSkillHeadlinePhoto = __bind(this.updateSkillHeadlinePhoto, this);
        this.updateProfilePhoto = __bind(this.updateProfilePhoto, this);
        this.updateSkillRecord = __bind(this.updateSkillRecord, this);
        this.appendModals = __bind(this.appendModals, this);
        this.renderInitialSkill = __bind(this.renderInitialSkill, this);
        this.saveProfileBasics = __bind(this.saveProfileBasics, this);
        this.newSkillAdd = __bind(this.newSkillAdd, this);
        this.addCustomSkillType = __bind(this.addCustomSkillType, this);
        this.checkForCustomSkill = __bind(this.checkForCustomSkill, this);
        this.updateProfileType = __bind(this.updateProfileType, this);
        this.addCustomSkillTags = __bind(this.addCustomSkillTags, this);
        this.scanForCustomTags = __bind(this.scanForCustomTags, this);
        this.saveAndUpdateProgress = __bind(this.saveAndUpdateProgress, this);
        this.resizeLocation = __bind(this.resizeLocation, this);
        this.resizeImages = __bind(this.resizeImages, this);
        _ref = ProfileEditView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ProfileEditView.prototype.masterTemplate = JST['app/scripts/templates/profile/editProfile/profileMasterTemplate'];

      ProfileEditView.prototype.titleTemplate = JST['app/scripts/templates/profile/editProfile/profileTitleViewTemplate'];

      ProfileEditView.prototype.headingTemplate = JST['app/scripts/templates/profile/editProfile/profileHeadingViewTemplate'];

      ProfileEditView.prototype.attributesTemplate = JST['app/scripts/templates/profile/editProfile/profileAttributesViewTemplate'];

      ProfileEditView.prototype.publishButtonTemplate = JST['app/scripts/templates/profile/editProfile/profileEditPublishStatusTemplate'];

      ProfileEditView.prototype.skillButtonTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillButtonTemplate'];

      ProfileEditView.prototype.titleOrgsTemplate = JST['app/scripts/templates/profile/editProfile/profileTitleOrgs'];

      ProfileEditView.prototype.titleTagsTemplate = JST['app/scripts/templates/profile/editProfile/profileTitleTags'];

      ProfileEditView.prototype.attributesUpdateTemplate = JST['app/scripts/templates/profile/editProfile/profileAttrsUpdate'];

      ProfileEditView.prototype.skillPhotosTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillPhotosTemplate'];

      ProfileEditView.prototype.skillDocumentsTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillDocumentsTemplate'];

      ProfileEditView.prototype.skillVideosTemplate = JST['app/scripts/templates/profile/editProfile/profileSkillVideosTemplate'];

      ProfileEditView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      ProfileEditView.prototype.profileCreatedMessage = JST['app/scripts/templates/email/profile_created'];

      ProfileEditView.prototype.profilePublishedMessage = JST['app/scripts/templates/email/profile_published'];

      ProfileEditView.prototype.profileModals = JST['app/scripts/templates/profile/modals/modal-profileEdits'];

      ProfileEditView.prototype.className = 'profile-master wrapper';

      ProfileEditView.prototype.events = {
        'click #contact-done': 'updateProfileSettings',
        'click #edit-profile-photo': 'editProfilePhoto',
        'click #upload-headline-image': 'uploadHeadlineImage',
        'click #upload-profile-image': 'uploadProfileImage',
        'click .skill-button': 'displaySkill',
        'click #edit-skill-type': 'displaySkillEdit',
        'click #update-skill': 'updateSkillRecord',
        'click #delete-skill-confirm': 'deleteProfileSkill',
        'click #delete-profile-confirm': 'deleteProfileRecord',
        'click .go-live-button': 'profileMakeLive',
        'click .go-private-button': 'profileMakePrivate',
        'click #consentPublish': 'consentPublish',
        'click #declinePublish': 'declinePublish',
        'click .open-modal': 'showModal',
        'click .close-modal': 'hideModal',
        'click #saveProfileBasics': 'saveProfileBasics',
        'click #save-features': 'updateProfileFeatures',
        'click #save-title-info': 'updateProfileTitle',
        'click #save-location': 'updateProfileLocation',
        'change #headlineImgUpload': 'grabImage',
        'change #profileImgUpload': 'grabImage',
        'click #edit-headline-image': 'editSkillHeadlineImage',
        'click #delete-headline-image': 'deleteSkillHeadlineImage',
        'click #add-skill': 'newSkillModal',
        'click .submit-new-skill': 'newSkillAdd',
        'click #edit-location': 'editLocation',
        'click .clear-location-input': 'clearMapInput',
        'change #gmap-input': 'updateMapPreview',
        'keypress #gmap-input': 'editMapKeyPress',
        'blur #gmap-input': 'updateMapPreview',
        'keyup #prof-url': 'updateCustomUrlKeyUp'
      };

      ProfileEditView.prototype.initialize = function(options) {
        var editView, pType, query;
        $('body');
        $('.footer-container').remove();
        $(window).on('resize', this.resizeImages);
        this.user = Parse.User.current();
        if (!this.user) {
          Backbone.history.navigate('#/microsite', {
            trigger: true
          });
          return;
        }
        $(".upper-bkgd").css('height', '530px');
        new Mi.Views.MenuView({
          user: Parse.User.current()
        });
        this.profileId = options.profileId;
        this.userProfile = void 0;
        console.log('Profile edit view initialized, this user is', this.user);
        console.log('Profile edit view initialized, this profile is', this.profileId);
        editView = this;
        pType = Parse.Object.extend({
          className: "Profile"
        });
        query = new Parse.Query(pType);
        query.equalTo('parent', this.user);
        return query.get(this.profileId, {
          success: function(profile) {
            console.log("Profile found: ", profile);
            editView.userProfile = profile;
            editView.standardizeProfileFields(profile);
            editView.appendModals(profile);
            return editView.percentComplete = editView.getProfileCompleteness(profile);
          },
          error: function(profile, error) {
            console.log("Profile fetch failed: ", error);
            return Backbone.history.navigate('#/dashboard', {
              trigger: true
            });
          }
        });
      };

      ProfileEditView.prototype.resizeImages = function() {
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

      ProfileEditView.prototype.resizeLocation = function() {
        var locMap;
        locMap = $('#location-map');
        if (locMap.length) {
          return $(locMap).height($(locMap).width());
        }
      };

      ProfileEditView.prototype.getProfileSkills = function(profileType) {
        var profileSkills;
        profileSkills = [];
        switch (profileType) {
          case '_3d_printing':
            profileSkills = Mi.CMS._3d_printing.skill_types;
            break;
          case 'injection_molding':
            profileSkills = Mi.CMS.injection_molding.skill_types;
            break;
          case 'metal_die_casting':
            profileSkills = Mi.CMS.metal_die_casting.skill_types;
            break;
          case 'cnc_machining':
            profileSkills = Mi.CMS.cnc_machining.skill_types;
            break;
          case 'other':
            profileSkills = Mi.CMS.other.skill_types;
        }
        return profileSkills;
      };

      ProfileEditView.prototype.getProfileTags = function(profileType) {
        var profileTags;
        profileTags = [];
        switch (profileType) {
          case '_3d_printing':
            profileTags = Mi.CMS._3d_printing.tags;
            break;
          case 'injection_molding':
            profileTags = Mi.CMS.injection_molding.tags;
            break;
          case 'metal_die_casting':
            profileTags = Mi.CMS.metal_die_casting.tags;
            break;
          case 'cnc_machining':
            profileTags = Mi.CMS.cnc_machining.tags;
            break;
          case 'other':
            profileTags = Mi.CMS.other.tags;
        }
        return profileTags;
      };

      ProfileEditView.prototype.render = function() {
        var checkDom, domLoop, editView, initLayout, setupPlugins,
          _this = this;
        if (!Parse.User.current()) {
          Backbone.history.navigate('#/microsite', {
            trigger: true
          });
          return;
        }
        editView = this;
        initLayout = function(profile) {
          var attributes;
          if (!profile) {
            profile = {};
          }
          editView.profileId = null;
          editView.profileId = profile.id;
          attributes = profile.attributes;
          if (!attributes) {
            attributes = {};
          }
          editView.profileType = attributes.profileType;
          editView.titleTmpl = editView.titleTemplate({
            profile: attributes,
            Mi: Mi
          });
          editView.headingTmpl = editView.headingTemplate({
            profile: attributes,
            Mi: Mi
          });
          editView.attributesTmpl = editView.attributesTemplate({
            profile: attributes,
            Mi: Mi
          });
          editView.$el.children(":not(.modal)").remove();
          editView.$el.append(editView.titleTmpl, editView.headingTmpl);
          editView.$el.find('.attributes-placeholder').append(editView.attributesTmpl);
          if (profile && profile.get && profile.get('skills').length > 3) {
            $('div.skill-button.add-skill').hide();
          }
          return editView.resizeImages();
        };
        setupPlugins = function() {
          var profile;
          $('.footer-container').remove();
          profile = _this.userProfile.attributes;
          _this.profileOrgs = [];
          switch (profile.profileType) {
            case 'performer':
              _this.profileOrgs = Mi.CMS._3d_printing.organizations;
              break;
            case 'business':
              _this.profileOrgs = Mi.CMS.injection_molding.organizations;
              break;
            case 'venue':
              _this.profileOrgs = Mi.CMS.metal_die_casting.organizations;
              break;
            case 'executive':
              _this.profileOrgs = Mi.CMS.cnc_machining.organizations;
              break;
            case 'behindthescenes':
              _this.profileOrgs = Mi.CMS.other.organizations;
          }
          _this.profileCertifications = [];
          switch (profile.profileType) {
            case 'performer':
              _this.profileCertifications = Mi.CMS._3d_printing.certifications;
              break;
            case 'business':
              _this.profileCertifications = Mi.CMS.injection_molding.certifications;
              break;
            case 'venue':
              _this.profileCertifications = Mi.CMS.metal_die_casting.certifications;
              break;
            case 'executive':
              _this.profileCertifications = Mi.CMS.cnc_machining.certifications;
              break;
            case 'behindthescenes':
              _this.profileCertifications = Mi.CMS.other.certifications;
          }
          _this.profileSkills = _this.getProfileSkills(profile.profileType);
          _this.profileTags = _this.getProfileTags(profile.profileType);
          _this.initTooltips();
          _this.renderProgressBar();
          _this.renderInitialSkill();
          _this.populateSkillsListbox(_this.profileSkills);
          $(".privacy-select").select2({
            matcher: function(term, text) {
              return text.toUpperCase().indexOf(term.toUpperCase()) === 0;
            }
          });
          if ($(".equity-union-select").length) {
            $(".equity-union-select").select2({
              matcher: function(term, text) {
                return text.toUpperCase().indexOf(term.toUpperCase()) === 0;
              },
              tags: _this.profileOrgs
            });
            $(".equity-union-select").select2('val', profile.organizations);
          }
          if ($(".certification-select").length) {
            $(".certification-select").select2({
              matcher: function(term, text) {
                return text.toUpperCase().indexOf(term.toUpperCase()) === 0;
              },
              tags: _this.profileCertifications
            }, $(".certification-select").select2('val', profile.certifications));
          }
          $(".tags-select").select2({
            matcher: function(term, text) {
              return text.toUpperCase().indexOf(term.toUpperCase()) === 0;
            },
            tags: _this.profileTags
          });
          $(".tags-select").select2('val', profile.tags);
          $(".attrs-feature-input").select2({
            allowClear: true,
            containerCssClass: 'attrs-feature-input',
            matcher: function(term, text) {
              return text.toUpperCase().indexOf(term.toUpperCase()) === 0;
            }
          });
          _this.initPlacesAutocomplete();
          if (profile.location) {
            _this.initGoogleMaps("#location-map", profile.profileType, profile.latlng, profile.location);
            return _this.resizeLocation();
          }
        };
        checkDom = function() {
          return true;
          return ($(".equity-union-select").length || $(".certification-select").length) && $(".tags-select").length && $(".attrs-feature-input").length && $(".skill-area").length && $(".skill-select").length && $(".privacy-select").length;
        };
        domLoop = setInterval(function() {
          console.log('running!');
          if (editView.userProfile) {
            initLayout(editView.userProfile);
          } else {
            initLayout();
          }
          if (checkDom()) {
            clearInterval(domLoop);
            setupPlugins();
            editView.updateDom('titleArea');
            return $('#footer').html(_this.footerTemplate());
          }
        }, 500);
        return this;
      };

      ProfileEditView.prototype.editProfilePhoto = function() {
        var img, profileUrl;
        profileUrl = this.userProfile.get('profilePictureUrl');
        if (profileUrl && profileUrl.length) {
          img = $('<img></img>').attr('src', profileUrl);
        } else {
          img = $('<img></img>').attr('src', 'images/placeholder_imgs/profile_placeholder.png');
        }
        $('#profilePicturePreview').html('').append(img);
        return window.Mi.appRouter.showEdit('#profile-photo-modal');
      };

      ProfileEditView.prototype.saveAndUpdateProgress = function() {
        var profACL,
          _this = this;
        this.standardizeProfileFields(this.userProfile);
        profACL = new Parse.ACL(Parse.User.current());
        profACL.setPublicReadAccess(true);
        this.userProfile.setACL(profACL);
        return this.userProfile.save(null, {
          success: function(response) {
            _this.renderProgressBar();
            _this.scanForCustomTags(_this.userProfile.get('tags'), _this.profileType);
            _this.profileSkills = _this.getProfileSkills(_this.profileType);
            return _this.profileTags = _this.getProfileTags(_this.profileType);
          }
        });
      };

      ProfileEditView.prototype.scanForCustomTags = function(tagList, profileType) {
        var existingTags, newTags;
        newTags = [];
        existingTags = this.profileTags;
        _.each(tagList, function(tag) {
          var index;
          index = existingTags.indexOf(tag);
          if (index === -1) {
            return newTags.push(tag);
          }
        });
        if (newTags.length) {
          return this.addCustomSkillTags(newTags, profileType);
        }
      };

      ProfileEditView.prototype.addCustomSkillTags = function(newTags, profileType) {
        var pType, skQry;
        if (!newTags || !profileType || !newTags.length) {
          return;
        }
        pType = Parse.Object.extend('Profile_tags_custom');
        skQry = new Parse.Query(pType);
        skQry.equalTo('type', profileType);
        return skQry.find({
          success: function(results) {
            var customTags, vals;
            console.log("matching custom tags record: ", results.length);
            if (results.length) {
              customTags = results[0];
              vals = customTags.get('tags');
            } else {
              customTags = new pType;
              customTags.set('type', profileType);
              vals = [];
            }
            _.each(newTags, function(tag) {
              return vals.push(tag);
            });
            customTags.set('tags', vals.sort());
            return customTags.save(null, {
              success: function(result) {
                window.Mi.appRouter.loadCMS();
                return console.log("Added custom tags " + newTags + " for profile type of " + profileType);
              },
              error: function(error) {
                return console.log("Error occurred adding custom tags " + newTags + " for profile type of " + profileType + ' - ' + error);
              }
            });
          },
          error: function(error) {
            return console.log("Error occurred adding custom tags " + newTags + " for profile type of " + profileType + " - " + error);
          }
        });
      };

      ProfileEditView.prototype.profileMakeLive = function() {
        var msg;
        this.userProfile.set("profilePublished", true);
        this.saveAndUpdateProgress();
        msg = this.profilePublishedMessage({
          profileId: this.userProfile.id,
          profile: this.userProfile.attributes
        });
        return window.Mi.messagesRouter.sendEmail("across-mold.com", "signup@across-mold.com", "across-mold.com", "signup@across-mold.com", "Profile published: " + this.userProfile.get('profileName'), msg);
      };

      ProfileEditView.prototype.profileMakePrivate = function() {
        this.userProfile.set("profilePublished", false);
        return this.saveAndUpdateProgress();
      };

      ProfileEditView.prototype.updateProfileType = function() {
        $('#skill-select').empty();
        if ($('#venue-box').prop('checked')) {
          $('#welcome-modal .profile-subtitle').text('Venue Profile Editor');
          this.profileType = 'venue';
          this.userProfile.set('profileType', 'venue');
          this.profileSkills = this.getProfileSkills('venue');
        } else {
          $('#welcome-modal .profile-subtitle').text('Business Profile Editor');
          this.profileType = 'business';
          this.userProfile.set('profileType', "business");
          this.profileSkills = this.getProfileSkills('business');
        }
        this.attributesTmpl = this.attributesTemplate({
          profile: this.userProfile.attributes,
          Mi: Mi
        });
        $('.attributes-area').remove();
        $('.attributes-placeholder').append(this.attributesTmpl);
        this.addAttributeTooltips();
        return this.populateSkillsListbox(this.profileSkills);
      };

      ProfileEditView.prototype.matchLabelsToProfileType = function() {
        var addTitle, deleteConfirmation, deleteText, doUpdate, editorName, placeholder, promptLabel, renameTitle, skillsHeading, toolTipText,
          _this = this;
        doUpdate = function() {
          var e;
          $('#skill-select-label').text(promptLabel);
          $('#profileName').attr('placeholder', _this.profileNamePlaceholder(_this.profileType));
          $('#skill-select').data('placeholder', placeholder);
          $('.skills-heading').text(skillsHeading);
          $('#new-skill-modal .profile-subtitle').text(addTitle);
          $('.skill-select span.select2-chosen').text(placeholder);
          $('#skill-edit-modal .deleteSkill-subtitle').text(renameTitle);
          $('#delete-skill').attr('value', deleteText);
          $('#skill-delete-modal .confirm-delete-subtitle').text(deleteConfirmation);
          $('#editor-title').text(editorName);
          $('#welcome-modal .profile-subtitle').text(editorName);
          try {
            $('#add-skill').tooltip('destroy');
          } catch (_error) {
            e = _error;
          }
          return $("#add-skill").tooltip({
            container: 'body',
            trigger: 'hover focus',
            title: toolTipText,
            placement: 'top'
          });
        };
        if (this.profileType === 'venue') {
          skillsHeading = "Venues";
          renameTitle = "Rename Venue Type";
          deleteText = "Delete Venue";
          deleteConfirmation = "Are you sure you want to delete this venue?";
          promptLabel = 'Add the first Venue type for this business.';
          placeholder = 'Select a venue type';
          toolTipText = 'Add type';
          addTitle = 'Add Venue';
          editorName = 'Venue Profile Editor';
        } else if (this.profileType === 'business') {
          skillsHeading = "Services";
          renameTitle = "Rename Service";
          deleteText = "Delete Service";
          deleteConfirmation = "Are you sure you want to delete this service?";
          promptLabel = 'Add your first Business or Service.';
          placeholder = 'Select a product or service';
          toolTipText = 'Add service';
          addTitle = 'Add Business or Service';
          editorName = 'Business Profile Editor';
        } else {
          skillsHeading = "Skills";
          renameTitle = "Rename Skill";
          deleteText = "Delete Skill";
          deleteConfirmation = "Are you sure you want to delete this skill?";
          promptLabel = 'Add your first Skill.';
          placeholder = 'Select a skill';
          toolTipText = 'Add skill';
          addTitle = 'Add Skill';
          editorName = 'Profile Editor';
          switch (this.profileType) {
            case "performer":
              editorName = 'Performer Profile Editor';
              break;
            case "executive":
              editorName = 'Executive Profile Editor';
              break;
            case "behindthescenes":
              editorName = 'Behind The Scenes Profile Editor';
              break;
            default:
              editorName = 'Profile Editor';
          }
        }
        return doUpdate();
      };

      ProfileEditView.prototype.populateSkillsListbox = function(skillTypes) {
        var skillOptions;
        skillOptions = [];
        _.each(skillTypes, function(skill_type) {
          return skillOptions.push({
            id: skill_type,
            text: skill_type
          });
        });
        $("input.skill-select").select2({
          maximumSelectionSize: 1,
          matcher: function(term, text) {
            return text.toUpperCase().indexOf(term.toUpperCase()) > -1;
          },
          data: skillOptions,
          multiple: false,
          createSearchChoice: function(term, data) {
            var testfunc;
            testfunc = function() {
              return this.text.localeCompare(term) === 0;
            };
            if ($(data).filter(testfunc).length === 0) {
              return {
                id: term,
                text: term
              };
            }
          }
        });
        this.matchLabelsToProfileType();
        return this;
      };

      ProfileEditView.prototype.checkForCustomSkill = function(skillName, profileType) {
        var index;
        index = this.profileSkills.indexOf(skillName);
        if (index === -1) {
          return this.addCustomSkillType(skillName, profileType);
        }
      };

      ProfileEditView.prototype.addCustomSkillType = function(skillName, profileType) {
        var pType, skQry;
        pType = Parse.Object.extend('Profile_skill_types_custom');
        skQry = new Parse.Query(pType);
        skQry.equalTo('type', profileType);
        return skQry.find({
          success: function(results) {
            var customSkills, vals;
            console.log("found matching custom skills: ", results.length);
            if (results.length) {
              customSkills = results[0];
              vals = customSkills.get('skill_types');
            } else {
              customSkills = new pType;
              customSkills.set('type', profileType);
              vals = [];
            }
            vals.push(skillName);
            customSkills.set('skill_types', vals.sort());
            return customSkills.save(null, {
              success: function(result) {
                window.Mi.appRouter.loadCMS();
                return console.log("Added custom skill " + skillName + " for profile type of " + profileType);
              },
              error: function(error) {
                return console.log("Error occurred adding custom skill " + skillName + " for profile type of " + profileType + ' - ' + error);
              }
            });
          },
          error: function(error) {
            return console.log("Error occurred adding custom skill " + skillName + " for profile type of " + profileType + " - " + error);
          }
        });
      };

      ProfileEditView.prototype.newSkillAdd = function() {
        var container, newSkill, skillName, skills;
        skillName = $("#skill-type-add").select2('val');
        console.log('newSkill called, type: ', skillName);
        newSkill = {
          skillType: skillName,
          skillVideo: [],
          skillPhotos: [],
          skillAudio: {},
          skillDocuments: [],
          skillHeadlinePhotoUrl: null
        };
        skills = this.userProfile.get("skills");
        skills.push(newSkill);
        this.checkForCustomSkill(skillName, this.profileType);
        $('img.headline-photo').attr('src', '');
        this.renderChildInto(new Mi.Views.ProfileCreateSkillView({
          skill: newSkill,
          profile: this.userProfile,
          index: skills.length - 1
        }), ".skill-area");
        this.renderSkill(newSkill);
        container = $("<div></div>").addClass("skill-button-container");
        container.html(this.skillButtonTemplate({
          skillName: skillName,
          skillId: skills.length - 1
        }));
        $(".sub-heading-nav").append(container);
        $("#new-skill-modal").hide();
        this.toggleActive(skills.length - 1, newSkill);
        this.saveAndUpdateProgress();
        if (this.userProfile.get('skills').length > 3) {
          $('div.skill-button.add-skill').hide();
        }
        return this.adjustSkillButtonWidth();
      };

      ProfileEditView.prototype.saveProfileBasics = function() {
        var newProfileName, newSkill, newSkillName, profACL, skill,
          _this = this;
        newProfileName = $("#profileName").val();
        newSkillName = $(".chosen-skill-select").select2('val');
        if (!(newSkillName && newSkillName.length)) {
          this.showMessage("Please select a service before you continue.");
          return;
        }
        this.userProfile.set("profileName", newProfileName);
        this.updateDom('titleArea');
        newSkill = {
          skillType: newSkillName,
          skillVideo: [],
          skillPhotos: [],
          skillAudio: {},
          skillDocuments: [],
          skillHeadlinePhotoUrl: null
        };
        this.userProfile.get("skills").push(newSkill);
        this.checkForCustomSkill(newSkillName, this.userProfile.get('profileType'));
        skill = this.userProfile.get("skills")[0];
        console.log('skill is ', skill);
        console.log('newskill is ', newSkill);
        profACL = new Parse.ACL(Parse.User.current());
        profACL.setPublicReadAccess(true);
        this.userProfile.setACL(profACL);
        this.userProfile.save(null, {
          success: function(result) {
            var container, newProfileMessage;
            console.log('save succesful, result:', result);
            _this.renderProgressBar();
            _this.renderChildInto(new Mi.Views.ProfileCreateSkillView({
              skill: skill,
              profile: _this.userProfile
            }), '.skill-area');
            _this.renderSkill(skill);
            container = $("<div></div>").addClass("skill-button-container");
            container.html(_this.skillButtonTemplate({
              skillName: newSkillName,
              editSkill: true,
              skillId: 0
            }));
            $(".sub-heading-nav").append(container);
            _this.toggleActive(0, skill);
            newProfileMessage = _this.profileCreatedMessage({
              profileId: _this.userProfile.id,
              profile: _this.userProfile.attributes
            });
            return window.Mi.messagesRouter.sendEmail("across-mold.com", "signup@across-mold.com", "across-mold.com", "signup@across-mold.com", "new Make It Globalprofile: " + _this.userProfile.get('profileName'), newProfileMessage);
          },
          error: function(error, result) {
            return console.log('save failed for some damn reason, error: ', error);
          }
        });
        window.Mi.appRouter.loadCMS();
        $(".title-name").html(newProfileName);
        $("#welcome-modal").modal('hide');
        return this.renderSkill(newSkill);
      };

      ProfileEditView.prototype.renderSkill = function(skill) {
        this.renderSkillPhotos(skill);
        this.renderSkillDocuments(skill);
        this.renderSkillVideos(skill);
        this.resizeImages();
        return this.adjustSkillButtonWidth();
      };

      ProfileEditView.prototype.showMessage = function(message) {
        return window.Mi.messagesRouter.showMessage(message);
      };

      ProfileEditView.prototype.renderProgressBar = function() {
        var e;
        try {
          $('.go-live-button').tooltip('destroy');
        } catch (_error) {
          e = _error;
        }
        try {
          $('.go-private-button').tooltip('destroy');
        } catch (_error) {
          e = _error;
        }
        this.percentComplete = this.getProfileCompleteness(this.userProfile);
        console.log('renderProgressBar called, percentage complete:', this.percentComplete);
        $(".percentage-complete").html(this.percentComplete);
        $(".progress-bar").css("width", this.percentComplete * 2.5);
        $("#publish-status").html(this.publishButtonTemplate({
          isPublished: this.userProfile.get('profilePublished'),
          lessThan50: this.percentComplete < 50
        }));
        if (this.percentComplete >= 50 && !this.userProfile.get('promptedToPublish')) {
          this.promptToPublish();
        }
        $('.go-live-button').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Click to make this profile live',
          placement: 'bottom'
        });
        return $('.go-private-button').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Click to make this profile private',
          placement: 'bottom'
        });
      };

      ProfileEditView.prototype.promptToPublish = function() {
        return window.Mi.appRouter.showEdit("#prompt-user-to-publish");
      };

      ProfileEditView.prototype.declinePublish = function() {
        $("#prompt-user-to-publish").hide();
        this.userProfile.set("promptedToPublish", true);
        return this.saveAndUpdateProgress();
      };

      ProfileEditView.prototype.consentPublish = function() {
        $("#prompt-user-to-publish").hide();
        this.userProfile.set("promptedToPublish", true);
        this.saveAndUpdateProgress();
        return this.profileMakeLive();
      };

      ProfileEditView.prototype.titleSectionEdit = function() {
        return window.Mi.appRouter.showEdit("#profiletitle");
      };

      ProfileEditView.prototype.contactInput = function() {
        return window.Mi.appRouter.showEdit("#profiletitle");
      };

      ProfileEditView.prototype.updateCustomUrlKeyUp = function(ev) {
        var customVal;
        customVal = encodeURIComponent($(ev.currentTarget).val());
        if (customVal && customVal.length) {
          return $('div.contact-subtitle.final-url').text('www.across-mold.com/#/' + customVal);
        } else {
          return $('div.contact-subtitle.final-url').text('www.across-mold.com/#/customUrl');
        }
      };

      ProfileEditView.prototype.updateProfileSettings = function() {
        var editProfile, pType, profileEmail, profilePrivacy, profileUrl, updateProfile, urlQry,
          _this = this;
        profileEmail = $('#prof-email').val().toLowerCase();
        profilePrivacy = $('#prof-privacy').val();
        profileUrl = encodeURIComponent($('#prof-url').val());
        editProfile = this.userProfile;
        updateProfile = function() {
          editProfile.set('profileContactEmail', profileEmail);
          editProfile.set('profilePublished', profilePrivacy === 'Public');
          editProfile.set('profileCustomUrl', profileUrl);
          $('#contact-edit-modal').hide();
          return _this.saveAndUpdateProgress();
        };
        if (profileUrl && profileUrl.length) {
          pType = Parse.Object.extend("Profile");
          urlQry = new Parse.Query(pType);
          urlQry.equalTo('profileCustomUrl', profileUrl);
          return urlQry.find({
            success: function(results) {
              console.log("found matching cusotom url, results: ", results);
              if (results) {
                if (results.length === 0) {
                  return updateProfile();
                } else if (results.length === 1 && results[0].id === editProfile.id) {
                  return updateProfile();
                } else {
                  return alert('Custom URL: "' + profileUrl + '" is taken. Pick another URL.');
                }
              } else {
                return updateProfile();
              }
            },
            error: function() {
              return alert('Error verifying custom url. Unable to save changes.');
            }
          });
        } else {
          return updateProfile();
        }
      };

      ProfileEditView.prototype.updateProfileFeatures = function() {
        var profileFeatures,
          _this = this;
        profileFeatures = {};
        console.log('updateProfileFeatures called');
        _.each($(".features-select-boxes select"), function(selecty) {
          return profileFeatures[$(selecty).data("featurename")] = $(selecty).val();
        });
        this.userProfile.set("profileFeatures", profileFeatures);
        console.log('profile object after adding features', this.userProfile);
        console.log('user object after adding features', this.user);
        this.saveAndUpdateProgress();
        $("#attributesFeaturesEdit").hide();
        return this.updateDom('attributesArea');
      };

      ProfileEditView.prototype.updateProfileTitle = function() {
        var tags;
        console.log('updateProfileTitle called');
        if ($(".edit-profile-name").val() !== this.userProfile.get("profileName")) {
          this.userProfile.set("profileName", $(".edit-profile-name").val());
        }
        tags = $(".tags-select").select2("val");
        this.userProfile.set("tags", tags);
        if ($(".equity-union-select").length) {
          this.userProfile.set("organizations", $(".equity-union-select").select2("val"));
        }
        if ($(".certification-select").length) {
          this.userProfile.set("certifications", $(".certification-select").select2("val"));
        }
        this.saveAndUpdateProgress();
        $("#titleSectionEdit").hide();
        this.updateDom('titleArea');
        return window.Mi.appRouter.loadCMS();
      };

      ProfileEditView.prototype.updateDom = function(areaToUpdate) {
        if (areaToUpdate === 'titleArea') {
          $(".title-name").html(this.userProfile.get("profileName"));
          $(".user-tags").html(this.titleTagsTemplate({
            profile: this.userProfile.attributes
          }));
        }
        if (areaToUpdate === 'attributesArea') {
          return this.updateProfileFeaturesTemplate();
        }
      };

      ProfileEditView.prototype.updateProfileFeaturesTemplate = function() {
        return $(".profile-features-area").html(this.attributesUpdateTemplate({
          profile: this.userProfile.attributes,
          Mi: Mi
        }));
      };

      ProfileEditView.prototype.storeProfileSafeLocation = function(profile, locResult) {
        var isRooftop, lat, lng, loc, locality, profileType, region, safeLocation, safeType;
        isRooftop = locResult.geometry.location_type === 'ROOFTOP';
        profileType = profile.get('profileType');
        if (isRooftop) {
          locality = locResult.address_components[2].long_name;
          region = locResult.address_components[4].short_name;
          safeLocation = locality + ', ' + region;
          safeType = "APPROXIMATE";
        } else {
          safeLocation = locResult.formatted_address;
          safeType = locResult.geometry.location_type;
        }
        loc = locResult.geometry.location;
        lat = loc.lat();
        lng = loc.lng();
        safeType = locResult.geometry.location_type;
        profile.set("latlng", [lat, lng]);
        profile.set("lat", lat);
        profile.set("lng", lng);
        profile.set("locationType", safeType);
        profile.set("geoLocation", new Parse.GeoPoint(lat, lng));
        profile.set("location", safeLocation);
        return console.log('geocoder called, latlng of newLocation: ', safeLocation);
      };

      ProfileEditView.prototype.updateProfileLocation = function() {
        var geocoder, newLocation,
          _this = this;
        newLocation = $("#gmap-input").val();
        if (newLocation && newLocation.length) {
          geocoder = new google.maps.Geocoder();
          geocoder.geocode({
            address: newLocation
          }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              _this.storeProfileSafeLocation(_this.userProfile, results[0]);
              _this.saveAndUpdateProgress();
              _this.initGoogleMaps("#location-map");
              $("#attributesLocationEdit").hide();
            } else {
              _this.userProfile.set("latlng", null);
              _this.userProfile.set("lat", null);
              _this.userProfile.set("lng", null);
              _this.userProfile.set("location", newLocation);
              _this.initGoogleMaps("#location-map");
              alert("Geocode was not successful for the following reason: " + status);
            }
            return _this.resizeLocation();
          });
        } else {
          this.userProfile.set("latlng", null);
          this.userProfile.set("lat", null);
          this.userProfile.set("lng", null);
          this.userProfile.set("location", null);
          this.saveAndUpdateProgress();
          this.clearProfileEditMap();
        }
        console.log('updateProfileLocation called, newLocation', newLocation);
        return $('#attributesLocationEdit').hide();
      };

      ProfileEditView.prototype.renderInitialSkill = function() {
        var skill;
        skill = this.userProfile.get("skills")[0];
        console.log('renderInitialSkill called, skill:', this.userProfile.get("skills")[0]);
        if (skill) {
          this.renderChildInto(new Mi.Views.ProfileCreateSkillView({
            skill: skill,
            profile: this.userProfile,
            index: 0
          }), ".skill-area");
          this.renderSkill(skill);
          this.toggleActive(0, skill);
        } else {
          $('#profileName').attr('placeholder', this.profileNamePlaceholder(this.userProfile.get('profileType')));
          $("#welcome-modal").modal({
            backdrop: 'static',
            keyboard: false
          });
          $('#profileName').focus();
        }
        this.adjustSkillButtonWidth();
        return Mi.Views.ProfileCreateSkillView.prototype.showFirstTab(this.skill);
      };

      ProfileEditView.prototype.hideModal = function(event) {
        var targetModal;
        if (event.target.id !== "welcome-modal") {
          targetModal = $(event.target).data("closemodal");
          console.log(targetModal);
          return $("#" + targetModal).hide();
        }
      };

      ProfileEditView.prototype.showModal = function(event) {
        var getCompleteness, modalID, percentComplete, targetModal;
        console.log('showModal called, eventTarget:', event.target);
        if (event.target.id === "welcome-modal") {
          modalID = $(event.target).data("modal");
          return $("#" + modalID).modal({
            backdrop: 'static',
            keyboard: false
          });
        } else {
          targetModal = $(event.target).data("openmodal");
          if (targetModal === 'titleSectionEdit') {
            $(".edit-profile-name").val(this.userProfile.get('profileName'));
            if ($(".equity-union-select").length) {
              $(".equity-union-select").select2('val', this.userProfile.get('organizations'));
            }
            if ($(".certification-select").length) {
              $(".certification-select").select2('val', this.userProfile.get('certifications'));
            }
            if ($(".tags-select").length) {
              $(".tags-select").select2('val', this.userProfile.get('tags'));
            }
          }
          if (targetModal === 'contact-edit-modal') {
            if (this.getProfileCompleteness) {
              getCompleteness = this.getProfileCompleteness;
            } else {
              getCompleteness = this.parent.getProfileCompleteness;
            }
            percentComplete = getCompleteness(this.userProfile);
            $('#prof-email').val(this.userProfile.get('profileContactEmail'));
            $('#prof-privacy').select2().prop('disabled', '');
            if (this.userProfile.get('profilePublished')) {
              $('#prof-privacy').select2("val", "Public");
            } else {
              $('#prof-privacy').select2("val", "Private");
              if (percentComplete < 50) {
                $('#prof-privacy').select2().prop('disabled', 'disabled');
              }
            }
            $('#contact-edit-modal .profile-title').text('Edit Profile Settings for ' + this.userProfile.get('profileName'));
          }
          return window.Mi.appRouter.showEdit("#" + targetModal);
        }
      };

      ProfileEditView.prototype.profileNamePlaceholder = function(profileType) {
        switch (profileType) {
          case 'anything':
            return 'business name';
          default:
            return 'business name';
        }
      };

      ProfileEditView.prototype.initTooltips = function(event) {
        this.addAttributeTooltips();
        $(".contact-edit").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit email, contact & sharing information for this profile',
          placement: 'bottom'
        });
        $("#attributesSectionEdit").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit your profile picture, features, or location',
          placement: 'left'
        });
        switch (this.userProfile.get('profileType')) {
          case void 0:
            $(".title-section-icon").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Edit your name, certifications, or tags',
              placement: 'right'
            });
            $("#add-skill").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Add Service',
              placement: 'top'
            });
            $("#edit-skill-type").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Rename or delete this service',
              placement: 'bottom'
            });
            break;
          default:
            $(".title-section-icon").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Edit your name, certifications, or tags',
              placement: 'right'
            });
            $("#add-skill").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Add Service',
              placement: 'top'
            });
            $("#edit-skill-type").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Rename or delete this service',
              placement: 'bottom'
            });
        }
        $(".contact-icon").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Add contact email',
          placement: 'right'
        });
        return $(".headline-photo-icon").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit your headline photo',
          placement: 'bottom'
        });
      };

      ProfileEditView.prototype.addAttributeTooltips = function() {
        $('div.attributes-photo .edit-icon').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Change the image that appears with profile search result',
          placement: 'right'
        });
        $('.edit-icon.attr-section-icon').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit attributes describing this profile',
          placement: 'right'
        });
        return $('.attributes-location .edit-icon').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit the location associated with this profile',
          placement: 'right'
        });
      };

      ProfileEditView.prototype.appendModals = function(profile) {
        $('#profileModals').remove();
        $('#wrap').append(this.profileModals({
          Mi: Mi,
          profile: profile.attributes
        }));
        $('#saveProfileBasics').click(this.saveProfileBasics);
        return $('#venue-box').click(this.updateProfileType);
      };

      ProfileEditView.prototype.headlinePhotoPlaceholder = function() {
        var headlinePlaceHolder;
        headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
        switch (this.userProfile.get('profileType')) {
          case '_3d_printing':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
            break;
          case 'injection_molding':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
            break;
          case 'metal_die_casting':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
            break;
          case 'cnc_machining':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
            break;
          case 'other':
            headlinePlaceHolder = "images/placeholder_imgs/headline_placeholder.jpg";
        }
        return headlinePlaceHolder;
      };

      ProfileEditView.prototype.toggleActive = function(index, skill) {
        var $j, newImage, oldImage;
        this.activeSkill = skill;
        this.activateSkillEdit(index, skill.skillType);
        $j = jQuery;
        oldImage = $j('img.headline-photo');
        oldImage.addClass('remove');
        newImage = $('<img/>').addClass('headline-photo').css({
          opacity: 0
        });
        if (skill.skillHeadlinePhotoUrl && skill.skillHeadlinePhotoUrl.length) {
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
        $(oldImage).remove();
        this.addSkillToolTips();
        Mi.Views.ProfileCreateSkillView.prototype.showFirstTab(skill);
        if (skill.skillSummary) {
          return $('#summary-display').html(this.linkify(skill.skillSummary));
        }
      };

      ProfileEditView.prototype.addSkillToolTips = function() {
        $("#skill-summary-icon").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit summary description of this profile',
          placement: 'right'
        });
        $('#skill-photo-edit-icon').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit Photo',
          placement: 'bottom'
        });
        $("#add-skill-photo").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Add Photo',
          placement: 'top'
        });
        $("#add-skill-document").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Add Document',
          placement: 'top'
        });
        $("#skill-document-edit-icon").tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit Document',
          placement: 'bottom'
        });
        $('#skill-video-edit-icon').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Edit video link',
          placement: 'bottom'
        });
        $('#add-skill-video').tooltip({
          container: 'body',
          trigger: 'hover focus',
          title: 'Add video link',
          placement: 'top'
        });
        switch (this.userProfile.get('profileType')) {
          case void 0:
            return $("#edit-skill-type").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Rename or delete this service',
              placement: 'bottom'
            });
          default:
            return $("#edit-skill-type").tooltip({
              container: 'body',
              trigger: 'hover focus',
              title: 'Rename or delete this service',
              placement: 'bottom'
            });
        }
      };

      ProfileEditView.prototype.deactivateSkillEdit = function() {
        var btn, container, skillName, skillid;
        btn = $(".skill-button.active");
        if (!btn.length) {
          return;
        }
        skillid = btn.data("skillid");
        skillName = btn.find('div.skill-text').text();
        container = btn.parent();
        container.html(this.skillButtonTemplate({
          skillName: skillName,
          skillId: skillid
        }));
        return container.find('div.skill-button');
      };

      ProfileEditView.prototype.activateSkillEdit = function(skillId, skillType) {
        var btn, container;
        this.deactivateSkillEdit();
        btn = $(".skill-button[data-skillid='" + skillId + "']");
        if (!btn.length) {
          return;
        }
        container = btn.parent();
        container.html(this.skillButtonTemplate({
          skillName: skillType,
          editSkill: true,
          skillId: $(btn).data('skillid')
        }));
        $('.popover').hide();
        $('.modal').modal('hide');
        this.activeSkillType = skillType;
        return container.find('div.skill-button');
      };

      ProfileEditView.prototype.linkify = function(inputText) {
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

      ProfileEditView.prototype.displaySkill = function(event) {
        var index, skill;
        index = $(event.currentTarget).data('skillid');
        if (index >= 0) {
          skill = this.userProfile.get('skills')[index];
          console.log('displaySkill called, skill:', skill);
          this.renderChildInto(new Mi.Views.ProfileCreateSkillView({
            skill: skill,
            profile: this.userProfile
          }), ".skill-area");
          this.renderSkill(skill);
          return this.toggleActive(index, skill);
        }
      };

      ProfileEditView.prototype.displaySkillEdit = function(event) {
        if (this.profileSkills.indexOf(this.activeSkillType) === -1) {
          this.profileSkills.push(this.activeSkillType);
          $('#skill-type-edit').data().select2.opts.data.push({
            id: this.activeSkillType,
            text: this.activeSkillType
          });
        }
        $('#skill-type-edit').select2('val', this.activeSkillType);
        this.showModal(event);
        return false;
      };

      ProfileEditView.prototype.adjustSkillButtonWidth = function() {
        var buttons, updateWidths;
        buttons = $('.skill-button');
        if (buttons.length < 2) {
          return;
        }
        updateWidths = function() {
          var availableWidth, avgWidth, getTotalWidth, _results,
            _this = this;
          $(buttons).css('width', 'auto');
          availableWidth = $('.sub-heading-nav').width() - $('.skills-heading').width() - 30;
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
              var btnTxt;
              if ($(btn).width() > avgWidth) {
                btnTxt = $(btn).find('.skill-text');
                if ($(btnTxt).width() > 10) {
                  return $(btnTxt).css('width', $(btnTxt).width() - 1 + 'px');
                }
              }
            }));
          }
          return _results;
        };
        return setTimeout(updateWidths, 10);
      };

      ProfileEditView.prototype.deleteProfileSkill = function(event) {
        var deletedIndex, skills,
          _this = this;
        skills = this.userProfile.get("skills");
        deletedIndex = -1;
        _.each(skills, function(skill, index) {
          var btn;
          if (_this.scrubbedSkillName(skill.skillType) === _this.scrubbedSkillName(_this.activeSkillType)) {
            console.log('deleteSkill: ', _this.activeSkillType);
            return deletedIndex = index;
          } else if (deletedIndex > -1) {
            btn = $('.skill-button[data-skillid="' + index + '"');
            return $(btn).attr('data-skillid', index - 1);
          }
        });
        if (deletedIndex > -1) {
          skills.splice(deletedIndex, 1);
          this.saveAndUpdateProgress();
          $('#skill-delete-modal').hide();
          $('.skill-button.active').parent().remove();
          this.renderInitialSkill();
          if (skills.length < 4) {
            return $('div.skill-button.add-skill').show();
          }
        }
      };

      ProfileEditView.prototype.updateSkillRecord = function(event) {
        var newSkillName, skills,
          _this = this;
        newSkillName = $('#skill-type-edit').select2('val');
        if (!newSkillName) {
          alert('Skill type cannot be blank');
          return;
        }
        console.log('updateSkill: ', this.activeSkillType);
        skills = this.userProfile.get("skills");
        return _.each(skills, function(skill, index) {
          var btn, container;
          if (_this.scrubbedSkillName(skill.skillType) === _this.scrubbedSkillName(_this.activeSkillType)) {
            console.log('renameSkill: ', _this.activeSkillType);
            skills[index].skillType = newSkillName;
            _this.saveAndUpdateProgress();
            _this.activeSkillType = newSkillName;
            btn = _this.deactivateSkillEdit();
            container = btn.parent();
            container.html(_this.skillButtonTemplate({
              skillName: newSkillName,
              editSkill: true,
              skillId: index
            }));
            $('#skill-edit-modal').hide();
            _this.checkForCustomSkill(newSkillName, _this.profileType);
            return _this;
          }
        });
      };

      ProfileEditView.prototype.renderSkillPhotos = function(skill) {
        return $('#photos-tab').html(this.skillPhotosTemplate({
          skill: skill
        }));
      };

      ProfileEditView.prototype.renderSkillDocuments = function(skill) {
        return $('#documents-tab').html(this.skillDocumentsTemplate({
          skill: skill
        }));
      };

      ProfileEditView.prototype.renderSkillVideos = function(skill) {
        return $('#videos-tab').html(this.skillVideosTemplate({
          skill: skill
        }));
      };

      ProfileEditView.prototype.deleteProfileRecord = function(event) {
        var _this = this;
        return this.userProfile.destroy({
          success: function(response) {
            return _this.showDashboard();
          },
          error: function(profile, error) {
            alert('Error deleting profile: ' + error);
            return _this.showDashboard();
          }
        });
      };

      ProfileEditView.prototype.showDashboard = function() {
        return window.Mi.appRouter.navigate("#/dashboard");
      };

      ProfileEditView.prototype.imgSettings = {
        "profileImgUpload": {
          width: 160,
          height: 160,
          editWidth: 160,
          editHeight: 160,
          resultWidth: 190,
          resultHeight: 190,
          preview: '#profilePicturePreview',
          enableButton: '#upload-profile-image',
          backgroundColor: '#FFFFFF'
        },
        "headlineImgUpload": {
          width: 1000,
          height: 400,
          editWidth: 570,
          editHeight: 238,
          resultWidth: 600,
          resultHeight: 250,
          preview: '#headlinePhotoPreview',
          enableButton: '#upload-headline-image',
          backgroundColor: '#FFFFFF'
        }
      };

      ProfileEditView.prototype.grabImage = function() {
        var files, imgcfg, reader,
          _this = this;
        imgcfg = this.imgSettings[event.target.id];
        this.previewArea = $(imgcfg.preview);
        $(imgcfg.enableButton).removeAttr('disabled');
        files = event.target.files || e.dataTransfer.files;
        this.file = files[0];
        reader = new FileReader();
        reader.onload = function(event) {
          var pvImg;
          console.log('preview area', _this.previewArea.selector);
          pvImg = $('<img></img>').attr("src", event.target.result).load(function() {
            var img;
            img = new Image;
            return img.src = event.target.result;
          });
          _this.previewArea.html('').append(pvImg);
          $(pvImg).css('width', imgcfg.editWidth);
          return $(pvImg).cropimg({
            resultWidth: imgcfg.resultWidth,
            resultHeight: imgcfg.resultHeight,
            zoomDelay: 10,
            inputPrefix: 'ci-'
          });
        };
        if (this.file) {
          reader.readAsDataURL(this.file);
        }
        return this.file;
      };

      ProfileEditView.prototype.scrubbedSkillName = function(skillName) {
        return skillName.toLowerCase().replace(/\s/g, "");
      };

      ProfileEditView.prototype.updateProfilePhoto = function(filepath) {
        this.userProfile.set("profilePictureUrl", filepath);
        $("#profile-photo-modal").hide();
        if (!this.userProfile.get("profilePictureUrl")) {
          this.userProfile.set("profilePictureUrl", filepath);
        }
        this.saveAndUpdateProgress();
        return $("#profile-picture").css('background', 'url("' + filepath + '")');
      };

      ProfileEditView.prototype.editSkillHeadlineImage = function(event) {
        var doCrop, headlineImgUrl, img, imgcfg, startCrop,
          _this = this;
        this.imageFile = void 0;
        headlineImgUrl = this.activeSkill.skillHeadlinePhotoUrl;
        if (headlineImgUrl && headlineImgUrl.length) {
          img = $('<img></img>').attr('src', headlineImgUrl);
          startCrop = false;
        } else {
          img = $('<img></img>').attr('src', this.headlinePhotoPlaceholder());
          startCrop = false;
        }
        $('#headlineImgUpload').val('');
        imgcfg = this.imgSettings["headlineImgUpload"];
        $(img).width($(imgcfg.preview).width());
        $(img).height($(imgcfg.preview).height());
        $(imgcfg.preview).html('').append(img);
        $(imgcfg.enableButton).attr('disabled', 'disabled');
        if (startCrop) {
          doCrop = function() {
            return $(img).cropimg({
              resultWidth: imgcfg.resultWidth,
              resultHeight: imgcfg.resultHeight,
              zoomDelay: 10,
              inputPrefix: 'ci-'
            });
          };
          setTimeout(doCrop, 100);
        }
        return this.showModal(event);
      };

      ProfileEditView.prototype.deleteSkillHeadlineImage = function() {
        this.activeSkill.skillHeadlinePhotoUrl = null;
        $("#headlinePhotoEdit").hide();
        this.saveAndUpdateProgress();
        return $("img.headline-photo").attr('src', this.headlinePhotoPlaceholder());
      };

      ProfileEditView.prototype.updateSkillHeadlinePhoto = function(filepath) {
        var $j, activeButton, index, skills;
        skills = this.userProfile.get("skills");
        $j = jQuery;
        activeButton = $j('.skill-button.active');
        index = activeButton.data('skillid');
        if (index === void 0) {
          index = skills.length - 1;
        }
        skills[index].skillHeadlinePhotoUrl = filepath;
        $("#headlinePhotoEdit").hide();
        this.saveAndUpdateProgress();
        return $("img.headline-photo").attr('src', filepath);
      };

      ProfileEditView.prototype.uploadHeadlineImage = function(event) {
        var doError, imgcfg;
        console.log('Upload headline image');
        imgcfg = this.imgSettings["headlineImgUpload"];
        doError = function(err) {
          alert('Failed to upload image');
          return console.log('Failed to upload headline image: ', err);
        };
        return this.savePhoto(this.file, imgcfg, this.updateSkillHeadlinePhoto, doError);
      };

      ProfileEditView.prototype.uploadProfileImage = function(event) {
        var doError, imgcfg;
        console.log('Upload profile photo');
        doError = function(err) {
          alert('Failed to upload image');
          return console.log('Failed to upload profile image: ', err);
        };
        imgcfg = this.imgSettings["profileImgUpload"];
        return this.savePhoto(this.file, imgcfg, this.updateProfilePhoto, doError);
      };

      ProfileEditView.prototype.savePhoto = function(file, imgcfg, success, failure) {
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

      ProfileEditView.prototype.initPlacesAutocomplete = function() {
        var input, profile;
        profile = this.userProfile.attributes;
        input = document.getElementById("gmap-input");
        return this.autocomplete = new google.maps.places.Autocomplete(input);
      };

      ProfileEditView.prototype.initGoogleMaps = function(mapId, profileType, latlng, location) {
        var circle, locationType, mapOptions, marker, updateMap, zoom;
        $(mapId).gmap3('destroy');
        if (!latlng) {
          latlng = this.userProfile.get('latlng');
        }
        if (!location) {
          location = this.userProfile.get('location');
        }
        if (!profileType) {
          profileType = this.userProfile.get('profileType');
        }
        locationType = this.userProfile.get('locationType');
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
        marker = {
          address: location
        };
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
        return setTimeout(updateMap, 300);
      };

      ProfileEditView.prototype.editMapKeyPress = function(event) {
        if (event.keyCode === 13 || event.keyCode === 32) {
          return this.updateMapPreview();
        }
      };

      ProfileEditView.prototype.editLocation = function() {
        var placeholder, profileType;
        $('#gmap-input').val(this.userProfile.get('location'));
        this.updateMapPreview();
        profileType = this.userProfile.get('profileType');
        switch (profileType) {
          case void 0:
            placeholder = "Enter business address";
            this.autocomplete.setTypes(['geocode']);
            break;
          default:
            placeholder = "Enter business address";
            this.autocomplete.setTypes(['geocode']);
        }
        $('#gmap-input').attr('placeholder', placeholder);
        return window.Mi.appRouter.showEdit('#attributesLocationEdit');
      };

      ProfileEditView.prototype.clearProfileEditMap = function() {
        $("#location-map").gmap3('destroy');
        return $("#location-map").prepend('<img src="images/placeholder_imgs/location_placeholder_edit.jpg"/>');
      };

      ProfileEditView.prototype.clearMapInput = function() {
        $("#gmap-input").val("");
        $("#location-edit-preview").gmap3('destroy');
        return $("#location-edit-preview").prepend('<img src="images/placeholder_imgs/location_placeholder_edit.jpg"/>');
      };

      ProfileEditView.prototype.updateMapPreview = function() {
        var doUpdate, main;
        main = this;
        doUpdate = function() {
          var geocoder, newLocation,
            _this = this;
          newLocation = $('#gmap-input').val();
          if (newLocation && newLocation.length) {
            geocoder = new google.maps.Geocoder();
            return geocoder.geocode({
              address: newLocation
            }, function(results, status) {
              var latlng, loc;
              if (status === google.maps.GeocoderStatus.OK) {
                loc = results[0].geometry.location;
                latlng = [loc.lat(), loc.lng()];
                return main.initGoogleMaps("#location-edit-preview", main.userProfile.get('profileType'), latlng, newLocation);
              }
            });
          } else {
            return main.clearMapInput();
          }
        };
        return setTimeout(doUpdate, 200);
      };

      return ProfileEditView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
