(function() {
  define(['underscore', 'helpers'], function(_) {
    _.mixin({
      capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      }
    });
    _.mixin({
      validateEmail: function(email) {
        var re;
        re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
        return re.test(email);
      }
    });
    _.mixin({
      cleanFileName: function(file) {
        return file.toLowerCase().replace(/\s/g, "X");
      }
    });
    _.mixin({
      alphabetizeArray: function(array) {
        return array.sort();
      }
    });
    _.mixin({
      cleanUriComponents: function(str) {
        return encodeURIComponent(str);
      }
    });
    _.mixin({
      decodeSearchTerm: function(str) {
        return decodeURIComponent(str);
      }
    });
    return this;
  });

}).call(this);
