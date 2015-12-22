angular.module('workgenius.controllers', [])

.controller('MenuCtrl',
  ['$scope', '$state', '$ionicHistory', '$ionicModal', '$interval', 'getUserData',
  function( $scope, $state, $ionicHistory, $ionicModal, $interval, getUserData) {

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
.controller('BlockDaysCtrl',
  ['$rootScope', '$scope',
  function($rootScope, $scope) {
  $scope.showMonth = true;

  setCurrentMoment(moment());
  
  $rootScope.currentUser.blockedDays = [];
  $scope.blockedCount = 0;

  $scope.options = {

    showHeader: true,
    minDate: moment().format('YYYY-MM-DD'),
    maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),
    disabledDates: [],
    blockedDays: $scope.currentUser.blockedDays,
    disableClickedDates: true,

    eventClick: function(event) {
      setCurrentMoment(moment(event.date));
      console.log('test');
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
      hour =  Number(hour.match(/\d+/)[0]);
      if (!$rootScope.currentUser.availability[day]) {
        $rootScope.currentUser.availability[day] = [hour];
        return;
      }
      var index = $rootScope.currentUser.availability[day].indexOf(hour);
      if (index > -1) {
        $rootScope.currentUser.availability[day].splice(index, 1);
      } else {
        $rootScope.currentUser.availability[day].push(hour);
      }
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
      formattedHour = moment(hour, "ha").format('H');
      return $rootScope.currentUser.availability[day].indexOf(formattedHour) > -1;
    };
}])

.controller('CompaniesCtrl',
  ['$rootScope', '$scope', '$ionicModal', 'setUserData', 'setEligibility',
  function($rootScope, $scope, $ionicModal, setUserData, setEligibility) {

    $scope.select = function(company) {
      // Unselect type if it's already selected
      if ($rootScope.currentUser.companies[company.name]) {
        delete $rootScope.currentUser.companies[company.name];
        if ($scope.onChange) $scope.onChange();

      // Open detailed modal when unselected option is clicked
      } else {
        $scope.selectedCompany = company;
        $scope.modal.show();
      }
    };
    $scope.specialSave = setEligibility.save;
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
      $rootScope.currentUser.companies[company.name] = true;
      $scope.modal.hide();
      if ($scope.onChange) $scope.onChange();
    };
}])

.controller('ShiftsCtrl', ['$scope', '$ionicModal', function($scope, $ionicModal) {

  $scope.shifts=[
    {
      name:"Coleen", company: "caviar", earnings: 62,
      date: new Date("October 23, 2014"),
      startsAt: new Date("October 23, 2014 18:30:00"),
      endsAt: new Date("October 23, 2014 21:30:00")
    },
    {
      name:"Sam R", company: "saucey", earnings: 72,
      date: new Date("October 24, 2014"),
      startsAt: new Date("October 24, 2014 19:00:00"),
      endsAt: new Date("October 24, 2014 23:00:00")
    },
    {
      name:"Ed D", company: "luxe", earnings: 80,
      date: new Date("October 26, 2014"),
      startsAt: new Date("October 26, 2014 8:00:00"),
      endsAt: new Date("October 26, 2014 12:00:00")
    },
    {
      name:"Josh", company: "instacart", earnings: 30,
      date: new Date("October 30, 2014"),
      startsAt: new Date("October 30, 2014 11:30:00"),
      endsAt: new Date("October 30, 2014 13:30:00")
    },
  ];
  $scope.selectedShift = $scope.shifts[0];
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/shared/accept-shift.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.accept = function (shift) {
    $scope.selectedShift = shift;
    $scope.modal.show();
  };

  $scope.acceptShift = function (shift) {
    $scope.modal.hide();
  };
  $scope.declineShift = function (shift) {
    $scope.modal.hide();
  };

}])
.controller('EarningsController', [ '$scope', function($scope) {
}])
.controller('ScheduleCtrl',
  ['$scope', '$rootScope', '$ionicScrollDelegate', '$location', '$ionicPopup',
  function($scope, $rootScope, $ionicScrollDelegate, $location, $ionicPopup) {

  $scope.adjustCalendarHeight = function (argument) {
    
  };
  $scope.selectedMonth = moment().format('MMMM');
  $scope.selectedYear = moment().format('YYYY');

  $scope.Math = window.Math;
  $scope.options = {
    // Start calendar from current day

    minDate: moment('2015-12-01').format('YYYY-MM-DD'),
    maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),
    // disabledDates: [
    //     "2015-06-22"
    // ],

    // dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    // mondayIsFirstDay: true,//set monday as first day of week. Default is false

    eventClick: function(event) {

      var m = moment(event.date);
      $scope.scrollTo(event);
      $scope.selectedMonth = m.format('MMMM');
    },
    dateClick: function(event) {

      var m = moment(event.date);
      $scope.scrollTo(event);
      $scope.selectedMonth = m.format('MMMM');
    },
    changeMonth: function(month, year) {

      $scope.selectedMonth = month.name;
      $scope.selectedYear = year;

      if (moment(event.date).format('M') === month.index) {
        $scope.scrollTo({date: new Date()});
      } else {
        $scope.scrollTo({date:new Date(year + "/" + month.index + "/" + 1)});
      }
    },
  };
  $scope.anchorID = function (group) {
    return "id" + moment(group[0].startsAt).format('YYYY-MM-DD');
  };
  $scope.gotoAnchor = function(anchorID) {
    $location.hash(anchorID);
    $ionicScrollDelegate.anchorScroll(true);
  };
  $scope.scrollTo = function (event) {
    var eventDate = moment(event.date);
    for (var i = 0; i < $scope.groupedShifts.length; i++) {
      if (!eventDate.isAfter($scope.groupedShifts[i][0].date)) {
        $scope.gotoAnchor("id" + moment($scope.groupedShifts[i][0].date).format('YYYY-MM-DD'));
        return;
      }

    }
    $scope.gotoAnchor('empty-shift-list');
  };

  $scope.cancelWarning = function (shift, group, shifts) {
    $scope.shiftToCancel = shift;
    $scope.cancelPopup = $ionicPopup.show({
      template: '<img ng-src="img/companies/{{shiftToCancel.company.toLowerCase()}}.png" alt=""><p>{{dividerFunction(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p><div ng-show="isWithin72Hr(shiftToCancel.startsAt)"><p><strong>Warning:</strong></p><p>This cancellation is within 72 hours and will result in a <strong>strike</strong></p><p>Late cancellations this quarter: {{currentUser.cancellations}}/3</p></div>',
      title: 'Are you sure you want to cancel the following shift?',
      scope: $scope,
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
          text: 'No, Leave it',
          type: 'button-default',
          onTap: function(e) {
            return false;
          }
        }, {
          text: 'Yes, Cancel',
          type: 'button-assertive',
          onTap: function(e) {
            return true;
          }
        }]
    })
    
    // Must call cannotCancelWarning in .then 
    .then(function (cancel) {

      if (cancel) {
        if ($rootScope.currentUser.cancellations >= 3) {
          $scope.cannotCancelWarning();
        } else {
          $scope.cancelShift(shift, group, shifts);
        }
      }
    });
  };
  $scope.cannotCancelWarning = function () {

    $scope.cannotCancelPopup = $ionicPopup.show({
      template: '<p>Sorry you cannot cancel this shift automatically. Please contact us immediately to if you are unable to fulfil this shift.</p>',
      title: 'Maximum number of cancellations reached!',
      scope: $scope,
      buttons: [{
          text: 'Contact Us',
          type: 'button-positive',
          onTap: function(e) {
            // Returning a value will cause the promise to resolve with the given value.
            // return shift;
            return true;
          }
        }, {
          text: 'Don\'t Cancel',
          type: 'button-default',
          onTap: function(e) {
            return false;
          }
        }]
    }).then(function (show) {
      // From parent scope
      if (show)
        $scope.contactModal.show();
    });
  };

  $scope.cancelShift = function (shift, group, shifts) {

    $rootScope.currentUser.cancellations++;

    var idx = group.indexOf(shift);
    if (group.length === 1) {   
      idx = shifts.indexOf(group);
      shifts.splice(idx, 1);
    }

    group.splice(idx, 1);
  };
  $scope.groupedShifts = groupBy($rootScope.shifts, function(item){return [item.date];});

  $scope.shiftEarnings = function (shift) {
    return (shift.endsAt.getTime() - shift.startsAt.getTime())/3600000 * $rootScope.hourlyRate;
  };
  $scope.groupEarnings = function (group) {
    var earnings = 0;
    for (var i=0; i < group.length; i++) {
      var shift = group[i];
      earnings += $scope.shiftEarnings(shift);
    }
    return earnings;
  };
  $scope.dividerFunction = function(date){
    return moment(date).format('dddd Do');
  };

  $scope.formatAMPM = function (date) {
    return moment(date).format('ha');
  };
  $scope.isWithin72Hr = function (date) {
    return moment(date).isBefore(moment().add(72, 'hour'));
  };
}]);

// .controller('VehiclesCtrl', ['$scope', function($scope) {
// }])
// .controller('TargetCtrl', ['$scope', function($scope) {
// }])

// - END -

function groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );  
  });
  return Object.keys(groups).map( function( group )
  {
    return groups[group]; 
  });
}
