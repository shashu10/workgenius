angular.module('workgenius.controllers', [])

.controller('MenuCtrl', ['$scope', '$state', '$ionicHistory', '$ionicModal', 'getUserData', function( $scope, $state, $ionicHistory, $ionicModal, getUserData) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.logout = function() {
      Parse.User.logOut();
      
      getUserData();

      $scope.toggleWithoutAnimation('tab.login');
  };

  // Schedule calendar / list toggle

  $scope.showRightIcon = ($state.current.name == "app.schedule-calendar-page" || $state.current.name == "app.schedule-list-page");
  $scope.showCalendarIcon = $state.current.name == "app.schedule-list-page";

  $scope.$on('$stateChangeSuccess', function(event, current) {
    if (current.name == "app.schedule-calendar-page" || current.name == "app.schedule-list-page") {
      $scope.showRightIcon = true;
      $scope.showCalendarIcon = (current.name !== "app.schedule-calendar-page");
    } else {
      $scope.showRightIcon = false;
    }
  });

  $scope.showScheduleCalendar = function () {
    $scope.toggleWithoutAnimation('app.schedule-calendar-page');
  };
  $scope.showScheduleList = function () {
    $scope.toggleWithoutAnimation('app.schedule-list-page');
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

}])
.controller('AvailabilityCtrl', ['$rootScope', '$scope', '$ionicModal', 'timePicker', 'setUserData', function($rootScope, $scope, $ionicModal, timePicker, setUserData) {

    $scope.dailyHours = [0,0,0,0,0,0,0];

    $scope.chart = {
        labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        scaleShowHorizontalLines: false,
        scaleShowVerticalLines: false,
        datasets : [
            {
                fillColor : "#69BFF8",
                strokeColor : "#69BFF8",
                data : $scope.dailyHours
            }
        ], 
    };
    $scope.chartOptions = {
        scaleShowGridLines: false,
        scaleShowLabels: false,
        showScale: false,
        tooltipTemplate: "<%= value %> Hour<%if (value !== 1){%>s<%}%>",
    };

    $scope.update = setUserData.availability;

    $scope.editSchedule = function (day, schedule) {

      $scope.schedule = schedule || {
        id: Math.random().toString().slice(2),
        startsAt: timePicker(),
        endsAt: timePicker(),
        day: day,
      };

      $scope.modal.show();
    };
    $scope.deleteSchedule = function (schedule) {
      delete $rootScope.currentUser.availability[schedule.day][schedule.id];
      if (angular.equals({}, $rootScope.currentUser.availability[schedule.day])) {
        delete $rootScope.currentUser.availability[schedule.day];
      }
      $scope.recalculateHours();
    };
    $scope.saveDay = function () {
      if (!$rootScope.currentUser.availability[$scope.schedule.day]) {
        $rootScope.currentUser.availability[$scope.schedule.day] = {};
      }
      $rootScope.currentUser.availability[$scope.schedule.day][$scope.schedule.id] = $scope.schedule;
      $scope.modal.hide();
      $scope.recalculateHours();
    };
    $scope.recalculateHours = function () {
      var totalHours = 0;
      $scope.dailyHours.every(function (el, idx, arr) {
        arr[idx] = 0;
      });
      
      for (var day in $rootScope.currentUser.availability) {
        var hours = 0;
        for (var sched in $rootScope.currentUser.availability[day]) {
          var entry = $rootScope.currentUser.availability[day][sched];
          hours += (entry.endsAt.inputEpochTime - entry.startsAt.inputEpochTime)/3600;
        }
        totalHours += hours;
        $scope.dailyHours[$scope.days.indexOf(day)] = hours;
      }
      $rootScope.currentUser.totalHours = totalHours;
      $scope.update();
    };
    $scope.discardDay = function () {
      $scope.modal.hide();
    };


    $scope.days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    
    // Required for modal initialization
    $scope.schedule = {
      id: "",
      editing: false,
      startsAt: timePicker(),
      endsAt: timePicker(),
      day: "",
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/shared/newSchedule.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.recalculateHours();
}])
.controller('VehiclesCtrl', ['$scope', 'setUserData', function( $scope, setUserData) {
    $scope.update = setUserData.vehicles;
}])
.controller('CompaniesCtrl', ['$rootScope', '$scope', 'setUserData', function($rootScope, $scope, setUserData) {
  
    var companyList = [
      "bento",
      "caviar",
      "instacart",
      "luxe",
      "munchery",
      "saucey",
      "shyp",
      "sprig",
      "workgenius",
    ];

    var companyDescription = {
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

    $scope.chunkedCompanies = chunk(companyList, 3);

    $scope.update = setUserData.companies;
    $scope.selectedCompany = null;

    $scope.select = function(name) {
      if ($rootScope.currentUser.companies[name]) {
        delete $rootScope.currentUser.companies[name];
      } else {
        $rootScope.currentUser.companies[name] = true;
      }
      $scope.selectedCompany = {selected:true, name: name, description: companyDescription[name]};
      var footer = document.getElementsByClassName("wg-company-footer");
      angular.element(footer).removeAttr('style');

      $scope.update();
    };
}])
.controller('WorkTypesCtrl', ['$rootScope', '$scope', 'setUserData', function($rootScope, $scope, setUserData) {
  
    var workList = [
      {
        id: "Ridesharing",
        name: "Ridesharing",
        icon: "ion-android-car",
        selected: false
      }, {
        id: "Grocery",
        name: "Grocery Shopping",
        icon: "ion-ios-nutrition",
        selected: false
      }, {
        id: "Meal",
        name: "Meal Delivery",
        icon: "ion-pizza",
        selected: false
      }, {
        id: "liquor",
        name: "liquor Delivery",
        icon: "ion-beer",
        selected: false
      }, {
        id: "Package",
        name: "Package Delivery",
        icon: "ion-cube",
        selected: false
      }, {
        id: "Valet",
        name: "Valet Services",
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
      } else {
        $rootScope.currentUser.workTypes[name] = true;
      }
      $scope.selectedWorkType = {selected:true, name: name, description: workDescription[name]};
      var footer = document.getElementsByClassName("wg-company-footer");
      angular.element(footer).removeAttr('style');

      $scope.update();
    };
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

  $scope.cancellations = 0;
  $scope.adjustCalendarHeight = function (argument) {
    
  };
  $scope.selectedMonth = moment().format('MMMM');
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
      company: 'Instacart', date: "2015-11-23",
      startsAt: new Date("November 22, 2015 07:00:00"),
      endsAt: new Date("November 22, 2015 10:00:00"),
    },
    {
      company: 'Caviar', date: "2015-11-23",
      startsAt: new Date("November 22, 2015 11:00:00"),
      endsAt: new Date("November 22, 2015 14:00:00"),
    },
    {
      company: 'Luxe', date: "2015-11-25",
      startsAt: new Date("November 24, 2015 12:00:00"),
      endsAt: new Date("November 24, 2015 15:30:00"),
    },
    {
      company: 'Caviar', date: "2015-11-26",
      startsAt: new Date("November 25, 2015 8:00:00"),
      endsAt: new Date("November 25, 2015 11:00:00"),
    },
    {
      company: 'Instacart', date: "2015-11-27",
      startsAt: new Date("November 26, 2015 07:00:00"),
      endsAt: new Date("November 26, 2015 10:00:00"),
    },
    {
      company: 'Luxe', date: "2015-11-27",
      startsAt: new Date("November 26, 2015 11:00:00"),
      endsAt: new Date("November 26, 2015 14:00:00"),
    },
    {
      company: 'Caviar', date: "2015-11-29",
      startsAt: new Date("November 28, 2015 12:00:00"),
      endsAt: new Date("November 28, 2015 16:00:00"),
    },
    {
      company: 'Luxe', date: "2015-11-30",
      startsAt: new Date("November 29, 2015 8:00:00"),
      endsAt: new Date("November 29, 2015 11:30:00"),
    },
  ];
  $scope.cancelWarning = function (shift, group, shifts) {
    $scope.shiftToCancel = shift;
    $ionicPopup.show({
      template: '<p>Late cancellations this quarter: {{cancellations}}/3</p><img ng-src="img/companies/{{shiftToCancel.company.toLowerCase()}}.png" alt=""><p class="schedule-time"><standard-time-meridian etime="shiftToCancel.startsAt.getHours()*3600"></standard-time-meridian> - <standard-time-meridian etime="shiftToCancel.endsAt.getHours()*3600"></standard-time-meridian></p>',
      title: 'Are you sure you want to cancel the following shift?',
      scope: $scope,
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
          text: 'No, Leave it',
          type: 'button-default'
        }, {
          text: 'Yes, Cancel',
          type: 'button-assertive',
          onTap: function(e) {
            // Returning a value will cause the promise to resolve with the given value.
            // return $scope.cancellations;
            $scope.cancelShift(shift, group, shifts);
          }
        }]
    }).then(function(res) {
      console.log('Tapped!', res);
    });
  }

  $scope.cancelShift = function (shift, group, shifts) {

    $scope.cancellations++;

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
  })
}
