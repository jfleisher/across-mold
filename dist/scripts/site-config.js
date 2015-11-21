(function() {
  var Mi;

  define('site_config', Mi = {
    Models: {},
    Collections: {},
    Routers: {},
    Views: {},
    Helpers: {},
    Profiles: {
      userProfiles: {}
    },
    CMS: {
      'profile_types': [],
      'profile_index': [],
      'profile_desc': {},
      'labels': {},
      'prompts': {},
      '_3d_printing': {
        'skill_types': [],
        'organizations': [],
        'tags': [],
        'summary_placeholder': "",
        'attributes': {}
      },
      'injection_molding': {
        'skill_types': [],
        'organizations': [],
        'tags': [],
        'summary_placeholder': "",
        'attributes': {}
      },
      'metal_die_casting': {
        'skill_types': [],
        'tags': [],
        'certifications': [],
        'summary_placeholder': "",
        'attributes': {}
      },
      'cnc_machining': {
        'skill_types': [],
        'tags': [],
        'certifications': [],
        'summary_placeholder': "",
        'attributes': {}
      },
      'other': {
        'skill_types': [],
        'organizations': [],
        'tags': [],
        'summary_placeholder': "",
        'attributes': {}
      }
    }
  }, !navigator.cookieEnabled ? (alert("Please enable cookie support in your browser for across-mold.com."), console.log('Cookies disabled detected and warning presented.')) : void 0, Mi);

}).call(this);
