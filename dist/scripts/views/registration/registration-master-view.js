(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'select2', 'modal', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    return Mi.Views.RegistrationMasterView = (function(_super) {
      __extends(RegistrationMasterView, _super);

      function RegistrationMasterView() {
        this.createNewProfile = __bind(this.createNewProfile, this);
        this.createUserOnParse = __bind(this.createUserOnParse, this);
        _ref = RegistrationMasterView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      RegistrationMasterView.prototype.signUpTemplate = JST['app/scripts/templates/registration/registrationSignUpTemplate'];

      RegistrationMasterView.prototype.uploadUserPhotoTemplate = JST['app/scripts/templates/registration/registrationUploadUserPhotoTemplate'];

      RegistrationMasterView.prototype.chooseProfileTemplate = JST['app/scripts/templates/registration/registrationChooseProfileTemplate'];

      RegistrationMasterView.prototype.confirmMobileTemplate = JST['app/scripts/templates/registration/registrationConfirmMobileTemplate'];

      RegistrationMasterView.prototype.className = 'registration-master wrapper';

      RegistrationMasterView.prototype.events = {
        'click .profile-button': 'toggleActiveProfile',
        'click #submit-registration-1': 'createNewUser',
        'click #submit-registration-2': 'uploadImage',
        'click #submit-registration-3': 'createNewProfile',
        'change #imgUpload': 'grabImage',
        'click #submit-login': 'userLogin',
        'focusout .dob-input': 'verifyAge',
        'click #start-search': 'startMobileSearch'
      };

      RegistrationMasterView.prototype.initialize = function() {
        return console.log('RegistrationView initialized');
      };

      RegistrationMasterView.prototype.render = function() {
        var _this = this;
        this.$el.append(this.signUpTemplate());
        setTimeout(function() {
          return _this.appendCheckbox();
        }, 1000);
        return this;
      };

      RegistrationMasterView.prototype.startMobileSearch = function() {
        this.mobileMenu.handleSearchMenu();
        return $('#registration-confirm-mobile').remove();
      };

      RegistrationMasterView.prototype.appendCheckbox = function() {
        return $(".terms-of-service").html("<input type='checkbox' name='verifyCheckbox' id='verifyCheckbox' /><span class='terms-text'>I agree to the <a href='#/microsite/terms' target='makeitglobalterms'>Terms &amp; Agreement</a></span>");
      };

      RegistrationMasterView.prototype.verifyAge = function() {
        var ageInSecs, eighteenInSecs, inputAge, splitAge;
        console.log('verifyAge called');
        inputAge = $(".dob-input").val();
        splitAge = inputAge.split("/");
        eighteenInSecs = 567648000;
        ageInSecs = (new Date().getTime() - new Date(inputAge).getTime()) / 1000;
        console.log('age in seconds', ageInSecs);
        if (splitAge.length < 3) {
          console.log('invalid date');
        }
        if (ageInSecs > eighteenInSecs) {
          $(".underage-warning").hide();
          return console.log('over 18!');
        } else {
          $(".underage-warning").show();
          return console.log('under 18!');
        }
      };

      RegistrationMasterView.prototype.registrationStepTwo = function() {
        this.chosenProfileType = '_3d_printing';
        this.$el.html('');
        this.$el.append(this.chooseProfileTemplate({
          Mi: Mi
        }));
        return new Mi.Views.MenuView({
          user: Parse.User.current()
        });
      };

      RegistrationMasterView.prototype.toggleActiveProfile = function(event) {
        var targetedProfile;
        $(".profile-button").removeClass("selected-profile");
        $(event.target).addClass("selected-profile");
        $(".profile-selection-desc").hide();
        targetedProfile = $(event.target).data("profiletype");
        $("#" + targetedProfile + "-desc").show();
        return this.chosenProfileType = $(event.target).data("profiletype");
      };

      RegistrationMasterView.prototype.validEmail = function(email) {
        var domainParts, parts;
        parts = email.split('@');
        if (parts.length !== 2) {
          return false;
        }
        if (!parts[0] || parts[0].length === 0) {
          return false;
        }
        if (!parts[1] || parts[1].length === 0) {
          return false;
        }
        domainParts = parts[1].split('.');
        if (domainParts.length !== 2) {
          return false;
        }
        return true;
      };

      RegistrationMasterView.prototype.createNewUser = function() {
        var acctEmail, parentEmail;
        acctEmail = $(".email-input").val().toLowerCase();
        if (!this.validEmail(acctEmail)) {
          window.Mi.messagesRouter.showMessage('Account email is not valid');
          return;
        }
        if ($('input.parent-email:visible').length) {
          parentEmail = $('input.parent-email').val().toLowerCase();
          if (parentEmail.toUpperCase() === acctEmail.toUpperCase()) {
            window.Mi.messagesRouter.showMessage('Email addresses must be different.');
            return;
          }
          if (!this.validEmail(parentEmail)) {
            window.Mi.messagesRouter.showMessage('Parent or guardian email is not valid.');
            return;
          }
        }
        if (parentEmail) {
          window.Mi.messagesRouter.sendUnder18Email(parentEmail, parentEmail);
        }
        return this.createUserOnParse();
      };

      RegistrationMasterView.prototype.minorSignupSubject = "Courtesy notification: across-mold.com account created";

      RegistrationMasterView.prototype.minorSignupMessage = function() {
        return "This message is notification that and account was created on across-mold.com for the email " + email + ". During registration the user indicated that they are below the age of 18. Your email address was provided as contact information for parent or guardian. Please contact support@across-mold.com if you have any questions.";
      };

      RegistrationMasterView.prototype.createUserOnParse = function() {
        var _this = this;
        this.user = new Parse.User();
        this.user.set("firstName", $(".first-name-input").val());
        this.user.set("lastName", $(".last-name-input").val());
        this.user.set("name", $(".first-name-input").val() + " " + $(".last-name-input").val());
        this.user.set("email", $(".email-input").val().toLowerCase());
        this.user.set("parentEmail", $(".parent-email").val().toLowerCase());
        this.user.set("username", $(".email-input").val().toLowerCase());
        this.user.set("password", $(".password-input").val());
        this.user.set("dob", $(".dob-input").val());
        console.log('clicked', this.user);
        return this.user.signUp(null, {
          success: function(user) {
            console.log('new user created');
            if (window.Mi.appRouter.isMobile) {
              _this.confirmMobileSignup();
            } else {
              _this.registrationStepTwo();
            }
            return _this.sendWelcomeEmail(user.attributes);
          },
          error: function(user, error) {
            window.Mi.messagesRouter.showMessage("Unable to create login: " + error.message);
            console.log('user creation failed');
            return console.log('error: ', error);
          }
        });
      };

      RegistrationMasterView.prototype.confirmMobileSignup = function() {
        var pType, userProfile;
        pType = Parse.Object.extend({
          className: "Profile"
        });
        userProfile = new pType;
        this.initProfileFields(userProfile);
        console.log('mobile signup profile created');
        userProfile.save();
        this.$el.html('');
        this.$el.append(this.confirmMobileTemplate());
        return this.mobileMenu = new Mi.Views.MenuView({
          user: Parse.User.current()
        });
      };

      RegistrationMasterView.prototype.sendWelcomeEmail = function(user) {
        return window.Mi.messagesRouter.sendSignupEmail(user.name, user.email);
      };

      RegistrationMasterView.prototype.initProfileFields = function(profile) {
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

      RegistrationMasterView.prototype.createNewProfile = function() {
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

      RegistrationMasterView.prototype.userLogin = function() {
        var pass, username;
        console.log('login attempted');
        username = $("#login-email").val().toLowerCase();
        pass = $("#login-password").val();
        return Parse.User.logIn(username, pass, {
          success: function(user) {
            return console.log('login successful');
          },
          error: function(user, error) {
            return console.log('login failed. error: ', error);
          }
        });
      };

      return RegistrationMasterView;

    })(Support.CompositeView);
  });

}).call(this);
