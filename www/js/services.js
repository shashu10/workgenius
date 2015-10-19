angular.module('ParseObjects').
  factory('Preferences', function() {
 
    var Preferences = Parse.Object.extend("Preferences", {
      // Instance methods
    }, {
      // Class methods
    });
 
    // Title property
    Preferences.prototype.__defineGetter__("title", function() {
      return this.get("title");
    });
    Preferences.prototype.__defineSetter__("title", function(aValue) {
      return this.set("title", aValue);
    });
 
    return Preferences;
  });
