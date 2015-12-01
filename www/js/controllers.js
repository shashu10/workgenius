angular.module('workgenius.controllers', [])

.controller('MenuCtrl', ['$scope', '$state', '$ionicHistory', '$ionicModal', 'getUserData', '$rootScope', function( $scope, $state, $ionicHistory, $ionicModal, getUserData, $rootScope) {

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
    $scope.contactModal.hide();
  };

  // End

}])
.controller('BlockDaysCtrl', ['$rootScope', '$scope', '$ionicModal', 'timePicker', 'setUserData', function($rootScope, $scope, $ionicModal, timePicker, setUserData) {
  $scope.showMonth = true;

  setCurrentMoment(moment());
  
  $scope.options = {

    showHeader: true,
    minDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),
    disabledDates: [],
    disableClickedDates: true,

    eventClick: function(event) {
      setCurrentMoment(moment(event.date));
    },
    dateClick: function(event) {
      setCurrentMoment(moment(event.date));
    },
    changeMonth: function(month, year) {
      $scope.selectedYear = year;
      $scope.selectedMonth = month.name;
    },
  };
  function setCurrentMoment (moment) {
    $scope.selectedYear = moment.format('YYYY');
    $scope.selectedMonth = moment.format('MMMM');
  }
}])
.controller('AvailabilityCtrl', ['$rootScope', '$scope', '$ionicModal', 'timePicker', 'setUserData', function($rootScope, $scope, $ionicModal, timePicker, setUserData) {

    $scope.availQuestions = {
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
    $scope.setAvailWithQuestions = function () {
      var availabilityGrid = {};

      // For each day
      for (var i = 0; i < $rootScope.days.length; i++) {
        var day = $rootScope.days[i];
        availabilityGrid[day] = [];

        // For each interval in that day
        for (var j = 0; j < $rootScope.intervals.length; j++) {
          availabilityGrid[day][j] = 0;

          if ($scope.availQuestions.days[i].selected) {
            for (var k = 0; k < $scope.availQuestions.timeSlots.length; k++) {
              if ( $scope.availQuestions.timeSlots[k].selected) {
                if (inIntervalInTimeslot($rootScope.intervals[j], $scope.availQuestions.timeSlots[k])) {
                  availabilityGrid[day][j] = 1;
                  break;
                }
              }
            }
          } else {
            availabilityGrid[day][j] = 0;
          }
        }
      }
      $rootScope.currentUser.availabilityGrid = availabilityGrid;
    };

    function inIntervalInTimeslot (interval, timeSlot) {
      var intMoment   = moment(interval, "ha");
      var firstDayMoment = moment($rootScope.intervals[0], "ha");

      // consider late night as next day for comparison
      if (intMoment.isBefore(firstDayMoment)) {
        intMoment.add(1, 'day');
      }
      intMoment.add(1, 'minute'); // Easier for .between() comparison

      var startMoment = moment(timeSlot.start, "ha");
      var endMoment   = moment(timeSlot.end,   "ha");
      var firstTimeSlotMoment = moment($scope.availQuestions.timeSlots[0].start, "ha");

      // Late night as next day
      if (endMoment.isBefore(firstTimeSlotMoment)) {
        endMoment.add(1, 'day');
      }

      if (intMoment.isBetween(startMoment, endMoment)) {
        return true;
      }
      return false;
    }

    $scope.update = setUserData.availabilityGrid;
    var YES_NO = 2;
    var YES_MAYBE_NO = 3;
    
    $scope.select = function(day, interval) {
      // 3 options: Yes, Maybe, Blank

      if (day && interval !== null && interval !== undefined) {

        $rootScope.currentUser.availabilityGrid[day][interval] = ($rootScope.currentUser.availabilityGrid[day][interval] + 1) % YES_NO;

      } else if (!day && interval !== null && interval !== undefined) {

        for (var i = 0; i < $rootScope.days.length; i++) {
          day = $rootScope.days[i]
          $rootScope.currentUser.availabilityGrid[day][interval] = ($rootScope.currentUser.availabilityGrid[day][interval] + 1) % YES_NO;
        }
      } else if (day && (interval === null || interval === undefined)) {

        for (var i = 0; i < $rootScope.intervals.length; i++) {
          $rootScope.currentUser.availabilityGrid[day][i] = ($rootScope.currentUser.availabilityGrid[day][i] + 1) % YES_NO;
        }
      }
      $scope.update();
    };

}])
.controller('VehiclesCtrl', ['$scope', 'setUserData', function( $scope, setUserData) {
    $scope.update = setUserData.vehicles;
}])
.controller('CompaniesCtrl', ['$rootScope', '$scope', 'setUserData', function($rootScope, $scope, setUserData) {

    var chunk = function (arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    };
    $scope.select = function(name) {
      if ($rootScope.currentUser.companies[name]) {
        delete $rootScope.currentUser.companies[name];
        $scope.hideFooter();
      } else {
        $rootScope.currentUser.companies[name] = true;
        $scope.showFooter(name);
      }

      $scope.update();
    };
    $scope.hideFooter = function () {
      if ($scope.selectedCompany)
        $scope.selectedCompany.selected = false;
    };
    $scope.showFooter = function (name) {
      $scope.selectedCompany = {selected:true, name: name, description: companyDescription[name]};
      var footer = document.getElementsByClassName("wg-company-footer");
      angular.element(footer).removeAttr('style');
    };

    var companyList = [
      "instacart",
      "saucey",
      "bento",
      "shyp",
      "caviar",
      "luxe",
      "sprig",
      "munchery",
      "doordash",
    ];

    var companyDescription = {
      instacart: "Instacart is an on-demand grocery delivery company. The job consists of purchasing, packing and delivering groceries.",
      saucey: "Saucey is an on-demand Alcohol and tobacco delivery service. Drivers must be over 21 and have exceptional people skills.",
      bento: "Bento is an on-demand delivery startup for delicious Asian meals. The job involves delivering meals from our kitchens.",
      shyp: "Shyp is an on-demand . Must be able to package and handle items with care and have great people skills.",
      caviar: "Caviar is a restaurant delivery services for individuals and businesses. Must have a customer-service mentality.",
      luxe: "Luxe is an on-demand parkign service. Drive cars to and from garages to drivers. A valid license is required.",
      sprig: "Sprig is an on-demand organic and locally sourced meal delivery service. Deliver meals from our kitchens to customers.",
      munchery: "Munchery is an on-demand food delivery service that hires world class chefs to prepare meals. A bike is required.",
      doordash: "DoorDash is an on-demand restaurant delivery service. Pick up food items and deliver them to customers efficiently.",
    };
    $scope.chunkedCompanies = chunk(companyList, 3);

    $scope.update = setUserData.companies;
    $scope.hideFooter();
}])
.controller('WorkTypesCtrl', ['$rootScope', '$scope', 'setUserData', 'filterFilter', function($rootScope, $scope, setUserData, filterFilter) {
  
    var workList = [
      {
        name: "Ridesharing",
        description: "Ridesharing",
        icon: "ion-android-car",
        selected: false
      }, {
        name: "Grocery",
        description: "Grocery Shopping",
        icon: "ion-ios-nutrition",
        selected: false
      }, {
        name: "Meal",
        description: "Meal Delivery",
        icon: "ion-pizza",
        selected: false
      }, {
        name: "liquor",
        description: "liquor Delivery",
        icon: "ion-beer",
        selected: false
      }, {
        name: "Package",
        description: "Package Delivery",
        icon: "ion-cube",
        selected: false
      }, {
        name: "Valet",
        description: "Valet Services",
        icon: "ion-key",
        selected: false
      }
    ];

    var workDescription = {
      bento: "Company description",
      caviar: "Company description",
      instacart: "Company description",
      luxe: "Company description",
      munchery: "Company description",
      saucey: "Company description",
      shyp: "Company description",
      sprig: "Company description",
      workgenius: "Company description",
    };

    var chunk = function (arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    };

    $scope.workTypes = chunk(workList, 3);

    $scope.update = setUserData.workTypes;
    $scope.selectedWorkType = null;

    $scope.select = function(name) {
      if ($rootScope.currentUser.workTypes[name]) {
        delete $rootScope.currentUser.workTypes[name];
        $scope.hideFooter();
      } else {
        $rootScope.currentUser.workTypes[name] = true;
        $scope.showFooter(name);
      }

      $scope.update();
    };
    $scope.hideFooter = function () {
      if ($scope.selectedWorkType)
        $scope.selectedWorkType.selected = false;
    }
    $scope.showFooter = function (name) {
      $scope.selectedWorkType = filterFilter(workList, {name: name})[0];
      $scope.selectedWorkType.selected = true;
      var footer = document.getElementsByClassName("wg-work-types-footer");
      angular.element(footer).removeAttr('style');
    }
}])

.controller('TargetCtrl', ['$scope', 'setUserData', function($scope, setUserData) {
  $scope.update = setUserData.target;
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
.controller('EarningsController', [ '$scope', '$ionicHistory', '$state', function($scope, $ionicHistory, $state) {
}])
.controller('ScheduleCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$location', '$ionicPopup', function($scope, $rootScope, $ionicScrollDelegate, $location, $ionicPopup) {

  $scope.adjustCalendarHeight = function (argument) {
    
  };
  $scope.selectedMonth = moment().format('MMMM');
  $scope.selectedYear = moment().format('YYYY');

  $scope.Math = window.Math;
  $scope.options = {
    // Start calendar from current day

    minDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),
    disabledDates: [
        "2015-06-22",
        "2015-07-27",
        "2015-08-13",
        "2015-08-15"
    ],

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

      if (moment(event.date).format('MM') === month.index) {
        $scope.scrollTo({date: new Date()});
      } else {
        $scope.scrollTo({date:new Date(year + "/" + month.index + "/" + 1)});
      }
    },
  };
  $scope.anchroID = function (group) {
    return "id" + moment(group[0].startsAt).format('YYYY-MM-DD');
  };
  $scope.gotoAnchor = function(anchroID) {
    $location.hash(anchroID);
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

  // Flex cal error displays one day behind
  $scope.shifts = [
    {
      company: 'Luxe', date: "2015-12-5",
      startsAt: new Date("December 5, 2015 8:00:00"),
      endsAt: new Date("December 5, 2015 11:30:00"),
    },
    {
      company: 'Instacart', date: "2015-12-13",
      startsAt: new Date("December 12, 2015 07:00:00"),
      endsAt: new Date("December 12, 2015 10:00:00"),
    },
    {
      company: 'Caviar', date: "2015-12-13",
      startsAt: new Date("December 12, 2015 11:00:00"),
      endsAt: new Date("December 12, 2015 14:00:00"),
    },
    {
      company: 'Luxe', date: "2015-12-15",
      startsAt: new Date("December 14, 2015 12:00:00"),
      endsAt: new Date("December 14, 2015 15:30:00"),
    },
    {
      company: 'Caviar', date: "2015-12-16",
      startsAt: new Date("December 15, 2015 8:00:00"),
      endsAt: new Date("December 15, 2015 11:00:00"),
    },
    {
      company: 'Instacart', date: "2015-12-17",
      startsAt: new Date("December 16, 2015 07:00:00"),
      endsAt: new Date("December 16, 2015 10:00:00"),
    },
    {
      company: 'Luxe', date: "2015-12-17",
      startsAt: new Date("December 16, 2015 11:00:00"),
      endsAt: new Date("December 16, 2015 14:00:00"),
    },
    {
      company: 'Caviar', date: "2015-12-19",
      startsAt: new Date("December 18, 2015 12:00:00"),
      endsAt: new Date("December 18, 2015 16:00:00"),
    },
  ];
  $scope.cancelWarning = function (shift, group, shifts) {
    $scope.shiftToCancel = shift;
    $scope.cancelPopup = $ionicPopup.show({
      template: '<p>Late cancellations this quarter: {{currentUser.cancellations}}/3</p><img ng-src="img/companies/{{shiftToCancel.company.toLowerCase()}}.png" alt=""><p class="schedule-time"><standard-time-meridian etime="shiftToCancel.startsAt.getHours()*3600"></standard-time-meridian> - <standard-time-meridian etime="shiftToCancel.endsAt.getHours()*3600"></standard-time-meridian></p>',
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
    .then(function(cancel) {

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
          type: 'button-default',
          onTap: function(e) {
            // Returning a value will cause the promise to resolve with the given value.
            // return shift;
          }
        }]
    }).then(function (e) {
      // From parent scope
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
  $scope.groupedShifts = groupBy($scope.shifts, function(item){return [item.date];});

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
}]);

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
