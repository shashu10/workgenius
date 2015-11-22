angular.module('workgenius.onboarding', [])

.controller('OnboardingCtrl',
    ['$scope', '$state', '$ionicLoading', '$rootScope', '$ionicHistory', '$ionicLoading', 'getUserData', 'formatUploadData',
    function($scope, $state, $ionicLoading, $rootScope, $ionicHistory, $ionicLoading, getUserData, formatUploadData) {

    $scope.showPager = true;

    $scope.pages = [
      'tab.register-account-info',
      'tab.register-target-hours',
      'tab.register-companies',
      'tab.register-work-types',
      'tab.register-availability',
    ];
    $scope.syncPagerState = function () {
      $scope.currentPage = $scope.pages.indexOf($state.current.name);
    };
    $scope.getNextPage = function () {
      var idx = $scope.pages.indexOf($state.current.name);
      var nextPage = $scope.pages[idx+1];
      return nextPage;
    };
    $scope.syncPagerState();

    $scope.$on('$stateChangeSuccess', function(event, current) {
        $scope.syncPagerState();
    });
    $scope.next = function() {
      var nextPage = $scope.getNextPage(true);
      $state.go(nextPage, {
          clear: true
      });
    };
}]);
