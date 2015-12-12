// State and gesture tracking for showing first time information and tooltips.

var tapTracker = ['$ionicGesture', function($ionicGesture) {
  return function(scope, element, attr) {

    var listener = function (event) {
    };
    var gesture = $ionicGesture.on('tap', listener, element);

    scope.$on('$destroy', function() {
      $ionicGesture.off(gesture, 'tap', listener);
    });
  };
}];
angular.module('workgenius.tracker', [])

.run(['$rootScope', '$ionicPopover', '$interval',
  function($rootScope, $ionicPopover, $interval) {

    // List of relevant states and tooltips
    var states = [
    {
      name: 'app.schedule',
      element: '.flex-calendar',
      condition: function () {
        //If has some shifts
        // if $rootScope.currentUser.shift > X
        return true;

        // else
        //   return false
      },
      save: function () {
        // $rootScope.currentUser.appState
      },
      tooltip: '<ion-popover-view><ion-content> <p>Swipe for next week</p> </ion-content></ion-popover-view>'
    }];
    var showPopover = function (state) {

      $rootScope.popover = $ionicPopover.fromTemplate(state.tooltip, {
        scope: $rootScope
      });
      $interval(function() {
        var el = angular.element(state.element)[0];
        // console.log(el);
        // $rootScope.popover.show(el);
      }, 1000, 1);
    };
    var seeState = function(event, current) {
      // console.log(current.name);

      for (var i in states) {
        var state = states[i];

        // Check if state matches name and tooltip has not been shown
        if (state.name === current.name && !($rootScope.currentUser.appState && $rootScope.currentUser.appState[current.name] === true)) {
          if (state.condition())
            showPopover(state);
        }
      }
    };

    $rootScope.$on('$stateChangeSuccess', seeState);
}])

.directive('ionItem', tapTracker)

.directive('button', tapTracker);