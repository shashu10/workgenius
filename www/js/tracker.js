var tapTracker = ['$ionicGesture', function($ionicGesture) {
  return function(scope, element, attr) {

    var listener = function (event) {
      console.log('tapped');
      console.log(event);
    };
    var gesture = $ionicGesture.on('tap', listener, element);

    scope.$on('$destroy', function() {
      $ionicGesture.off(gesture, 'tap', listener);
    });
  };
}];

angular.module('workgenius.tracker', [])
.run(['$rootScope',
  function($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(event, current) {
        console.log(current.name);
    });
}])
.directive('ionItem', tapTracker)
.directive('button', tapTracker);