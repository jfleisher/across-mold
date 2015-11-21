define [
  'site_config'
  'backbone-support'
  'parse'
  'jquery'
  'templates'

  ], (Mi, Support, Parse, $) ->
  class Mi.Views.DashboardProfileView extends Support.CompositeView
    template: JST['app/scripts/templates/dashboard/dashboardProfileViewTemplate'],
    className: 'dashboard-profile',
    footerTemplate: JST['app/scripts/templates/footer'],

    initialize: (options)->
      @profileId = options.profileId
      @profileObject = options.profile
      @profile = options.profile.attributes
      @profileLikes = options.profileLikes
      console.log 'dashboard profile view initialized'

    render: =>
      # console.log 'rendering profile view ', @user
      @$el.append @template( profileId: @profileId, profile: @profile, profileLikes: @profileLikes)
      $('.footer-container').remove()
      $('#footer').html @footerTemplate()
      @


  @
