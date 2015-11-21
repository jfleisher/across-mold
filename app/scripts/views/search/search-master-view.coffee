define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'select2'
  'tooltip'
  'modal'
  'templates'
  'gmap3'

  #'user-model'
  #'user-profile-model'
], (Mi, Support, Parse, $) ->
  class Mi.Views.SearchMasterView extends Support.CompositeView
    masterTemplate: JST['app/scripts/templates/search/masterSearchTemplate'],
    resultTemplate: JST['app/scripts/templates/search/searchResultTemplate'],
    footerTemplate: JST['app/scripts/templates/footer'],

    className: 'search-master wrapper',

    events:
      'click input.viewProfile'             : "viewProfile"
      'click div.profile-image-container'   : "viewProfile"

    initialize: ( options ) =>
      if !@user then @user = Parse.User.current()
      $(".upper-bkgd").css('height', '')
    # backbone automatically decodes the URI components...cool
      @searchTerm = options.term
      @searchLocation = options.location

      @$el.append @masterTemplate( searchTerm:@searchTerm, searchLocation: @searchLocation )
      @initSearch()




    render: ->
      $('.footer-container').remove()
      @

    initSearch: ->
      console.log 'term and location to search for: ', @searchTerm, " " ,@searchLocation

      if @searchLocation
        @searchWithLocation(@searchTerm, @searchLocation)
      else
        @searchWithoutLocation(@searchTerm)

    searchWithLocation: (searchTerm, searchLocation) ->
      sm = @
      if !sm.geocoder
        sm.geocoder = new google.maps.Geocoder();
      searchLat = null
      searchLng = null
      sm.geocoder.geocode address: searchLocation,
        (results, status) =>
          if status.toLowerCase() == 'ok'
            pType = Parse.Object.extend("Profile")
            searchQuery = new Parse.Query(pType)
            searchQuery.equalTo('profilePublished', true)
            if searchTerm
              searchQuery.containsAll("searchValues", [searchTerm.toString().toLowerCase()])

            searchGeometry = results[0]['geometry']
            addrComponents = results[0]['address_components']
            if searchGeometry['location_type'] == 'APPROXIMATE'
              searchBounds = searchGeometry['bounds']
              if ["administrative_area_level_2","locality"].indexOf(addrComponents[0].types[0]) > -1
                searchLat = searchBounds.getCenter().lat()
                searchLng = searchBounds.getCenter().lng()
                if searchLat && searchLng
                  geoPoint = new Parse.GeoPoint(searchLat, searchLng)
                  searchQuery.withinMiles('geoLocation', geoPoint, 50)
              else if addrComponents[0].types[0] == 'country' && addrComponents[0].long_name == 'United States'
                searchQuery.endsWith('location','United States')
              else
                sw = searchBounds.getSouthWest()
                nw = searchBounds.getNorthEast()
                if sw && nw
                  swPt = new Parse.GeoPoint( sw.lat(), sw.lng())
                  nwPt = new Parse.GeoPoint( nw.lat(), nw.lng())
                  searchQuery.withinGeoBox('geoLocation', swPt, nwPt)
            else if searchGeometry['location_type'] == 'ROOFTOP'
              isApproximate = false
              searchLat = searchGeometry['location'].lat()
              searchLng = searchGeometry['location'].lng()
              if searchLat && searchLng
                geoPoint = new Parse.GeoPoint(searchLat, searchLng)
                searchQuery.withinMiles('geoLocation', geoPoint, 0.5)
            else
              searchLat = searchGeometry['location'].lat()
              searchLng = searchGeometry['location'].lng()
              if searchLat && searchLng
                geoPoint = new Parse.GeoPoint(searchLat, searchLng)
                searchQuery.withinMiles('geoLocation', geoPoint, 50)

            promises = []
            promises.push(searchQuery.find())

            likes = Parse.Object.extend("Profile_likes")
            likeQuery = new Parse.Query(likes)
            likeQuery.matchesQuery('parent',searchQuery)
            promises.push(likeQuery.find())

            Parse.Promise.when(promises).then (allProfiles, allLikes) =>
              _.each allProfiles, (profile) ->
                profile.likes=0
                _.each allLikes, (like)->
                  if like.get('parent').id == profile.id
                    profile.likes = like.get('likes')

              if allProfiles && allProfiles.length == 1
                $('#search-result-status').text("1 profile match found")
              else
                $('#search-result-status').text(allProfiles.length + " profile matches found")
              container = sm.$el
              resultTemplate = sm.resultTemplate

              compareLikes = (a,b) ->
                if a.likes < b.likes
                  return 1
                if a.likes > b.likes
                  return -1
                return 0

              allProfiles.sort(compareLikes)

              $(window).scrollTop(0)
              _.each allProfiles, (profile) ->
                container.find(".search-results").append resultTemplate(profile: profile.attributes, profileId: profile.id, profileLikes: profile.likes)
              $('#footer').html sm.footerTemplate()
          else
            sm.searchWithoutLocation()


    searchWithoutLocation: (searchTerm) ->
      sm = @
      pType = Parse.Object.extend("Profile")
      searchQuery = new Parse.Query(pType)
      searchQuery.equalTo('profilePublished', true)
      if searchTerm
        searchQuery.containsAll("searchValues", [searchTerm.toString().toLowerCase()])

      promises = []
      promises.push(searchQuery.find())

      likes = Parse.Object.extend("Profile_likes")
      likeQuery = new Parse.Query(likes)
      likeQuery.matchesQuery('parent',searchQuery)
      promises.push(likeQuery.find())

      Parse.Promise.when(promises).then (allProfiles, allLikes) =>
        _.each allProfiles, (profile) ->
          profile.likes=0
          _.each allLikes, (like)->
            if like.get('parent').id == profile.id
              profile.likes = like.get('likes')

        if allProfiles && allProfiles.length == 1
          $('#search-result-status').text("1 profile match found")
        else
          $('#search-result-status').text(allProfiles.length + " profile matches found")
        container = sm.$el
        resultTemplate = sm.resultTemplate

        compareLikes = (a,b) ->
          if a.likes < b.likes
            return 1
          if a.likes > b.likes
            return -1
          return 0

        allProfiles.sort(compareLikes)

        i=0
        setScroll = () ->
          if i==allProfiles.length && window.Mi.searchResultsScrollPos
            $(window).scrollTop(1)
            $(window).scrollTop(0)
            $('body').scrollTop(window.Mi.searchResultsScrollPos)

        _.each allProfiles, (profile) ->
          i++
          container.find(".search-results").append resultTemplate(profile: profile.attributes, profileId: profile.id, profileLikes: profile.likes)
          setTimeout( setScroll, 0)

        $('#footer').html sm.footerTemplate()


    viewProfile: (event)->
      window.Mi.searchResultsScrollPos = $(window).scrollTop()
      target = event.target
      profileId = $(target).data('profileid')
      showProfile = () ->
        $(window).scrollTop(0)
        Mi.Routers.AppRouter.prototype.navigate('#/display-profile/' + profileId, true)

      showProfile()
