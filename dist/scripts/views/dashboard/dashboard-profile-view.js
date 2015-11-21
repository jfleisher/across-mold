(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.DashboardProfileView = (function(_super) {
      __extends(DashboardProfileView, _super);

      function DashboardProfileView() {
        this.render = __bind(this.render, this);
        _ref = DashboardProfileView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DashboardProfileView.prototype.template = JST['app/scripts/templates/dashboard/dashboardProfileViewTemplate'];

      DashboardProfileView.prototype.className = 'dashboard-profile';

      DashboardProfileView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      DashboardProfileView.prototype.initialize = function(options) {
        this.profileId = options.profileId;
        this.profileObject = options.profile;
        this.profile = options.profile.attributes;
        this.profileLikes = options.profileLikes;
        return console.log('dashboard profile view initialized');
      };

      DashboardProfileView.prototype.render = function() {
        this.$el.append(this.template({
          profileId: this.profileId,
          profile: this.profile,
          profileLikes: this.profileLikes
        }));
        $('.footer-container').remove();
        $('#footer').html(this.footerTemplate());
        return this;
      };

      return DashboardProfileView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
