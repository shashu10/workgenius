angular.module('workgenius.onboarding', [])

.controller('OnboardingCtrl',
    ['$scope', '$state', '$ionicLoading', '$rootScope', '$ionicHistory', 'setUserData', 'getUserData', 'formatUploadData',
    function($scope, $state, $ionicLoading, $rootScope, $ionicHistory, setUserData, getUserData, formatUploadData) {

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
    $scope.save = function (value) {
      setUserData.save(value);
    };
    $scope.finish = function () {
      $state.go('app.schedule');
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
  $rootScope.availQuestions = {
    days: [{
        name: 'monday', selected: false
      }, {
        name: 'tuesday', selected: false
      }, {
        name: 'wednesday', selected: false
      }, {
        name: 'thursday', selected: false
      }, {
        name: 'friday', selected: false
      }, {
        name: 'saturday', selected: false
      }, {
        name: 'sunday', selected: false
      }],
    timeSlots: [{
        name: 'mornings', start: '6am', end: '10am', selected: false
      }, {
        name: 'lunch', start: '10am', end: '2pm', selected: false
      }, {
        name: 'afternoons', start: '2pm', end: '5pm', selected: false
      }, {
        name: 'evenings', start: '5pm', end: '9pm', selected: false
      }, {
        name: 'nights', start: '9pm', end: '2am', selected: false,
      }],
  };
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
        // availability[day][j] = 0;

        if ($scope.availQuestions.days[i].selected) {
          for (var k = 0; k < $scope.availQuestions.timeSlots.length; k++) {
            if ($scope.availQuestions.timeSlots[k].selected) {
              if (intervalInTimeslot($rootScope.intervals[j], $scope.availQuestions.timeSlots[k])) {
                console.log($rootScope.intervals[j]);
                console.log($scope.availQuestions.timeSlots[k]);
                availability[day].push(moment($rootScope.intervals[j], "ha").format('H'));
                break;
              }
            }
          }
        } else {
          // availability[day][j] = 0;
        }
      }
    }
    console.log(availability);
    $rootScope.currentUser.availability = availability;
  };

  function intervalInTimeslot (interval, timeSlot) {
    var intMoment = moment(interval, "ha");
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
