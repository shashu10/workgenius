angular.module('workgenius.onboarding', [])

.controller('OnboardingCtrl',
    ['$scope', '$state', '$ionicLoading', '$rootScope', '$ionicHistory', 'getUserData', 'formatUploadData',
    function($scope, $state, $ionicLoading, $rootScope, $ionicHistory, getUserData, formatUploadData) {

    $scope.showPager = true;

    $scope.pages = [
      'onboarding.target-hours',
      'onboarding.work-types',
      'onboarding.availability-questions',
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
}])

.controller('AvailabilityQuestionsCtrl', ['$scope', '$rootScope', '$filter', function ($scope, $rootScope, $filter) {
  $scope.didSelectOption = function () {
    return $filter('filter')($scope.availQuestions.days, {selected:true}).length &&
           $filter('filter')($scope.availQuestions.timeSlots, {selected:true}).length;
  };
  $scope.setAvailWithQuestions = function () {
    var availability = {};

    // For each day
    for (var i = 0; i < $rootScope.days.length; i++) {
      var day = $rootScope.days[i];
      availability[day] = [];

      // For each interval in that day
      for (var j = 0; j < $rootScope.intervals.length; j++) {
        availability[day][j] = 0;

        if ($rootScope.availQuestions.days[i].selected) {
          for (var k = 0; k < $rootScope.availQuestions.timeSlots.length; k++) {
            if ( $rootScope.availQuestions.timeSlots[k].selected) {
              if (intervalInTimeslot($rootScope.intervals[j], $rootScope.availQuestions.timeSlots[k])) {
                availability[day][j] = 1;
                break;
              }
            }
          }
        } else {
          availability[day][j] = 0;
        }
      }
    }
    $rootScope.currentUser.availability = availability;
  };

  function intervalInTimeslot (interval, timeSlot) {
    var intMoment   = moment(interval, "ha");
    var firstDayMoment = moment($rootScope.intervals[0], "ha");

    // consider late night as next day for comparison
    if (intMoment.isBefore(firstDayMoment)) {
      intMoment.add(1, 'day');
    }
    intMoment.add(1, 'minute'); // Easier for .between() comparison

    var startMoment = moment(timeSlot.start, "ha");
    var endMoment   = moment(timeSlot.end,   "ha");
    var firstTimeSlotMoment = moment($rootScope.availQuestions.timeSlots[0].start, "ha");

    // Late night as next day
    if (endMoment.isBefore(firstTimeSlotMoment)) {
      endMoment.add(1, 'day');
    }

    if (intMoment.isBetween(startMoment, endMoment)) {
      return true;
    }
    return false;
  }
}])

.controller('WorkTypesCtrl',
  ['$rootScope', '$scope', '$ionicModal', 'setUserData', 'filterFilter', 'workTypes',
  function($rootScope, $scope, $ionicModal, setUserData, filterFilter, workTypes) {

    var chunk = function (arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    };

    $scope.workTypes = chunk(workTypes, 3);

    $scope.update = function () {
      setUserData.save('vehicles');
    };
    $scope.selectedWorkType = null;

    $ionicModal.fromTemplateUrl('templates/shared/work-types-modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.select = function(wType) {
      // Unselect type if it's already selected
      if ($rootScope.currentUser.workTypes[wType.name]) {
        delete $rootScope.currentUser.workTypes[wType.name];

      // Open detailed modal when unselected option is clicked
      } else {
        $scope.selectedWorkType = wType;
        $scope.modal.show();
      }
    };
    $scope.decline = function (workType) {
      $scope.modal.hide();
    };
    $scope.accept = function (workType) {
      $rootScope.currentUser.workTypes[workType.name] = true;
      $scope.update();
      $scope.modal.hide();
    };
}]);
