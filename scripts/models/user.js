(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone', 'parse'], function(Mi, Backbone, Parse) {
    var _ref;
    Mi.Models.User = (function(_super) {
      __extends(User, _super);

      function User() {
        _ref = User.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      User.prototype.initialize = function() {
        this.profiles = new Parse.Collection;
        return console.log('new user created');
      };

      User.prototype.getProfileCompleteness = function(profile) {
        var completeness, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        completeness = 0;
        console.log('getProfileCompleteness called, profile to check:', profile);
        if (profile != null ? profile.location : void 0) {
          completeness += 5;
        }
        if (profile != null ? profile.tags.length : void 0) {
          completeness += 10;
        }
        if (profile != null ? profile.profileFeatures : void 0) {
          completeness += 10;
        }
        if (profile != null ? profile.profilePictureUrl : void 0) {
          completeness += 10;
        }
        if (profile != null ? profile.organizations.length : void 0) {
          completeness += 5;
        }
        if (profile != null ? (_ref1 = profile.skills) != null ? (_ref2 = _ref1[0]) != null ? _ref2.skillHealinePhotoUrl : void 0 : void 0 : void 0) {
          completeness += 20;
        }
        if (profile != null ? (_ref3 = profile.skills) != null ? (_ref4 = _ref3[0]) != null ? _ref4.skillSummary : void 0 : void 0 : void 0) {
          completeness += 20;
        }
        if (profile != null ? (_ref5 = profile.skills) != null ? (_ref6 = _ref5[0]) != null ? (_ref7 = _ref6.skillAudio) != null ? _ref7.soundcloud : void 0 : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        if (profile != null ? (_ref8 = profile.skills) != null ? (_ref9 = _ref8[0]) != null ? (_ref10 = _ref9.skillDocuments) != null ? _ref10.length : void 0 : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        if (profile != null ? (_ref11 = profile.skills) != null ? (_ref12 = _ref11[0]) != null ? (_ref13 = _ref12.skillVideo) != null ? _ref13.length : void 0 : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        if (profile != null ? (_ref14 = profile.skills) != null ? (_ref15 = _ref14[0]) != null ? (_ref16 = _ref15.skillPhotos) != null ? _ref16.length : void 0 : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        return completeness;
      };

      return User;

    })(Parse.User);
    return this;
  });

}).call(this);
