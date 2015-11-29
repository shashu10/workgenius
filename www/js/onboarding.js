angular.module('workgenius.onboarding', [])

.controller('OnboardingCtrl',
    ['$scope', '$state', '$ionicLoading', '$rootScope', '$ionicHistory', 'getUserData', 'formatUploadData',
    function($scope, $state, $ionicLoading, $rootScope, $ionicHistory, getUserData, formatUploadData) {

    $scope.showPager = true;

    $scope.pages = [
      'onboarding.target-hours',
      'onboarding.companies',
      'onboarding.work-types',
      'onboarding.availability',
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
      var nextPage = $scope.getNextPage();
      $state.go(nextPage, {
          clear: true
      });
    };

    $scope.finish = function () {
      $state.go('app.schedule-calendar-page');
    };
    $scope.skipOnboarding = $scope.finish;
    
    $scope.goToPage = function (id) {
      // Allow only backward navigation when tapping pager
      var idx = $scope.pages.indexOf($state.current.name);
      var stepsBack = id - idx;
      if (stepsBack < 0) {
        $ionicHistory.goBack(id - idx);
      }
    };
}]);
