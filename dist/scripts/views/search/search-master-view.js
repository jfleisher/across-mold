(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['site_config', 'backbone-support', 'parse', 'jquery', 'select2', 'tooltip', 'modal', 'templates', 'gmap3'], function(Mi, Support, Parse, $) {
    var _ref;
    return Mi.Views.SearchMasterView = (function(_super) {
      __extends(SearchMasterView, _super);

      function SearchMasterView() {
        this.initialize = __bind(this.initialize, this);
        _ref = SearchMasterView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SearchMasterView.prototype.masterTemplate = JST['app/scripts/templates/search/masterSearchTemplate'];

      SearchMasterView.prototype.resultTemplate = JST['app/scripts/templates/search/searchResultTemplate'];

      SearchMasterView.prototype.footerTemplate = JST['app/scripts/templates/footer'];

      SearchMasterView.prototype.className = 'search-master wrapper';

      SearchMasterView.prototype.events = {
        'click input.viewProfile': "viewProfile",
        'click div.profile-image-container': "viewProfile"
      };

      SearchMasterView.prototype.initialize = function(options) {
        if (!this.user) {
          this.user = Parse.User.current();
        }
        $(".upper-bkgd").css('height', '');
        this.searchTerm = options.term;
        this.searchLocation = options.location;
        this.$el.append(this.masterTemplate({
          searchTerm: this.searchTerm,
          searchLocation: this.searchLocation
        }));
        return this.initSearch();
      };

      SearchMasterView.prototype.render = function() {
        $('.footer-container').remove();
        return this;
      };

      SearchMasterView.prototype.initSearch = function() {
        console.log('term and location to search for: ', this.searchTerm, " ", this.searchLocation);
        if (this.searchLocation) {
          return this.searchWithLocation(this.searchTerm, this.searchLocation);
        } else {
          return this.searchWithoutLocation(this.searchTerm);
        }
      };

      SearchMasterView.prototype.searchWithLocation = function(searchTerm, searchLocation) {
        var searchLat, searchLng, sm,
          _this = this;
        sm = this;
        if (!sm.geocoder) {
          sm.geocoder = new google.maps.Geocoder();
        }
        searchLat = null;
        searchLng = null;
        return sm.geocoder.geocode({
          address: searchLocation
        }, function(results, status) {
          var addrComponents, geoPoint, isApproximate, likeQuery, likes, nw, nwPt, pType, promises, searchBounds, searchGeometry, searchQuery, sw, swPt;
          if (status.toLowerCase() === 'ok') {
            pType = Parse.Object.extend("Profile");
            searchQuery = new Parse.Query(pType);
            searchQuery.equalTo('profilePublished', true);
            if (searchTerm) {
              searchQuery.containsAll("searchValues", [searchTerm.toString().toLowerCase()]);
            }
            searchGeometry = results[0]['geometry'];
            addrComponents = results[0]['address_components'];
            if (searchGeometry['location_type'] === 'APPROXIMATE') {
              searchBounds = searchGeometry['bounds'];
              if (["administrative_area_level_2", "locality"].indexOf(addrComponents[0].types[0]) > -1) {
                searchLat = searchBounds.getCenter().lat();
                searchLng = searchBounds.getCenter().lng();
                if (searchLat && searchLng) {
                  geoPoint = new Parse.GeoPoint(searchLat, searchLng);
                  searchQuery.withinMiles('geoLocation', geoPoint, 50);
                }
              } else if (addrComponents[0].types[0] === 'country' && addrComponents[0].long_name === 'United States') {
                searchQuery.endsWith('location', 'United States');
              } else {
                sw = searchBounds.getSouthWest();
                nw = searchBounds.getNorthEast();
                if (sw && nw) {
                  swPt = new Parse.GeoPoint(sw.lat(), sw.lng());
                  nwPt = new Parse.GeoPoint(nw.lat(), nw.lng());
                  searchQuery.withinGeoBox('geoLocation', swPt, nwPt);
                }
              }
            } else if (searchGeometry['location_type'] === 'ROOFTOP') {
              isApproximate = false;
              searchLat = searchGeometry['location'].lat();
              searchLng = searchGeometry['location'].lng();
              if (searchLat && searchLng) {
                geoPoint = new Parse.GeoPoint(searchLat, searchLng);
                searchQuery.withinMiles('geoLocation', geoPoint, 0.5);
              }
            } else {
              searchLat = searchGeometry['location'].lat();
              searchLng = searchGeometry['location'].lng();
              if (searchLat && searchLng) {
                geoPoint = new Parse.GeoPoint(searchLat, searchLng);
                searchQuery.withinMiles('geoLocation', geoPoint, 50);
              }
            }
            promises = [];
            promises.push(searchQuery.find());
            likes = Parse.Object.extend("Profile_likes");
            likeQuery = new Parse.Query(likes);
            likeQuery.matchesQuery('parent', searchQuery);
            promises.push(likeQuery.find());
            return Parse.Promise.when(promises).then(function(allProfiles, allLikes) {
              var compareLikes, container, resultTemplate;
              _.each(allProfiles, function(profile) {
                profile.likes = 0;
                return _.each(allLikes, function(like) {
                  if (like.get('parent').id === profile.id) {
                    return profile.likes = like.get('likes');
                  }
                });
              });
              if (allProfiles && allProfiles.length === 1) {
                $('#search-result-status').text("1 profile match found");
              } else {
                $('#search-result-status').text(allProfiles.length + " profile matches found");
              }
              container = sm.$el;
              resultTemplate = sm.resultTemplate;
              compareLikes = function(a, b) {
                if (a.likes < b.likes) {
                  return 1;
                }
                if (a.likes > b.likes) {
                  return -1;
                }
                return 0;
              };
              allProfiles.sort(compareLikes);
              $(window).scrollTop(0);
              _.each(allProfiles, function(profile) {
                return container.find(".search-results").append(resultTemplate({
                  profile: profile.attributes,
                  profileId: profile.id,
                  profileLikes: profile.likes
                }));
              });
              return $('#footer').html(sm.footerTemplate());
            });
          } else {
            return sm.searchWithoutLocation();
          }
        });
      };

      SearchMasterView.prototype.searchWithoutLocation = function(searchTerm) {
        var likeQuery, likes, pType, promises, searchQuery, sm,
          _this = this;
        sm = this;
        pType = Parse.Object.extend("Profile");
        searchQuery = new Parse.Query(pType);
        searchQuery.equalTo('profilePublished', true);
        if (searchTerm) {
          searchQuery.containsAll("searchValues", [searchTerm.toString().toLowerCase()]);
        }
        promises = [];
        promises.push(searchQuery.find());
        likes = Parse.Object.extend("Profile_likes");
        likeQuery = new Parse.Query(likes);
        likeQuery.matchesQuery('parent', searchQuery);
        promises.push(likeQuery.find());
        return Parse.Promise.when(promises).then(function(allProfiles, allLikes) {
          var compareLikes, container, i, resultTemplate, setScroll;
          _.each(allProfiles, function(profile) {
            profile.likes = 0;
            return _.each(allLikes, function(like) {
              if (like.get('parent').id === profile.id) {
                return profile.likes = like.get('likes');
              }
            });
          });
          if (allProfiles && allProfiles.length === 1) {
            $('#search-result-status').text("1 profile match found");
          } else {
            $('#search-result-status').text(allProfiles.length + " profile matches found");
          }
          container = sm.$el;
          resultTemplate = sm.resultTemplate;
          compareLikes = function(a, b) {
            if (a.likes < b.likes) {
              return 1;
            }
            if (a.likes > b.likes) {
              return -1;
            }
            return 0;
          };
          allProfiles.sort(compareLikes);
          i = 0;
          setScroll = function() {
            if (i === allProfiles.length && window.Mi.searchResultsScrollPos) {
              $(window).scrollTop(1);
              $(window).scrollTop(0);
              return $('body').scrollTop(window.Mi.searchResultsScrollPos);
            }
          };
          _.each(allProfiles, function(profile) {
            i++;
            container.find(".search-results").append(resultTemplate({
              profile: profile.attributes,
              profileId: profile.id,
              profileLikes: profile.likes
            }));
            return setTimeout(setScroll, 0);
          });
          return $('#footer').html(sm.footerTemplate());
        });
      };

      SearchMasterView.prototype.viewProfile = function(event) {
        var profileId, showProfile, target;
        window.Mi.searchResultsScrollPos = $(window).scrollTop();
        target = event.target;
        profileId = $(target).data('profileid');
        showProfile = function() {
          $(window).scrollTop(0);
          return Mi.Routers.AppRouter.prototype.navigate('#/display-profile/' + profileId, true);
        };
        return showProfile();
      };

      return SearchMasterView;

    })(Support.CompositeView);
  });

}).call(this);
