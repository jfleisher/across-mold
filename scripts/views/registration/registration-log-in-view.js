(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'modal', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    return Mi.Views.RegistrationLogInView = (function(_super) {
      __extends(RegistrationLogInView, _super);

      function RegistrationLogInView() {
        _ref = RegistrationLogInView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      RegistrationLogInView.prototype.template = JST['app/scripts/templates/registration/registrationLogInTemplate'];

      RegistrationLogInView.prototype.className = 'registration-login';

      RegistrationLogInView.prototype.events = {
        'click #submit-login': 'userLogin'
      };

      RegistrationLogInView.prototype.initialize = function() {
        return console.log('Registration log in View initialized');
      };

      RegistrationLogInView.prototype.render = function() {
        this.$el.append(this.template);
        return this;
      };

      RegistrationLogInView.prototype.userLogin = function() {
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

      return RegistrationLogInView;

    })(Support.CompositeView);
  });

}).call(this);
