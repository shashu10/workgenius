angular.module('workgenius.controllers', [])


// ============ //
//     MENU     //
// ============ //

.controller('MenuCtrl',
  ['$scope', '$rootScope', '$state', '$ionicHistory', '$ionicModal', '$interval', 'getUserData',
  function( $scope, $rootScope, $state, $ionicHistory, $ionicModal, $interval, getUserData) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.logout = function() {
      Parse.User.logOut();
      
      getUserData();

      $scope.toggleWithoutAnimation('registration.login');
      $ionicHistory.clearCache();
  };

  $scope.toggleWithoutAnimation = function(state) {
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableAnimate: true
    });
    $state.go(state, {
        clear: true
    });
  };
  // End

  // Contact Us Modal

  $scope.contactStatus = 'Send';
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/shared/contact-us.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.contactModal = modal;
  });

  $scope.cancelMessage = function () {
    $scope.contactModal.hide();
  };

  $scope.sendMessage = function (shift) {
    $scope.contactStatus = 'Sent!';
    $interval(function() {
        $scope.contactModal.hide().then(function () {
          $scope.contactStatus = 'Send';
        });
      }, 1000, 1);
  };

  // End

}])

// ============ //
// AVAILABILITY //
// ============ //

.controller('AvailabilityTabsCtrl',
  ['$scope',
  function($scope) {

    $scope.$on('$stateChangeSuccess', function(event, current) {
        if (current.name.indexOf('block-days') > -1) {
          $scope.availActive = false;
        } else {
          $scope.availActive = true;
        }
    });
}])
.controller('AvailabilityCtrl',
  ['$rootScope', '$scope',
  function($rootScope, $scope) {

    var YES_NO = 2;
    var YES_MAYBE_NO = 3;

    // New array format
    var toggleUniqueArray = function (day, hour) {
      hour =  Number(moment(hour, "ha").format('H'));
      if (!$rootScope.currentUser.availability[day]) {
        $rootScope.currentUser.availability[day] = [hour];
        return;
      }
      var index = $rootScope.currentUser.availability[day].indexOf(hour);
      if (index > -1) {
        // remove if it already exists
        $rootScope.currentUser.availability[day].splice(index, 1);
        if ($rootScope.currentUser.availability[day].length === 0) {
          delete $rootScope.currentUser.availability[day];
        }

      } else {
        $rootScope.currentUser.availability[day].push(hour);
      }
      if ($rootScope.currentUser.availability[day])
        $rootScope.currentUser.availability[day].sort(function(a, b){return a-b;});
    };

    $scope.select = function(day, interval, hour) {
      toggleUniqueArray(day, hour);
      if ($scope.onChange) $scope.onChange();
    };

    $scope.isSelected = function (day, hour) {
      if (!$rootScope.currentUser.availability[day]) {
        return false;
      }
      formattedHour = Number(moment(hour, "ha").format('H'));
      var retval = $rootScope.currentUser.availability[day].indexOf(formattedHour) > -1;
      return retval;
    };
}])
.controller('BlockDaysCtrl',
  ['$rootScope', '$scope',
  function($rootScope, $scope) {
  $scope.showMonth = true;

  setCurrentMoment(moment());
  
  $scope.blockedCount = getBlockedInNext30Days();

  $scope.options = {

    showHeader: true,
    minDate: moment().format('YYYY-MM-DD'),
    maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),
    disabledDates: [],
    blockedDays: $scope.currentUser.blockedDays,
    disableClickedDates: true,

    eventClick: function(event) {
      setCurrentMoment(moment(event.date));
    },
    dateClick: function(event) {
      setCurrentMoment(moment(event.date));
    },
    blockClick: function (event, blockedDays) {
      $rootScope.currentUser.blockedDays = blockedDays;
      $scope.blockedCount = getBlockedInNext30Days();
      $scope.onChange();
    },
    changeMonth: function(month, year, blockedDays) {
      $scope.selectedYear = year;
      $scope.selectedMonth = month.name;
      $rootScope.currentUser.blockedDays = blockedDays;
      $scope.blockedCount = getBlockedInNext30Days();
    },
  };
  function setCurrentMoment (moment) {
    $scope.selectedYear = moment.format('YYYY');
    $scope.selectedMonth = moment.format('MMMM');
  }
  function getBlockedInNext30Days () {
    var thirtyDays = moment().add(30, 'days');

    for (var i = 0; i < $rootScope.currentUser.blockedDays.length; i++) {

      var day = $rootScope.currentUser.blockedDays[i];
      var mom = moment(day.day + "-" + day.month + "-" + day.year, 'D-M-YYYY');

      if (mom.isAfter(thirtyDays)) {
        // index is number of elements before first mom
        return i;
      }
    }
    return $rootScope.currentUser.blockedDays.length;
  }
}])

// ============ //
//   COMPANIES  //
// ============ //

.controller('CompaniesCtrl',
  ['$rootScope', '$scope', '$ionicModal', 'setUserData', 'setEligibility',
  function($rootScope, $scope, $ionicModal, setUserData, setEligibility) {

    $scope.customSave = setEligibility.save;
    $scope.selectedWorkType = null;

    $ionicModal.fromTemplateUrl('templates/shared/companies-modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.decline = function (company) {
      $scope.modal.hide();
    };
    $scope.accept = function (company) {

      setEligibility.toggleInterest(company.name, true);
      $scope.modal.hide();
      if ($scope.onChange) $scope.onChange();
    };
    $scope.select = function(company) {
      // Unselect type if it's already selected
      if ($scope.isInterested(company.name)) {
        setEligibility.toggleInterest(company.name, false);

        if ($scope.onChange) $scope.onChange();

      // Open detailed modal when unselected option is clicked
      } else {
        $scope.selectedCompany = company;
        $scope.modal.show();
      }
    };

    $scope.isEligible = function (name) {
      var eligibility = setEligibility.findEligibility(name);
      return eligibility && eligibility.eligible;
    };
    $scope.isInterested = function (name) {
      var eligibility = setEligibility.findEligibility(name);
      return eligibility && eligibility.interested;
    };
}])

// .controller('EarningsController', [ '$scope', function($scope) {
// }])
// .controller('VehiclesCtrl', ['$scope', function($scope) {
// }])
// .controller('TargetCtrl', ['$scope', function($scope) {
// // }])
// .controller('AvailableShiftsCtrl', ['$scope', '$ionicModal', function($scope, $ionicModal) {

//   $scope.shifts=[
//     {
//       name:"Coleen", company: "caviar", earnings: 62,
//       date: new Date("October 23, 2014"),
//       startsAt: new Date("October 23, 2014 18:30:00"),
//       endsAt: new Date("October 23, 2014 21:30:00")
//     },
//   ];
//   $scope.selectedShift = $scope.shifts[0];
//   // Create the login modal that we will use later
//   $ionicModal.fromTemplateUrl('templates/shared/accept-shift.html', {
//     scope: $scope
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });

//   $scope.accept = function (shift) {
//     $scope.selectedShift = shift;
//     $scope.modal.show();
//   };

//   $scope.acceptShift = function (shift) {
//     $scope.modal.hide();
//   };
//   $scope.declineShift = function (shift) {
//     $scope.modal.hide();
//   };

// }])

// - END -
