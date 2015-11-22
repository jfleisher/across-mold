(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'jquery-ui', 'select2', 'templates', 'jade', 'tooltip', 'modal'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.MenuView = (function(_super) {
      __extends(MenuView, _super);

      function MenuView() {
        _ref = MenuView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      MenuView.prototype.menuTemplate = JST['app/scripts/templates/menuTemplate'];

      MenuView.prototype.accountEdit = JST['app/scripts/templates/modals/accountEdit-modal'];

      MenuView.prototype.thankyouMessage = JST['app/scripts/templates/modals/thankyou-modal'];

      MenuView.prototype.className = 'nav-content';

      MenuView.prototype.events = {
        'mouseover #account-icon': 'showDropdown',
        'mouseover #account-icon': 'dropdownControl',
        'click #submit-search': 'createSearchUrl',
        'click #submit-search-dd': 'createSearchUrl_dd',
        'click .logo': 'scrollToFx',
        'click .close-modal': 'closeModal',
        'click .open-modal': 'showModal',
        'click #edit-account': 'editCurrentUserAccount',
        'click #logout': 'logoutUser',
        'click #termslink': 'termspopup',
        'click #disable-profiles': 'disableAccount',
        'click #delete-account': 'deleteAccount',
        'click #confirm-delete .close-modal': 'cancelAcctDelete',
        'click #searchmenu': 'handleSearchMenu',
        'click #usermenu': 'handleUserMenu',
        'click #usermenuDropdown a': 'handleUserMenu',
        'click #submit-login-dd': 'handleUserMenu',
        'onresize window': 'check',
        'click #AcrossMold-logo': 'goMicrosite'
      };

      MenuView.prototype.initialize = function(options) {
        this.user = options.user;
        console.log('MenuView initialized');
        $('.fixed-navbar').html('');
        $(".fixed-navbar").append(this.el);
        this.render();
        this.initPlacesAutocomplete();
        this.initSearchAutocomplete();
        $('div.fixed-navbar').hide();
        $(window).on('resize', this.checkStageHeight);
        $(document).ready(function() {
          return $(window).trigger('resize');
        });
        return this;
      };

      MenuView.prototype.remove = function() {
        return $(window).off('resize', this.checkStageHeight);
      };

      MenuView.prototype.render = function() {
        this.$el.append(this.menuTemplate({
          user: this.user
        }));
        $('#searchmenuDropdown').slideUp(100);
        $('#usermenuDropdown').slideUp(100);
        return this;
      };

      MenuView.prototype.checkStageHeight = function() {
        var ht;
        ht = $(window).outerHeight() - $('div.fixed-navbar').outerHeight() - $('div.footer-container').outerHeight();
        $('div.stage').css('min-height', ht + 'px');
        return $('div.fixed-navbar').show();
      };

      MenuView.prototype.goMicrosite = function() {
        $(window).scrollTop(0);
        window.Mi.parallaxScrollPos = 0;
        return window.Mi.appRouter.navigate("/", {
          trigger: true
        });
      };

      MenuView.prototype.showDropdown = function(event) {
        return $("#account-dropdown").slideDown(100, function() {
          return $("#account-icon img").addClass('active-border');
        });
      };

      MenuView.prototype.hideDropdown = function() {
        return $("#account-dropdown").slideUp(100, function() {
          return $("#account-icon img").removeClass('active-border');
        });
      };

      MenuView.prototype.initSearchAutocomplete = function() {
        var finalSearchSetup, pQuery, pType,
          _this = this;
        finalSearchSetup = function(tempTerms) {
          var searchTerms;
          searchTerms = Mi.CMS.profile_types;
          _.each(Mi.CMS.profile_index, function(typeIndex) {
            var category;
            category = Mi.CMS[typeIndex];
            if (category) {
              if (category.tags) {
                tempTerms.push(category.tags);
              }
              if (category.skill_types) {
                tempTerms.push(category.skill_types);
              }
              if (category.certifications) {
                tempTerms.push(category.certifications);
              }
              if (category.attributes) {
                if (category.attributes.certification) {
                  tempTerms.push(category.attributes.certification);
                }
                if (category.attributes.certificationeducation) {
                  tempTerms.push(category.attributes.certificationeducation);
                }
              }
              if (category.organizations) {
                return tempTerms.push(category.organizations);
              }
            }
          });
          tempTerms = _.flatten(tempTerms);
          _.each(tempTerms, function(term) {
            return searchTerms.push(term.trim());
          });
          searchTerms = _.uniq(searchTerms).sort();
          $("#search-term-input-dd").autocomplete({
            appendTo: '#searchmenuDropdown',
            source: function(req, responseFn) {
              var a, matcher, re,
                _this = this;
              re = $.ui.autocomplete.escapeRegex(req.term);
              matcher = new RegExp("^" + re, "i");
              a = $.grep(searchTerms, function(item, index) {
                return matcher.test(item);
              });
              return responseFn(a.slice(0, 10));
            }
          });
          return $("#search-term-input").autocomplete({
            appendTo: '.fixed-navbar ',
            position: {
              my: "right top",
              at: "right bottom"
            },
            source: function(req, responseFn) {
              var a, matcher, re,
                _this = this;
              re = $.ui.autocomplete.escapeRegex(req.term);
              matcher = new RegExp("^" + re, "i");
              a = $.grep(searchTerms, function(item, index) {
                return matcher.test(item);
              });
              return responseFn(a.slice(0, 10));
            }
          });
        };
        pType = Parse.Object.extend("Profile");
        pQuery = new Parse.Query(pType);
        pQuery.equalTo('profilePublished', true);
        return pQuery.find({
          success: function(results) {
            var namesList,
              _this = this;
            namesList = [];
            _.each(results, function(profile) {
              if (profile.attributes.profileName) {
                return namesList.push(profile.attributes.profileName);
              }
            });
            console.log("names list for search: ", namesList.length);
            return finalSearchSetup(_.uniq(namesList));
          },
          error: function(results, err) {
            return console.log("error retrieving account email: ", err);
          }
        });
      };

      MenuView.prototype.createSearchUrl = function() {
        var location, term, url;
        window.Mi.searchResultsScrollPos = void 0;
        term = _.cleanUriComponents($("#search-term-input").val());
        location = _.cleanUriComponents($("#search-location-input").val());
        console.log('createSearchUrl called, search terms:', term, location);
        url = "#/search/q/" + term + "/" + location;
        return window.Mi.appRouter.navigate(url, {
          trigger: true,
          replace: false
        });
      };

      MenuView.prototype.createSearchUrl_dd = function() {
        var location, term, url;
        window.Mi.searchResultsScrollPos = void 0;
        term = _.cleanUriComponents($("#search-term-input-dd").val());
        location = _.cleanUriComponents($("#search-location-input-dd").val());
        this.handleSearchMenu();
        console.log('createSearchUrl_dd called, search terms:', term, location);
        url = "#/search/q/" + term + "/" + location;
        return window.Mi.appRouter.navigate(url, {
          trigger: true,
          replace: false
        });
      };

      MenuView.prototype.logoutUser = function() {
        var afterLogoutUser;
        afterLogoutUser = function() {
          $('#thankyou-message').modal('hide');
          $('#thankyou-message').remove();
          new Mi.Views.MenuView({
            user: null
          });
          return window.Mi.appRouter.navigate("microsite", {
            trigger: true,
            replace: true
          });
        };
        $('body').append(this.thankyouMessage());
        $('body').delegate('#thankyou-message', 'click', afterLogoutUser);
        Parse.User.logOut();
        this.user = null;
        window.Mi.appRouter.currentUser = null;
        $('#account-dropdown').fadeOut(100, function() {});
        $(".popover").hide();
        $('.modal').modal('hide');
        return $("#thankyou-message").modal({
          backdrop: 'static',
          keyboard: false
        });
      };

      MenuView.prototype.termspopup = function() {
        return $('#account-dropdown').fadeOut(100, function() {
          $(".popover").hide();
          return $(".terms").show();
        });
      };

      MenuView.prototype.dropdownControl = function() {
        var _this = this;
        this.showDropdown();
        console.log('dropdownControl called');
        return window.dropdownTimeout = setTimeout(function() {
          if ($("#account-dropdown").is(":hover") || $("#account-icon").is(":hover")) {
            clearTimeout(window.dropdownTimeout);
            return _this.dropdownControl();
          } else {
            return _this.hideDropdown();
          }
        }, 1000);
      };

      MenuView.prototype.scrollToFx = function() {
        var panel, scrollTarget;
        console.log('scrollToFx fired in menuview');
        panel = $('#landing-section-panel');
        if (panel.length) {
          scrollTarget = $(panel).offset().top - 40;
          return $('html,body').animate({
            scrollTop: scrollTarget
          }, 800);
        }
      };

      MenuView.prototype.initPlacesAutocomplete = function() {
        var acOptions, input, input_dd;
        acOptions = {
          types: ['(regions)']
        };
        input = document.getElementById("search-location-input");
        return input_dd = document.getElementById("search-location-input-dd");
      };

      MenuView.prototype.closeModal = function(event) {
        var modalname;
        modalname = $(event.target).data('closemodal');
        return $('#' + modalname).modal('hide');
      };

      MenuView.prototype.showModal = function(event) {
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

      MenuView.prototype.editCurrentUserAccount = function(event) {
        var saveAcct, user;
        MenuView.prototype.removeAccountEdit();
        this.hideDropdown();
        if (this.user) {
          $('#wrap').append(this.accountEdit({
            user: this.user.attributes
          }));
          $(".popover").hide();
          $('.modal').modal('hide');
          $('html, body').animate({
            scrollTop: $('#account-settings-modal').offset().top - 100
          });
          user = this.user;
          saveAcct = this.saveAccountSettings;
          $(document).delegate('.close-modal', 'click', this.closeModal);
          $(document).delegate('#save-account-settings', 'click', function() {
            return saveAcct(user);
          });
          $(document).delegate('#delete-account', 'click', this.confirmAccountDelete);
          $(document).delegate('#disable-profiles', 'click', MenuView.prototype.disableAccount);
          $(document).delegate('#delete-account-confirmed', 'click', MenuView.prototype.deleteAccount);
          $(document).delegate('#confirm-delete-modal .close-modal', 'click', MenuView.prototype.closeModal);
          return $("#account-settings-modal").modal({
            backdrop: 'static',
            keyboard: false
          });
        }
      };

      MenuView.prototype.removeAccountEdit = function() {
        $('#account-settings-modal').remove();
        $('#confirm-delete-modal').remove();
        $(document).undelegate('.close-modal', 'click', this.closeModal);
        $(document).undelegate('#save-account-settings', 'click', function() {
          return saveAcct(user);
        });
        $(document).undelegate('#delete-account', 'click', this.confirmAccountDelete);
        $(document).undelegate('#disable-profiles', 'click', MenuView.prototype.disableAccount);
        $(document).undelegate('#delete-account-confirmed', 'click', MenuView.prototype.deleteAccount);
        return $(document).undelegate('#confirm-delete-modal .close-modal', 'click', MenuView.prototype.closeModal);
      };

      MenuView.prototype.saveAccountSettings = function(user) {
        var confirmPwd, emailOk, newEmail, newPwd, validateEmail;
        validateEmail = function(eAddr) {
          if (!eAddr) {
            return false;
          }
          if (eAddr.length < 4) {
            return false;
          }
          return true;
        };
        user.set('firstName', $('#acntfirst').val());
        user.set('lastName', $('#acntlast').val());
        newPwd = $('#acct-new-password').val();
        confirmPwd = $('#acct-confirm-password').val();
        newEmail = $('#acntemail').val().toLowerCase();
        emailOk = validateEmail(newEmail);
        if (emailOk) {
          user.set('username', newEmail);
          user.set('email', newEmail);
          user.setEmail(newEmail);
        } else {
          alert('Invalid Email');
          return;
        }
        if (!newPwd || !newPwd.length || newPwd === confirmPwd) {
          if (newPwd && newPwd.length) {
            user.set('password', newPwd);
          }
          user.save(null, {
            success: function(result) {
              $('.dashboard-name').text('Hello, ' + result.get('firstName'));
              $('#account-settings-modal').modal('hide');
              return console.log('account settings saved');
            },
            error: function(result) {
              window.Mi.messagesRouter.showMessage("Failed to update account: " + result);
              return console.log('failed to save account settings. error: ', result);
            }
          });
        }
        if (newPwd !== confirmPwd) {
          $('#acct-new-password').val('');
          $('#acct-confirm-password').val('');
          return window.Mi.messagesRouter.showMessage("Passwords do not match. Please re-enter.");
        }
      };

      MenuView.prototype.confirmAccountDelete = function() {
        $('#account-settings-modal').modal('hide');
        return $('#confirm-delete-modal').modal({
          backdrop: 'static',
          keyboard: false
        });
      };

      MenuView.prototype.disableAccount = function() {
        var pType, query, user, username,
          _this = this;
        user = Parse.User.current();
        username = user.get('username');
        console.log('disableAccount: ' + user.username);
        $('#confirm-delete-modal').modal('hide');
        pType = Parse.Object.extend({
          className: "Profile"
        });
        query = new Parse.Query(pType);
        query.equalTo("parent", user);
        return query.find({
          success: function(results) {
            console.log(results.length, ' profiles to disable for user ' + username);
            _.each(results, function(profile) {
              profile.set('profilePublished', false);
              return profile.save(null);
            });
            return window.Mi.appRouter.navigate("#/dashboard", {
              trigger: true
            });
          },
          error: function(error) {
            return console.log('Error disabling profiles for user ' + username + ': ' + error);
          }
        });
      };

      MenuView.prototype.deleteAccount = function() {
        var pType, query, user, username,
          _this = this;
        user = Parse.User.current();
        username = user.get('username');
        console.log('disableAccount: ' + user.username);
        $('#confirm-delete-modal').modal('hide');
        pType = Parse.Object.extend({
          className: "Profile"
        });
        query = new Parse.Query(pType);
        query.equalTo("parent", user);
        return query.find({
          success: function(results) {
            console.log(results.length, ' profiles to delete for user ' + username);
            _.each(results, function(profile) {
              return profile.destroy();
            });
            console.log('Delete user: ' + username);
            user.destroy();
            return Mi.Views.MenuView.prototype.logoutUser();
          },
          error: function(error) {
            return console.log('Error deleting account for user ' + username + ': ' + error);
          }
        });
      };

      MenuView.prototype.handleSearchMenu = function() {
        $('#usermenu').removeClass('depressed');
        $('#usermenuDropdown').slideUp(100);
        if ($('#searchmenu').hasClass('depressed')) {
          $('#searchmenuDropdown').slideUp(100);
          $('#searchmenu').removeClass('depressed');
        } else {
          $('#searchmenu').addClass('depressed');
          $('#searchmenuDropdown').slideDown(100, function() {
            return $('#search-term-input-dd:visible').focus();
          });
        }
        return this;
      };

      MenuView.prototype.handleUserMenu = function(ev) {
        $('#searchmenu').removeClass('depressed');
        $('#searchmenuDropdown').slideUp(100);
        if (Parse.User.current()) {
          $('#usermenuDropdown').addClass('logged-in');
        } else {
          $('#usermenuDropdown').removeClass('logged-in');
        }
        if ($('#usermenu').hasClass('depressed')) {
          $('#usermenuDropdown').slideUp(100);
          return $('#usermenu').removeClass('depressed');
        } else {
          $('#usermenu').addClass('depressed');
          return $('#usermenuDropdown').slideDown(100, function() {
            return $('#login-email-dd:visible').focus();
          });
        }
      };

      return MenuView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
