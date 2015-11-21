(function() {
  require.config({
    urlArgs: "version=v201511150610",
    paths: {
      'jquery': '../bower_components/jquery/jquery',
      'jquery-ui': '../bower_components/jquery-ui/jquery-ui',
      'autocomplete': '../bower_components/jquery-ui/autocomplete',
      'underscore': '../bower_components/underscore-amd/underscore',
      'backbone': '../bower_components/backbone-amd/backbone',
      'parse': '../bower_components/parse/parse-latest',
      'moment': '../bower_components/moment/moment',
      'modal': '../bower_components/bootstrap-sass/js/modal',
      'tooltip': '../bower_components/bootstrap-sass/js/tooltip',
      'select2': '../bower_components/select2/select2.min',
      'gmap3': '../bower_components/gmap3/dist/gmap3',
      'mandrill': '../bower_components/mandrill-api/mandrill',
      'parallax': '../bower_components/Parallax-ImageScroll/jquery.imageScroll',
      'modernizr': '../bower_components/modernizr/modernizr',
      'helpers': '../scripts/extendingUnderscore',
      'backbone-support': '../scripts/vendor/backbone-support-amd',
      'jade': '../scripts/vendor/jade-runtime',
      'cropimg': '../scripts/vendor/cropimg.jquery.min',
      'templates': '../scripts/templates',
      'site_config': '../scripts/site-config',
      'app-router': '../scripts/routers/app-router',
      'messages-router': '../scripts/routers/messages-router',
      'menu-view': '../scripts/views/menu-view',
      'profile-master-view': '../scripts/views/profile/profile-master-view',
      'profile-skill-view': '../scripts/views/profile/profile-skill-view',
      'profile-edit-view': '../scripts/views/profile/profile-edit-view',
      'profile-create-skill-view': '../scripts/views/profile/profile-create-skill-view',
      'registration-master-view': '../scripts/views/registration/registration-master-view',
      'registration-log-in-view': '../scripts/views/registration/registration-log-in-view',
      'dashboard-master-view': '../scripts/views/dashboard/dashboard-master-view',
      'dashboard-profile-view': '../scripts/views/dashboard/dashboard-profile-view',
      'dashboard-favorite-view': '../scripts/views/dashboard/dashboard-favorite-view',
      'microsite-master-view': '../scripts/views/microsite/microsite-master-view',
      'quotation-view': '../scripts/views/quotation/quotation-view',
      'primary-content': '../scripts/turbolinks_transitions',
      'search-master-view': '../scripts/views/search/search-master-view',
      'login-layer': '../scripts/loginLayer'
    },
    'helpers': {
      deps: ['site_config', 'underscore']
    },
    'templates': {
      deps: ['jade', 'site_config']
    },
    'params': {
      deps: ['underscore', 'jquery', 'backbone']
    },
    shim: {
      'select2': {
        deps: ['jquery']
      },
      'jquery': {
        exports: '$'
      },
      'jquery-ui': {
        deps: ['jquery']
      },
      'underscore': {
        exports: '_'
      },
      'backbone': {
        deps: ['underscore'],
        exports: 'Backbone'
      },
      'parse': {
        deps: ['underscore'],
        exports: 'Parse'
      },
      'backbone-support': {
        deps: ['backbone', 'underscore'],
        exports: 'Support'
      },
      'gmap3': {
        deps: ['jquery']
      },
      'modal': {
        deps: ['jquery', 'backbone']
      },
      'mandrill': {
        deps: ['jquery', 'underscore']
      }
    }
  });

  require(['site_config', 'jquery', 'underscore', 'backbone', 'backbone-support', 'app-router', 'messages-router', 'parse', 'jquery-ui', 'gmap3', 'mandrill'], function(Mi, $, _, Backbone, Support) {
    this.getStorageObject = function() {
      var err, storageObj;
      try {
        localStorage.setItem("storage", "");
        localStorage.removeItem("storage");
        storageObj = localStorage;
      } catch (_error) {
        err = _error;
        storageObj = new this.tempStorageObject();
      }
      return storageObj;
    };
    this.tempStorageObject = function() {
      var storageObj;
      storageObj = {};
      this.setItem = function(key, value) {
        return storageObj[key] = value;
      };
      this.getItem = function(key) {
        if (typeof storageObj[key] !== 'undefined') {
          return storageObjstorageObj[key];
        } else {
          return null;
        }
      };
      this.removeItem = function(key) {
        return storageObj[key] = void 0;
      };
      return this;
    };
    window.Mi.messagesRouter = new Mi.Routers.MessagesRouter();
    Parse.localStorage = this.getStorageObject();
    console.log('app init from main');
    window.Mi.appRouter = new Mi.Routers.AppRouter();
    return Backbone.history.start();
  });

}).call(this);
