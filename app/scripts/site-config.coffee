define 'site_config',
  Mi = {
    Models: {}
    Collections: {}
    Routers: {}
    Views: {}
    Helpers: {}
    Profiles:
      userProfiles: {}
    CMS:
      # profile types as objects with associated
      # organizations attributes, and skill types

      #starting with a simple array of the four profile types
      'profile_types' : []
      'profile_index' : []
      'profile_desc' : {} # LOAD FROM Parse
      'labels': {} #load from Parse
      'prompts': {} #load from Parse

      '_3d_printing' :
        'skill_types'   : []
        'organizations' : []
        'tags'          : []
        'summary_placeholder' : ""
        'attributes': {}

      'injection_molding' :
        'skill_types'   : []
        'organizations' : []
        'tags'          : []
        'summary_placeholder' : ""
        'attributes': {}

      'metal_die_casting'      :
        'skill_types' : []
        'tags'        : []
        'certifications': []
        'summary_placeholder' : ""
        'attributes': {}

      'cnc_machining'  :
        'skill_types' : []
        'tags'        : []
        'certifications': []
        'summary_placeholder' : ""
        'attributes':{}

      'other'  :
        'skill_types'   : []
        'organizations' : []
        'tags'          : []
        'summary_placeholder' : ""
        'attributes': {}

  }

  #detect local data storage setting
  if !navigator.cookieEnabled
    alert("Please enable cookie support in your browser for across-mold.com.")
    console.log 'Cookies disabled detected and warning presented.'

  Mi
