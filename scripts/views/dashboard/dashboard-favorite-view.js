(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'templates'], function(Mi, Support, Parse, $) {
    var _ref;
    Mi.Views.DashboardFavoriteView = (function(_super) {
      __extends(DashboardFavoriteView, _super);

      function DashboardFavoriteView() {
        this.render = __bind(this.render, this);
        _ref = DashboardFavoriteView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DashboardFavoriteView.prototype.template = JST['app/scripts/templates/dashboard/dashboardFavoriteTemplate'];

      DashboardFavoriteView.prototype.className = 'dashboard-favorite';

      DashboardFavoriteView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      DashboardFavoriteView.prototype.initialize = function(options) {
        this.profileId = options.profileId;
        this.profileObject = options.profile;
        this.profile = options.profile.attributes;
        this.profileLikes = options.profileLikes;
        console.log('dashboard favorite view initialized');
        return this;
      };

      DashboardFavoriteView.prototype.render = function() {
        this.$el.append(this.template({
          profileId: this.profileId,
          profile: this.profile,
          profileLikes: this.profileLikes
        }));
        $('.footer-container').remove();
        $('body').append(this.footerTemplate());
        return this;
      };

      return DashboardFavoriteView;

    })(Support.CompositeView);
    return this;
  });

}).call(this);
