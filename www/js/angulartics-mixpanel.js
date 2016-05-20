(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name angulartics.mixpanel
 * Enables analytics support for Mixpanel (http://mixpanel.com)
 */
angular.module('angulartics.mixpanel', ['angulartics'])
.config(['$analyticsProvider', function ($analyticsProvider) {

  angulartics.waitForVendorApi('mixpanel', 500, '__loaded', function (mixpanel) {
    $analyticsProvider.registerSetUsername(function (userId) {
      mixpanel.identify(userId);
    });
    $analyticsProvider.registerSetAlias(function (userId) {
      mixpanel.alias(userId);
    });
    $analyticsProvider.registerSetSuperPropertiesOnce(function (properties) {
      mixpanel.register_once(properties);
    });
    $analyticsProvider.registerSetSuperProperties(function (properties) {
      mixpanel.register(properties);
    });
    $analyticsProvider.registerSetUserPropertiesOnce(function (properties) {
      mixpanel.people.set_once(properties);
    });
    $analyticsProvider.registerSetUserProperties(function (properties) {
      mixpanel.people.set(properties);
    });
    $analyticsProvider.registerPageTrack(function (path) {
      mixpanel.track( "Page - " + getPageNameOnly(path));
    });
    $analyticsProvider.registerEventTrack(function (action, properties) {
      mixpanel.track(action, properties);
    });
  });

}]);

function getPageNameOnly(path) {
  path = path || "";

  // Remove absolute file path
  var hrefStart = path.indexOf('#/');
  if (hrefStart > -1) path = path.substr(hrefStart + 2);

  // Remove trailing href
  var hrefEnd = path.indexOf('#');
  if (hrefEnd > -1) path = path.substr(0, hrefEnd);

  // Remove claim shifts trailing number
  var claimShiftsNum = path.indexOf('claim-shifts/');
  if (claimShiftsNum > -1) path = path.substr(0, claimShiftsNum + 12);

  // remove

  return path;
}
})(window, window.angular);
