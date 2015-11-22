(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'modal', 'menu-view', 'profile-master-view', 'profile-edit-view', 'registration-master-view', 'registration-log-in-view', 'quotation-view', 'dashboard-master-view', 'dashboard-profile-view', 'dashboard-favorite-view', 'microsite-master-view', 'search-master-view', 'login-layer', 'helpers', 'select2', 'gmap3', 'parallax', 'mandrill'], function(Mi, Support, Parse) {
    var _ref;
    Mi.Routers.AppRouter = (function(_super) {
      __extends(AppRouter, _super);

      function AppRouter() {
        this.forwardToDashboard = __bind(this.forwardToDashboard, this);
        this.editQuote = __bind(this.editQuote, this);
        this.showProfile = __bind(this.showProfile, this);
        this.updateProfileACL = __bind(this.updateProfileACL, this);
        _ref = AppRouter.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      AppRouter.prototype.loginTemplate = JST['app/scripts/templates/modals/login-modal'];

      AppRouter.prototype.messageTemplate = JST['app/scripts/templates/modals/message-modal'];

      AppRouter.prototype.menuTemplate = JST['app/scripts/templates/menuTemplate'];

      AppRouter.prototype.quotationTemplate = JST['app/scripts/templates/modals/quotationEditTemplate'];

      AppRouter.prototype.waitTemplate = JST['app/scripts/templates/modals/wait-modal'];

      AppRouter.prototype.routes = {
        '': 'showMicrosite',
        'microsite(/)(:category)': 'showMicrosite',
        'display-profile(/:profileId)': 'showProfile',
        'register': 'showRegistration',
        'dashboard': 'forwardToDashboard',
        'dashboard(/)profiles': 'showDashboard',
        'dashboard(/)favorites': 'showFavorites',
        'edit-profile(/:profileId)': 'editProfile',
        'search(/q/)(:term)(/)(:location)(/)': 'search',
        'quotation': 'editQuote',
        ':url': 'customUrl'
      };

      AppRouter.prototype.isMobile = navigator.userAgent.match(/Mobi/) !== null;

      AppRouter.prototype.isSmallDisplay = $('.device-xs:visible, .device-sm:visible').length > 0;

      AppRouter.prototype.GoogleAnalytics = {
        init: function(webPropertyId) {
          var scriptTag;
          this._initQueue(webPropertyId);
          scriptTag = this._createScriptTag();
          this._injectScriptTag(scriptTag);
          return true;
        },
        _initQueue: function(webPropertyId) {
          if (window._gaq == null) {
            window._gaq = [];
          }
          window._gaq.push(['_setAccount', webPropertyId]);
          return window._gaq.push(['_trackPageview']);
        },
        _createScriptTag: function() {
          var protocol, scriptTag;
          scriptTag = document.createElement('script');
          scriptTag.type = 'text/javascript';
          scriptTag.async = true;
          protocol = location.protocol;
          scriptTag.src = "" + protocol + "//stats.g.doubleclick.net/dc.js";
          return scriptTag;
        },
        _injectScriptTag: function(scriptTag) {
          var firstScriptTag;
          firstScriptTag = document.getElementsByTagName('script')[0];
          return firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
        },
        trackPageView: function(url) {
          return;
          return window._gaq.push(['_trackPageview', url]);
        },
        trackEvent: function(category, action, label, value, nonInteraction) {
          var argument, trackedEvent, _i, _len, _ref1;
          if (label == null) {
            label = null;
          }
          if (value == null) {
            value = null;
          }
          if (nonInteraction == null) {
            nonInteraction = null;
          }
          trackedEvent = ['_trackEvent', category, action];
          _ref1 = [label, value, nonInteraction];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            argument = _ref1[_i];
            if (argument != null) {
              trackedEvent.push(argument);
            } else {
              break;
            }
          }
          return window._gaq.push(trackedEvent);
        }
      };

      AppRouter.prototype.loadCMS = function() {
        var CMS, attrs, certifications, cfg, labels, organizations, pType, profile_types, ptype, refreshSearchAutoComplete, skill_types, summary, tags,
          _this = this;
        CMS = Mi.CMS;
        refreshSearchAutoComplete = Mi.Views.MenuView.prototype.initSearchAutocomplete;
        pType = Parse.Object.extend("site_config");
        cfg = new Parse.Query(pType);
        cfg.find({
          success: function(results) {
            console.log("config items loaded: ", results.length);
            return _.each(results, function(setting) {
              return CMS[setting.get('name')] = setting.get('value');
            });
          }
        });
        ptype = Parse.Object.extend('Profile_labels');
        labels = new Parse.Query(ptype);
        labels.find({
          success: function(results) {
            console.log("found field label data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                var fld;
                fld = result.get('field');
                CMS.labels[fld] = result.get('label');
                return CMS.prompts[fld] = result.get('prompt');
              });
            }
          }
        });
        ptype = Parse.Object.extend('Profile_types');
        profile_types = new Parse.Query(ptype);
        profile_types.ascending('name');
        profile_types.find({
          success: function(results) {
            console.log("found profile type data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                var type;
                type = result.get('type');
                if (type !== 'default') {
                  CMS.profile_types.push(result.get('name'));
                  CMS.profile_index.push(type);
                }
                return CMS.profile_desc[type] = result.get('description');
              });
            }
          }
        });
        ptype = Parse.Object.extend('Profile_skill_types');
        skill_types = new Parse.Query(ptype);
        skill_types.find({
          success: function(results) {
            console.log("found profile skill types data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                var customQry, profileType, ptypeCustom, values;
                profileType = result.get('type');
                values = result.get('skill_types');
                if (values) {
                  CMS[profileType].skill_types = _.sortBy(values, 'text');
                }
                ptypeCustom = Parse.Object.extend('Profile_skill_types_custom');
                customQry = new Parse.Query(ptypeCustom);
                customQry.equalTo('type', profileType);
                return customQry.find({
                  success: function(results) {
                    var customValues;
                    console.log("found custom profile skill types data, results: ", results);
                    if (results && results[0]) {
                      customValues = results[0].get('skill_types');
                      CMS[profileType].skill_types = _.sortBy(values.concat(customValues), 'text');
                      return refreshSearchAutoComplete();
                    }
                  }
                });
              });
            }
          }
        });
        ptype = Parse.Object.extend('Profile_organizations');
        organizations = new Parse.Query(ptype);
        organizations.find({
          success: function(results) {
            console.log("found profile organizations data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                var values;
                values = result.get('organizations');
                if (values) {
                  return CMS[result.get('type')].organizations = _.sortBy(values, 'text');
                }
              });
            }
          }
        });
        ptype = Parse.Object.extend('Profile_tags');
        tags = new Parse.Query(ptype);
        tags.find({
          success: function(results) {
            console.log("found profile organizations data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                var customQry, profileType, ptypeCustom, values;
                profileType = result.get('type');
                values = result.get('tags');
                if (values) {
                  CMS[profileType].tags = _.sortBy(values, 'text');
                }
                ptypeCustom = Parse.Object.extend('Profile_tags_custom');
                customQry = new Parse.Query(ptypeCustom);
                customQry.equalTo('type', profileType);
                return customQry.find({
                  success: function(results) {
                    var customValues;
                    console.log("found custom profile tags data, results: ", results);
                    if (results && results[0]) {
                      customValues = results[0].get('tags');
                      CMS[profileType].tags = _.sortBy(values.concat(customValues), 'text');
                      return refreshSearchAutoComplete();
                    }
                  }
                });
              });
            }
          }
        });
        ptype = Parse.Object.extend('Profile_certifications');
        certifications = new Parse.Query(ptype);
        certifications.find({
          success: function(results) {
            console.log("found profile certifications data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                var values;
                values = result.get('certifications');
                if (values) {
                  return CMS[result.get('type')].certifications = _.sortBy(values, 'text');
                }
              });
            }
          }
        });
        ptype = Parse.Object.extend('Profile_summary_placeholders');
        summary = new Parse.Query(ptype);
        summary.find({
          success: function(results) {
            console.log("found profile summary placeholder data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                return CMS[result.get('type')].summary_placeholder = result.get('placeholder');
              });
            }
          }
        });
        ptype = Parse.Object.extend('Profile_attributes');
        attrs = new Parse.Query(ptype);
        return attrs.find({
          success: function(results) {
            console.log("found profile attributes data, results: ", results);
            if (results) {
              return _.each(results, function(result) {
                return CMS[result.get('type')].attributes[result.get('attribute')] = result.get('values');
              });
            }
          }
        });
      };

      AppRouter.prototype.initNavBar = function() {
        return $('.fixed-navbar').html('');
      };

      AppRouter.prototype.initialize = function() {
        Parse.initialize("q8RSB55zBX88cv27GWzRjXLHX3Ijk8haCfhIGbEH", "1WbjEiZ6dyiq0hxWEMciHr5jUmArpjdJjeNNVpw4");
        this.currentUser = Parse.User.current();
        this.loadCMS();
        this.el = $("#main-stage");
        console.log('currentUser in router init:', this.currentUser);
        console.log('AppRouter initialized, version 0.0.1');
        $('body').delegate('#menu-log-in', 'click', this.userLogin);
        $('body').delegate('#submit-login', 'click', this.doLogin);
        $('body').delegate('#submit-login-dd', 'click', this.doLogin_dd);
        return this;
      };

      AppRouter.prototype.cleanStage = function() {
        $('div.imageHolder').remove();
        $('#login-box').modal('hide');
        $(".modal-content").modal('hide');
        $('.modal-backdrop').remove();
        $(window).scrollTop(0);
        return $('#main-stage').scrollTop(0);
      };

      AppRouter.prototype.showLogin = function() {
        var view;
        view = new Mi.Views.LoginLayer();
        this.swap(view);
        return this.initPage('Login');
      };

      AppRouter.prototype.showEdit = function(el) {
        $('.popover').hide();
        $('.modal').modal('hide');
        return $(el).show();
      };

      AppRouter.prototype.userLogin = function(doOnReturn, title) {
        var closeLogin;
        $('.popover').hide;
        $('.modal').modal('hide');
        $('body').append(Mi.Routers.AppRouter.prototype.loginTemplate({
          title: title
        }));
        $('#login-box').modal({
          backdrop: 'static',
          keyboard: false
        });
        $('#login-email').focus();
        $('#login-box .modal-title').text(title);
        closeLogin = function() {
          return $('#login-box').modal('hide');
        };
        $('#login-box').delegate('#login-close', 'click', closeLogin);
        if (doOnReturn && $.isFunction(doOnReturn)) {
          AppRouter.loginReturnAction = doOnReturn;
        } else {
          AppRouter.loginReturnAction = null;
        }
        new Mi.Views.MenuView({
          user: Parse.User.current()
        });
        return this;
      };

      AppRouter.prototype.doLogin = function() {
        var pass, username,
          _this = this;
        console.log('login attempted');
        username = $("#login-email").val().toLowerCase();
        pass = $("#login-password").val();
        Parse.User.logIn(username, pass, {
          success: function(user) {
            console.log('login successful');
            $('.fixed-navbar').html('');
            new Mi.Views.MenuView({
              user: Parse.User.current()
            });
            $("#login-box").modal('hide').remove();
            if (AppRouter.loginReturnAction) {
              return AppRouter.loginReturnAction();
            } else {
              return window.Mi.appRouter.navigate('#/dashboard');
            }
          },
          error: function(user, error) {
            alert("Login Failed: invalid email or password");
            return console.log('login failed. error: ', error);
          }
        });
        return this;
      };

      AppRouter.prototype.doLogin_dd = function() {
        var pass, username,
          _this = this;
        console.log('login attempted');
        username = $("#login-email-dd").val().toLowerCase();
        pass = $("#login-password-dd").val();
        Parse.User.logIn(username, pass, {
          success: function(user) {
            console.log('login successful');
            $('.fixed-navbar').html('');
            new Mi.Views.MenuView({
              user: Parse.User.current()
            });
            $("#login-box").modal('hide').remove();
            if (AppRouter.loginReturnAction) {
              return AppRouter.loginReturnAction();
            } else {
              return window.Mi.appRouter.navigate('#/dashboard');
            }
          },
          error: function(user, error) {
            alert("Login Failed: invalid email or password");
            return console.log('login failed. error: ', error);
          }
        });
        return this;
      };

      AppRouter.prototype.search = function(term, location) {
        var view;
        this.cleanStage();
        view = new Mi.Views.SearchMasterView({
          user: this.currentUser,
          term: term,
          location: location
        });
        $.extend(view, {
          userLogin: this.userLogin,
          showProfile: this.showProfile
        });
        this.swap(view);
        this.initPage('Search');
        return this;
      };

      AppRouter.prototype.customUrl = function(url) {
        var doSearch, pType, query, showProfile;
        pType = Parse.Object.extend("Profile");
        query = new Parse.Query(pType);
        query.equalTo('profilePublished', true);
        query.equalTo('profileCustomUrl', url);
        showProfile = this.showProfile;
        doSearch = function() {
          return window.Mi.appRouter.navigate('search/q/' + url, {
            trigger: true
          });
        };
        return query.find({
          success: function(results) {
            if (results.length) {
              return showProfile(results[0].id);
            } else {
              return doSearch();
            }
          },
          error: function(error) {
            console.log("CustomUrl Error: " + error.code + " " + error.message);
            return doSearch();
          }
        });
      };

      AppRouter.prototype.showMicrosite = function(category) {
        var _this = this;
        $('.modal').modal('hide');
        return $('.stage').fadeOut('fast', function() {
          var view;
          _this.cleanStage();
          view = new Mi.Views.MicrositeMasterView({
            category: category
          });
          $.extend(view, {
            login: _this.login
          });
          _this.swap(view);
          _this.initPage(category);
          return _this;
        });
      };

      AppRouter.prototype.standardizeProfileFields = function(profile) {
        var finalSearchValues, name, searchValues, tags;
        if (profile.get('currentlyPromoted') === void 0) {
          profile.set('currentlyPromoted', false);
        }
        if (profile.get('lastEdited') === void 0) {
          profile.set('lastEdited', new Date());
        }
        if (profile.get('organizations') === void 0) {
          profile.set('organizations', []);
        }
        if (profile.get('certifications') === void 0) {
          profile.set('certifications', []);
        }
        if (profile.get('profileOwner') === void 0) {
          profile.set('profileOwner', this.user.get("email"));
        }
        if (profile.get('profileType') === void 0) {
          profile.set('profileType', {});
        }
        if (profile.get('skills') === void 0) {
          profile.set('skills', []);
        }
        if (profile.get('tags') === void 0) {
          profile.set('tags', []);
        }
        if (profile.get('profilePictureUrl') === void 0) {
          profile.set('profilePictureUrl', null);
        }
        if (profile.get('profileCustomUrl') === void 0) {
          profile.set('profileCustomUrl', null);
        }
        if (profile.get('profileContactEmail') === void 0) {
          profile.set('profileContactEmail', null);
        }
        if (profile.get('profilePublished') === void 0) {
          profile.set('profilePublished', false);
        }
        if (profile.get('promptedToPublish') === void 0) {
          profile.set('promptedToPublish', false);
        }
        searchValues = [];
        name = profile.get('profileName');
        if (name) {
          searchValues.push(name);
          searchValues.push(name.split(' '));
        }
        searchValues.push(profile.get('organizations'));
        searchValues.push(profile.get('certifications'));
        searchValues.push(profile.get('profileType'));
        searchValues.push(profile.get('profileCustomUrl'));
        tags = profile.get('tags');
        if (tags) {
          searchValues.push(tags);
          _.each(tags, function(val) {
            return searchValues.push(val.split(' '));
          });
        }
        _.each(profile.get('skills'), function(skill) {
          return searchValues.push(skill.skillType);
        });
        searchValues = _.flatten(searchValues);
        finalSearchValues = [];
        _.each(searchValues, function(val) {
          if (val) {
            return finalSearchValues.push(val.toString().toLowerCase());
          }
        });
        return profile.set('searchValues', finalSearchValues);
      };

      AppRouter.prototype.getProfileCompleteness = function(profile) {
        var completeness, initialSkill, skillaudioPts, skilldocPts, skillheadlinePts, skillphotoPts, skillsummaryPts, skillvidPts;
        completeness = 0;
        console.log('getProfileCompleteness called, profile to check:', profile);
        if (profile) {
          if (profile.get('location')) {
            completeness += 5;
          }
          if (profile.get('tags').length) {
            completeness += 10;
          }
          if (profile.get('profileFeatures')) {
            completeness += 10;
          }
          if (profile.get('profilePictureUrl')) {
            completeness += 10;
          }
          if (profile.get('organizations') && profile.get('organizations').length) {
            completeness += 5;
          }
          if (profile.get('certifications') && profile.get('certifications').length) {
            completeness += 5;
          }
          if (profile.get('skills')) {
            skillheadlinePts = 20;
            skillsummaryPts = 20;
            skillaudioPts = 5;
            skilldocPts = 5;
            skillvidPts = 5;
            skillphotoPts = 5;
            initialSkill = profile.get('skills')[0];
            _.each(profile.get('skills'), function(skill) {
              var _ref1, _ref2, _ref3, _ref4;
              if (skill.skillHeadlinePhotoUrl && skill.skillHeadlinePhotoUrl.length) {
                completeness += skillheadlinePts;
                skillheadlinePts = 0;
              }
              if (skill.skillSummary) {
                completeness += skillsummaryPts;
                skillsummaryPts = 0;
              }
              if ((_ref1 = skill.skillAudio) != null ? _ref1.soundcloud : void 0) {
                completeness += skillaudioPts;
                skillaudioPts = 0;
              }
              if ((_ref2 = skill.skillDocuments) != null ? _ref2.length : void 0) {
                completeness += skilldocPts;
                skilldocPts = 0;
              }
              if ((_ref3 = skill.skillVideo) != null ? _ref3.length : void 0) {
                completeness += skillvidPts;
                skillvidPts = 0;
              }
              if ((_ref4 = skill.skillPhotos) != null ? _ref4.length : void 0) {
                completeness += skillphotoPts;
                return skillphotoPts = 0;
              }
            });
          }
        }
        return completeness;
      };

      AppRouter.prototype.updateProfileACL = function() {
        var pType, qry,
          _this = this;
        pType = Parse.Object.extend("Profile");
        qry = new Parse.Query(pType);
        return qry.find({
          success: function(results) {
            return _.each(results, function(profile) {
              var parent, profACL,
                _this = this;
              parent = profile.get('parent');
              profACL = new Parse.ACL(parent);
              profACL.setPublicReadAccess(true);
              profile.setACL(profACL);
              return profile.save(null, {
                success: function(profile) {
                  return console.log("set profile acl: " + profile.id + " parent:" + parent.id);
                }
              });
            });
          }
        });
      };

      AppRouter.prototype.showProfile = function(profileId) {
        var profileQuery,
          _this = this;
        this.cleanStage();
        profileQuery = new Parse.Query("Profile");
        profileQuery.include('parent');
        return profileQuery.get(profileId, {
          success: function(profile) {
            var view;
            console.log('profile found, rendering: ', profile);
            view = new Mi.Views.ProfileMasterView({
              profile: profile,
              profileId: profile.id
            });
            $.extend(view, {
              userLogin: AppRouter.prototype.userLogin
            });
            _this.swap(view);
            return _this.initPage('Profile');
          },
          error: function(error) {
            return console.log("profile not found or something, err: ", error);
          }
        });
      };

      AppRouter.prototype.editProfile = function(profileId) {
        var view;
        this.cleanStage();
        console.log('currentUser in editprofile route:', this.currentUser);
        view = new Mi.Views.ProfileEditView({
          user: this.currentUser,
          profileId: profileId
        });
        $.extend(view, {
          getProfileCompleteness: this.getProfileCompleteness,
          standardizeProfileFields: this.standardizeProfileFields,
          login: this.login
        });
        this.swap(view);
        return this.initPage('Edit Profile');
      };

      AppRouter.prototype.editQuote = function(ev) {
        var view;
        this.cleanStage();
        view = new Mi.Views.EditQuotationView();
        this.swap(view);
        this.initPage('Quotation');
        $('div.footer-container').remove();
        return this;
      };

      AppRouter.prototype.showRegistration = function() {
        var view;
        this.cleanStage();
        view = new Mi.Views.RegistrationMasterView();
        this.swap(view);
        this.initPage('Registration');
        return $('div.footer-container').remove();
      };

      AppRouter.prototype.initPage = function(location) {
        $('html, body').removeClass('modal-open');
        if (location && location.length) {
          return $('head title').html("Across Mold - " + location);
        } else {
          return $('head title').html("Across Mold");
        }
      };

      AppRouter.prototype.forwardToDashboard = function() {
        return this.navigate("#/dashboard/profiles", {
          trigger: true
        });
      };

      AppRouter.prototype.showDashboard = function(tabName) {
        var setupDashboard,
          _this = this;
        setupDashboard = function() {
          var view;
          _this.cleanStage();
          $('#account-dropdown').fadeOut();
          view = new Mi.Views.DashboardMasterView({
            user: _this.currentUser,
            tab: tabName
          });
          $.extend(view, {
            getProfileCompleteness: _this.getProfileCompleteness,
            standardizeProfileFields: _this.standardizeProfileFields,
            login: _this.login
          });
          _this.swap(view);
          return _this.initPage('Dashboard');
        };
        if (Parse.User.current()) {
          return setupDashboard();
        } else {
          return this.userLogin(setupDashboard, "To view dashboard, please log in.");
        }
      };

      AppRouter.prototype.showFavorites = function() {
        return this.showDashboard('favorites');
      };

      AppRouter.prototype.showDefault = function() {
        return window.Mi.appRouter.navigate('/');
      };

      AppRouter.prototype.editCurrentUserAccount = function(event) {
        $('#account-settings-modal').remove();
        if (this.currentUser) {
          $("#account-settings-modal").remove();
          $('div.stage').append(this.accountEdit({
            user: this.currentUser.attributes
          }));
          $(".popover").hide();
          $('.modal').modal('hide');
          return $("#account-settings-modal").modal({
            backdrop: 'static',
            keyboard: false
          });
        }
      };

      AppRouter.prototype.hideModal = function(evt) {
        var targetModal;
        targetModal = $(evt.currentTarget).data("closemodal");
        console.log(targetModal);
        return $("#" + targetModal).hide();
      };

      AppRouter.prototype.showModal = function(el) {
        var targetModal;
        console.log('showModal called, el:', el);
        targetModal = $(el).data("openmodal");
        $(".popover").hide();
        $('.modal').modal('hide');
        return $("#" + targetModal).show();
      };

      return AppRouter;

    })(Support.SwappingRouter);
    return this;
  });

}).call(this);
