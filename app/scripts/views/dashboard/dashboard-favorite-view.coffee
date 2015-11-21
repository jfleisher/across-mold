define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'templates'

  ], (Mi, Support, Parse, $) ->
  class Mi.Views.DashboardFavoriteView extends Support.CompositeView
    template: JST['app/scripts/templates/dashboard/dashboardFavoriteTemplate'],
    className: 'dashboard-favorite',
    footerTemplate: JST['app/scripts/templates/footer'],

    initialize: (options)->
      @profileId = options.profileId
      @profileObject = options.profile
      @profile = options.profile.attributes
      @profileLikes = options.profileLikes
      console.log 'dashboard favorite view initialized'
      @

    render: =>
      # console.log 'rendering profile view ', @user
      @$el.append @template( profileId: @profileId, profile: @profile, profileLikes: @profileLikes)
      $('.footer-container').remove()
      $('body').append @footerTemplate()
      @

  @
