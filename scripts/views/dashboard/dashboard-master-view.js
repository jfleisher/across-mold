(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'modal', 'tooltip', 'templates', 'dashboard-profile-view', 'dashboard-favorite-view'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.DashboardMasterView = (function(_super) {
      __extends(DashboardMasterView, _super);

      function DashboardMasterView() {
        this.removeFavorite = __bind(this.removeFavorite, this);
        this.deleteUserFavorite = __bind(this.deleteUserFavorite, this);
        this.createNewProfile = __bind(this.createNewProfile, this);
        this.renderEmptyFavorites = __bind(this.renderEmptyFavorites, this);
        this.readFavorites = __bind(this.readFavorites, this);
        this.showMyFavorites = __bind(this.showMyFavorites, this);
        this.showMyProfiles = __bind(this.showMyProfiles, this);
        _ref = DashboardMasterView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DashboardMasterView.prototype.template = JST['app/scripts/templates/dashboard/dashboardMasterViewTemplate'];

      DashboardMasterView.prototype.newProfileTemplate = JST['app/scripts/templates/dashboard/dashboardNewProfileTemplate'];

      DashboardMasterView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      DashboardMasterView.prototype.profilePublishedMessage = JST['app/scripts/templates/email/profile_published'];

      DashboardMasterView.prototype.emptyFavoritesTemplate = JST['app/scripts/templates/dashboard/dashboardEmptyFavoritesTemplate'];

      DashboardMasterView.prototype.className = 'dashboard-master wrapper';

      DashboardMasterView.prototype.events = {
        'click #add-new-profile': 'chooseNewProfileType',
        'click .profile-button': 'toggleActiveProfile',
        'mouseenter .profile-button': 'showHoveredProfileType',
        'mouseleave .profile-button': 'showSelectedProfileType',
        'click #create-new-profile': 'createNewProfile',
        'click .sub-nav-delete': 'deleteProfileFromList',
        'click #delete-profile-confirm': 'deleteProfileRecord',
        'click .close-modal': 'closeModal',
        'click .open-modal': 'showModal',
        'click .dashboard-live': 'makeProfilePrivate',
        'click .dashboard-private': 'makeProfileLive',
        'click #my-profiles': 'goToProfiles',
        'click #my-favorites': 'goToFavorites',
        'click input.viewFavProfile': "viewFavoriteProfile",
        'click #removeFavorite': 'removeFavorite'
      };

      DashboardMasterView.prototype.initialize = function(options) {
        $(".upper-bkgd").css('height', '');
        this.user = options.user;
        return this.initialTab = options.tab;
      };

      DashboardMasterView.prototype.render = function() {
        if (!this.user) {
          this.user = Parse.User.current();
        }
        $('.footer-container').remove();
        console.log('model as seen in dashboard', this.user);
        this.$el.append(this.template({
          user: this.user
        }));
        if (this.initialTab === 'favorites') {
          this.showMyFavorites();
        } else {
          this.showMyProfiles();
        }
        return this;
      };

      DashboardMasterView.prototype.goToProfiles = function() {
        return window.Mi.appRouter.navigate("#/dashboard/profiles", {
          trigger: true
        });
      };

      DashboardMasterView.prototype.showMyProfiles = function() {
        if (this.profiles && this.profiles.length) {
          return this.renderProfiles(this.profiles);
        } else {
          return this.readProfiles();
        }
      };

      DashboardMasterView.prototype.goToFavorites = function() {
        window.Mi.favoritesScrollPos = void 0;
        return window.Mi.appRouter.navigate("#/dashboard/favorites", {
          trigger: true
        });
      };

      DashboardMasterView.prototype.showMyFavorites = function() {
        if (this.favorites && this.favorites.length) {
          return this.renderFavorites(this.favorites);
        } else {
          return this.readFavorites();
        }
      };

      DashboardMasterView.prototype.readProfiles = function() {
        var pType, query, user, view,
          _this = this;
        view = this;
        user = Parse.User.current();
        pType = Parse.Object.extend({
          className: "Profile"
        });
        query = new Parse.Query(pType);
        query.equalTo("parent", user);
        query.descending("updatedAt", "createAt");
        return query.find({
          success: function(results) {
            console.log(results.length, ' profiles retrieved for user ' + user.id);
            view.profiles = results;
            return view.renderProfiles(results);
          },
          error: function(error) {
            return console.log('Unable to read user profiles: ' + error);
          }
        });
      };

      DashboardMasterView.prototype.renderProfiles = function(profiles) {
        var _this = this;
        $('div.dashboard-profile-area').html('');
        $('div.profile-header-buttons .button-link').removeClass('active');
        $('#my-profiles').addClass('active');
        if (window.Mi.appRouter.isSmallDisplay) {
          $('#add-new-profile').addClass('hidden');
        } else {
          $('#add-new-profile').removeClass('hidden');
        }
        _.each(profiles, function(profile) {
          var likeType, qry;
          likeType = Parse.Object.extend("Profile_likes");
          qry = new Parse.Query(likeType);
          qry.equalTo('parent', profile);
          return qry.find({
            success: function(results) {
              var likes, percentComplete, profileSummary;
              if (results.length > 0) {
                likes = results[0].get('likes');
              } else {
                likes = 0;
              }
              profileSummary = new Mi.Views.DashboardProfileView({
                profileId: profile.id,
                profile: profile,
                profileLikes: likes
              });
              _this.appendChildTo(profileSummary, ".dashboard-profile-area");
              percentComplete = _this.getProfileCompleteness(profile);
              _this.renderProgressBar(profileSummary.$el, percentComplete);
              if (window.Mi.appRouter.isMobile) {
                return $('.sub-nav-button.edit-profile, .sub-nav-button.sub-nav-delete').addClass('hidden');
              } else {
                return $('.sub-nav-button.edit-profile, .sub-nav-button.sub-nav-delete').removeClass('hidden');
              }
            },
            error: function(results, err) {
              var percentComplete, profileSummary;
              console.log("error reading likes: ", err);
              profileSummary = new Mi.Views.DashboardProfileView({
                profileId: profile.id,
                profile: profile,
                profileLikes: 0
              });
              _this.appendChildTo(profileSummary, ".dashboard-profile-area");
              percentComplete = _this.getProfileCompleteness(profile);
              return _this.renderProgressBar(profileSummary.$el, percentComplete);
            }
          });
        });
        if ($('div.footer-container').length === 0) {
          return $('#footer').html(this.footerTemplate());
        }
      };

      DashboardMasterView.prototype.readFavorites = function() {
        var pType, query, user, view,
          _this = this;
        view = this;
        user = Parse.User.current();
        view.favorites = [];
        pType = Parse.Object.extend({
          className: "User_favorites"
        });
        query = new Parse.Query(pType);
        query.equalTo("parent", user);
        query.include("profile");
        query.descending("updatedAt", "createAt");
        return query.find({
          success: function(results) {
            console.log(results.length, ' favorites retrieved for user ' + user.id);
            _.each(results, function(fav) {
              return view.favorites.push(fav.get('profile'));
            });
            return view.renderFavorites(view.favorites);
          },
          error: function(error) {
            return console.log('Unable to read user favorites: ' + error);
          }
        });
      };

      DashboardMasterView.prototype.renderEmptyFavorites = function() {
        var missingFavorites;
        missingFavorites = this.emptyFavoritesTemplate();
        return $("div.dashboard-profile-area").append(missingFavorites);
      };

      DashboardMasterView.prototype.renderFavorites = function(favorites) {
        var i,
          _this = this;
        $('div.dashboard-profile-area').html('');
        $('div.profile-header-buttons .button-link').removeClass('active');
        $('#my-favorites').addClass('active');
        $('#add-new-profile').addClass('hidden');
        i = 0;
        if (favorites && favorites.length) {
          _.each(favorites, function(profile) {
            var likeType, qry, setScroll;
            i++;
            likeType = Parse.Object.extend("Profile_likes");
            setScroll = function() {
              if (i === favorites.length && window.Mi.favoritesScrollPos) {
                $(window).scrollTop(1);
                $(window).scrollTop(0);
                return $('body').scrollTop(window.Mi.favoritesScrollPos);
              }
            };
            qry = new Parse.Query(likeType);
            qry.equalTo('parent', profile);
            return qry.find({
              success: function(results) {
                var likes, profileSummary;
                if (results.length > 0) {
                  likes = results[0].get('likes');
                } else {
                  likes = 0;
                }
                profileSummary = new Mi.Views.DashboardFavoriteView({
                  profileId: profile.id,
                  profile: profile,
                  profileLikes: likes
                });
                _this.appendChildTo(profileSummary, ".dashboard-profile-area");
                return setTimeout(setScroll, 0);
              },
              error: function(results, err) {
                var profileSummary;
                console.log("error reading likes: ", err);
                profileSummary = new Mi.Views.DashboardFavoriteView({
                  profileId: profile.id,
                  profile: profile,
                  profileLikes: 0
                });
                return _this.appendChildTo(profileSummary, ".dashboard-profile-area");
              }
            });
          });
        } else {
          this.renderEmptyFavorites();
        }
        if ($('div.footer-container').length === 0) {
          return $('#footer').html(this.footerTemplate());
        }
      };

      DashboardMasterView.prototype.viewProfile = function() {
        var profileId, target;
        target = event.target;
        profileId = $(target).data('profileid');
        return Mi.Routers.AppRouter.prototype.navigate('#/display-profile/' + profileId, true);
      };

      DashboardMasterView.prototype.viewFavoriteProfile = function(event) {
        var profileId, target;
        window.Mi.favoritesScrollPos = $('body').scrollTop();
        target = event.target;
        profileId = $(target).data('profileid');
        return Mi.Routers.AppRouter.prototype.navigate('#/display-profile/' + profileId, true);
      };

      DashboardMasterView.prototype.renderProgressBar = function(summaryElement, percentage) {
        console.log('renderProgressBar called, percentage complete:', percentage);
        $(summaryElement).find(".percentage-complete").html(percentage + '% complete');
        return $(summaryElement).find(".progress-bar").css("width", percentage + "%");
      };

      DashboardMasterView.prototype.addPrivateToolTip = function(el) {
        var e;
        try {
          $(el).tooltip('destroy');
        } catch (_error) {
          e = _error;
        }
        return $(el).tooltip({
          trigger: 'hover focus',
          title: 'Click to go Live',
          placement: 'top'
        });
      };

      DashboardMasterView.prototype.addLiveToolTip = function(el) {
        var e;
        try {
          $(el).tooltip('destroy');
        } catch (_error) {
          e = _error;
        }
        return $(el).tooltip({
          trigger: 'hover focus',
          title: 'Click to make Private',
          placement: 'top'
        });
      };

      DashboardMasterView.prototype.makeProfileLive = function(event) {
        var completeness, profile, profileId, target,
          _this = this;
        target = event.target;
        profileId = $(target).data('profileid');
        profile = this.getProfile(profileId);
        completeness = this.getProfileCompleteness(profile);
        if (completeness >= 50) {
          profile.set("profilePublished", true);
          return profile.save(null, {
            success: function(response) {
              var msg;
              $(target).removeClass('dashboard-private').addClass('dashboard-live').text("Live");
              msg = _this.profilePublishedMessage({
                profileId: profileId,
                profile: profile.attributes
              });
              window.Mi.messagesRouter.sendEmail("across-mold.com", "signup@across-mold.com", "across-mold.com", "signup@across-mold.com", "Profile published: " + profile.get('profileName'), msg);
              return _this.addLiveToolTip(target);
            },
            error: function(err) {
              return console.log("error: " + err);
            }
          });
        } else {
          return this.showMessage("Can't make this profile Live.  Profile must be at least 50% complete to go Live.");
        }
      };

      DashboardMasterView.prototype.makeProfilePrivate = function(event) {
        var profile, profileId, target,
          _this = this;
        target = event.target;
        profileId = $(target).data('profileid');
        profile = this.getProfile(profileId);
        profile.set("profilePublished", false);
        return profile.save(null, {
          success: function(response) {
            $(target).removeClass('dashboard-live').addClass('dashboard-private').text("Private");
            return _this.addPrivateToolTip(target);
          },
          error: function(err) {
            return console.log("error: " + err);
          }
        });
      };

      DashboardMasterView.prototype.getProfile = function(profileId) {
        var matchingProfile,
          _this = this;
        matchingProfile = null;
        _.each(this.profiles, function(profile) {
          if (profile.id === profileId) {
            return matchingProfile = profile;
          }
        });
        return matchingProfile;
      };

      DashboardMasterView.prototype.chooseNewProfileType = function() {
        if (window.Mi.appRouter.isMobile) {
          return window.Mi.messagesRouter.showMessage('Mobile devices are too small for profile creation. Please use a desktop or laptop computer to create and edit profiles.');
        } else {
          this.chosenProfileType = '_3d_Printing';
          console.log('chooseNewProfileType called');
          this.$el.html('');
          return this.$el.append(this.newProfileTemplate({
            Mi: Mi
          }));
        }
      };

      DashboardMasterView.prototype.toggleActiveProfile = function(event) {
        var targetedProfile;
        $(".profile-button").removeClass("selected-profile");
        $(event.target).addClass("selected-profile");
        $(".profile-selection-desc").hide();
        targetedProfile = $(event.target).data("profiletype");
        $("#" + targetedProfile + "-desc").show();
        return this.chosenProfileType = $(event.target).data("profiletype");
      };

      DashboardMasterView.prototype.showSelectedProfileType = function(event) {
        var selBtn, targetedProfile;
        selBtn = $('.selected-profile');
        $(".profile-selection-desc").hide();
        targetedProfile = $(selBtn).data("profiletype");
        $("#" + targetedProfile + "-desc").show();
        return this;
      };

      DashboardMasterView.prototype.showHoveredProfileType = function(event) {
        var targetedProfile;
        $(event.target).addClass("hovered-profile");
        $(".profile-selection-desc").hide();
        targetedProfile = $(event.target).data("profiletype");
        $("#" + targetedProfile + "-desc").show();
        return this;
      };

      DashboardMasterView.prototype.initProfileFields = function(profile) {
        profile.set('parent', this.user);
        if (profile.get('currentlyPromoted') === void 0) {
          profile.set('currentlyPromoted', false);
        }
        if (profile.get('lastEdited') === void 0) {
          profile.set('lastEdited', new Date());
        }
        if (profile.get('organizations') === void 0) {
          profile.set('organizations', []);
        }
        if (profile.get('profileOwner') === void 0) {
          profile.set('profileOwner', this.user.get("email"));
        }
        if (profile.get('profileType') === void 0) {
          profile.set('profileType', this.chosenProfileType);
        }
        if (profile.get('skills') === void 0) {
          profile.set('skills', []);
        }
        if (profile.get('tags') === void 0) {
          profile.set('tags', []);
        }
        if (profile.get('profileCustomUrl') === void 0) {
          profile.set('profileCustomUrl', null);
        }
        if (profile.get('profileContactEmail') === void 0) {
          profile.set('profileContactEmail', null);
        }
        if (profile.get('profilePublished') === void 0) {
          return profile.set('profilePublished', false);
        }
      };

      DashboardMasterView.prototype.createNewProfile = function() {
        var pType, userProfile,
          _this = this;
        pType = Parse.Object.extend({
          className: "Profile"
        });
        userProfile = new pType;
        this.initProfileFields(userProfile);
        console.log('new profile created');
        return userProfile.save(null, {
          success: function(profile) {
            window.Mi.appRouter.navigate("#/edit-profile/" + profile.id, {
              trigger: true
            });
            return console.log('saved profile:', profile);
          },
          error: function(profile, error) {
            console.log('error saving profile: ', error);
            return console.log('profile: ', profile);
          }
        });
      };

      DashboardMasterView.prototype.deleteProfileFromList = function(event) {
        var profileId, profileType;
        if (this.profiles.length > 1) {
          profileId = $(event.target).data('profileid');
          profileType = $(event.target).data('profiletype');
          $('span.confirm-delete-subtitle').text("Are you sure you want to delete this " + profileType + " profile?");
          $('#delete-profile-confirm').data('profileid', profileId).data('profiletype', profileType);
          return $('#profile-delete-modal').show();
        } else {
          return this.showMessage("This is the only profile defined for this account. You can't delete last profile.");
        }
      };

      DashboardMasterView.prototype.showMessage = function(message) {
        return window.Mi.messagesRouter.showMessage(message);
      };

      DashboardMasterView.prototype.deleteProfileRecord = function(event) {
        var pType, profileId, query,
          _this = this;
        profileId = $(event.target).data('profileid');
        pType = Parse.Object.extend({
          className: "Profile"
        });
        query = new Parse.Query(pType);
        query.get(profileId, {
          success: function(profile) {
            var profileDiv;
            profileDiv = $('#profile-summary-' + profile.id).closest('div.dashboard-profile');
            $(profileDiv).slideUp('300', (function() {
              return $(this).remove();
            }));
            console.log('deleting profile: ', profile.id);
            return profile.destroy(null);
          },
          error: function(object, error) {
            return console.log('error deleting profile ', profile.id, ' error: ', error);
          }
        });
        return $('#profile-delete-modal').hide();
      };

      DashboardMasterView.prototype.closeModal = function(event) {
        var modalname;
        modalname = $(event.target).data('closemodal');
        return $('#' + modalname).hide();
      };

      DashboardMasterView.prototype.showModal = function(event) {
        var modalID, targetModal;
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
            $(".edit-profile-name").val($(".title-name").html());
          }
          $(".popover").hide();
          $('.modal').modal('hide');
          return $("#" + targetModal).show();
        }
      };

      DashboardMasterView.prototype.deleteUserFavorite = function(user, profileId, done) {
        var favQry,
          _this = this;
        if (!user) {
          console.log('attempted to remove favorite when not logged in.');
        }
        if (!profileId) {
          console.log('attempted to delete favorite but not profile id provided.');
        }
        favQry = new Parse.Query('User_favorites');
        favQry.equalTo('parent', user);
        favQry.include('profile');
        Parse.Promise.when([favQry.find()]).then(function(allFavs) {
          return _.each(allFavs, function(fav) {
            if (fav.get('profile').id === profileId) {
              console.log('remove user favorite profile id: ' + profileId);
              return fav.destroy({
                success: function(obj) {
                  console.log('user favorite removed: ' + profileId);
                  return done();
                },
                error: function(obj, error) {
                  return console.log('error removing user favorite: ' + error);
                }
              });
            }
          });
        });
        return this;
      };

      DashboardMasterView.prototype.removeFavorite = function(event) {
        var profileId, removeIndex, target;
        target = event.target;
        profileId = $(target).data('profileid');
        removeIndex = -1;
        _.each(this.favorites, function(fav, index) {
          if (fav.id === profileId) {
            removeIndex = index;
          }
        });
        if (removeIndex > -1) {
          this.favorites.splice(removeIndex, 1);
        }
        this.deleteUserFavorite(Parse.User.current(), profileId, this.showMyFavorites);
        return this;
      };

      return DashboardMasterView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
