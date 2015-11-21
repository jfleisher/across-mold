define [
  'site_config'
  'backbone'
  'parse'

  ], (Mi, Backbone, Parse) ->
  class Mi.Models.User extends Parse.User
    initialize: ->
      this.profiles = new Parse.Collection
      console.log 'new user created'

    getProfileCompleteness: (profile)->
      completeness = 0
      console.log 'getProfileCompleteness called, profile to check:', profile

      if profile?.location then completeness += 5
      if profile?.tags.length then completeness += 10
      if profile?.profileFeatures then completeness += 10
      if profile?.profilePictureUrl then completeness += 10
      if profile?.organizations.length then completeness += 5

      if profile?.skills?[0]?.skillHealinePhotoUrl then completeness += 20
      if profile?.skills?[0]?.skillSummary then completeness += 20
      if profile?.skills?[0]?.skillAudio?.soundcloud then completeness += 5
      if profile?.skills?[0]?.skillDocuments?.length then completeness += 5
      if profile?.skills?[0]?.skillVideo?.length then completeness += 5
      if profile?.skills?[0]?.skillPhotos?.length then completeness += 5

      # completenessValues =
      #   location: 5
      #   profilePhictureUrl: 10
      #   organizations: 5
      #   tags: 10
      #   profileFeatures: 10
      #   skillheadlinePhotoUrl: 20
      #   skillAudio: 5
      #   skillDocuments: 5
      #   skillType: 5
      #   skillVideo: 5
      #   skillSummary: 20

      #   # top level profile attributes to iterate over
      # _.each ['location', 'accountPictureUrl', 'organizations', 'tags', 'profileFeatures'], (val, index) ->
      #   if profile?[val]?.length then completeness += completenessValues[val] and console.log 'val is:', val
      #   #lower level skill attributes to iterate over
      # _.each ['skillHeadlinePhotoUrl', skillAudio', 'skillVideo', 'skillSummary', 'skillType', 'skillDocuments'], (val, index) ->
      #   if profile?.skills[0]?[val]?.length then completeness += completenessValues[val]

      return completeness
  @
