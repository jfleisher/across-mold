(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'select2', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.LoginLayer = (function(_super) {
      __extends(LoginLayer, _super);

      function LoginLayer() {
        _ref = LoginLayer.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      LoginLayer.prototype.template = JST['app/scripts/templates/dev/loginLayer'];

      LoginLayer.prototype.className = 'login-layer';

      LoginLayer.prototype.events = {
        'click #login': 'loginNow',
        'keyup #login-layer-pass': 'checkEnterKey'
      };

      LoginLayer.prototype.initialize = function() {
        return console.log('login layer view initialized');
      };

      LoginLayer.prototype.render = function() {
        this.$el.append(this.template());
        return this;
      };

      LoginLayer.prototype.loginNow = function() {
        console.log('login called');
        if ($("#login-layer-pass").val() === "noble") {
          return window.Mi.appRouter.navigate("/");
        } else {
          return alert("incorrect password.");
        }
      };

      LoginLayer.prototype.checkEnterKey = function() {
        console.log('key: ' + event.keyIndentifier);
        if (event.keyIdentifier === 'Enter') {
          return this.loginNow();
        }
      };

      return LoginLayer;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
