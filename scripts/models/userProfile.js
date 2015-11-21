(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone', 'parse'], function(Mi, Backbone, Parse) {
    var _ref;
    Mi.Models.UserProfile = (function(_super) {
      __extends(UserProfile, _super);

      function UserProfile() {
        _ref = UserProfile.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      UserProfile.prototype.initialize = function() {
        return console.log('new user profile created');
      };

      UserProfile.prototype.getProfileCompleteness = function() {
        var completeness, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        completeness = 0;
        console.log('getProfileCompleteness called, profile to check:', profileId);
        if (location) {
          completeness += 5;
        }
        if (tags.length) {
          completeness += 10;
        }
        if (profileFeatures) {
          completeness += 10;
        }
        if (profilePictureUrl) {
          completeness += 10;
        }
        if (organizations.length) {
          completeness += 5;
        }
        if (typeof skills !== "undefined" && skills !== null ? (_ref1 = skills[0]) != null ? _ref1.skillHealinePhotoUrl : void 0 : void 0) {
          completeness += 20;
        }
        if (typeof skills !== "undefined" && skills !== null ? (_ref2 = skills[0]) != null ? _ref2.skillSummary : void 0 : void 0) {
          completeness += 20;
        }
        if (typeof skills !== "undefined" && skills !== null ? (_ref3 = skills[0]) != null ? (_ref4 = _ref3.skillAudio) != null ? _ref4.soundcloud : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        if (typeof skills !== "undefined" && skills !== null ? (_ref5 = skills[0]) != null ? (_ref6 = _ref5.skillDocuments) != null ? _ref6.length : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        if (typeof skills !== "undefined" && skills !== null ? (_ref7 = skills[0]) != null ? (_ref8 = _ref7.skillVideo) != null ? _ref8.length : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        if (typeof skills !== "undefined" && skills !== null ? (_ref9 = skills[0]) != null ? (_ref10 = _ref9.skillPhotos) != null ? _ref10.length : void 0 : void 0 : void 0) {
          completeness += 5;
        }
        return completeness;
      };

      return UserProfile;

    })(Parse.Object);
    return this;
  });

}).call(this);
