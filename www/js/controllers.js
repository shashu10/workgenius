angular.module('workgenius.controllers', [])

.controller('MenuCtrl', function($rootScope, $scope, $state, $ionicHistory, getUserData) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.logout = function() {
      Parse.User.logOut();
      $rootScope.currentUser = null;
      
      getUserData();

      $ionicHistory.nextViewOptions({
          historyRoot: true
      });
      $state.go('tab.login', {
          clear: true
      });
  };

  // Schedule calendar / list toggle

  $scope.showRightIcon = ($state.current.name == "app.schedule-calendar-page" || $state.current.name == "app.schedule-list-page");
  $scope.showCalendarIcon = $state.current.name == "app.schedule-list-page";

  // $scope.currentState = "abc";
  $scope.$on('$stateChangeSuccess', function(event, current) {
    if (current.name == "app.schedule-calendar-page" || current.name == "app.schedule-list-page") {
      $scope.showRightIcon = true;
      $scope.showCalendarIcon = (current.name !== "app.schedule-calendar-page");
    } else {
      $scope.showRightIcon = false;
    }
  });

  $scope.showScheduleCalendar = function () {
    $scope.toggleWithoutAnimation('schedule-calendar-page');
  };
  $scope.showScheduleList = function () {
    $scope.toggleWithoutAnimation('schedule-list-page');
  };
  $scope.toggleWithoutAnimation = function(state) {
    $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableAnimate: true
    });
    $state.go('app.' + state, {
        clear: true
    });
  };
  // End
})

.controller('AvailabilityCtrl', function($rootScope, $scope, $state, $ionicModal, timePicker, setUserData) {

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
      for (var day in $rootScope.currentUser.availability) {
        for (var sched in $rootScope.currentUser.availability[day]) {
          var entry = $rootScope.currentUser.availability[day][sched];
          totalHours += (entry.endsAt.inputEpochTime - entry.startsAt.inputEpochTime)/3600;
        }
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
})
.controller('VehiclesCtrl', function($rootScope, $scope, $state, setUserData) {
    $scope.update = setUserData.vehicles;
})
.controller('CompaniesCtrl', function($rootScope, $scope, $state, setUserData) {
  
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

    var chunk = function (arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    };

    $scope.chunkedCompanies = chunk(companyList, 3);

    $scope.update = setUserData.companies;

    $scope.select = function(name) {
      if ($rootScope.currentUser.companies[name])
        delete $rootScope.currentUser.companies[name];
      else
        $rootScope.currentUser.companies[name] = true;

      $scope.update();
    };
})

.controller('TargetCtrl', function($scope, $rootScope, setUserData) {
  $scope.update = setUserData.target;
})

.controller('ShiftsCtrl', function($rootScope, $scope, $state, $ionicModal) {

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

})
.controller('StatsController', [ '$scope', '$state', function($scope, $state) {
}])

.controller('ScheduleCtrl', ['$scope', function($scope, $rootScope) {

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
    dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true,//set monday as first day of week. Default is false
    eventClick: function(event) {
      $scope.truncateShiftsList(event);
    },
    dateClick: function(event) {
      $scope.truncateShiftsList(event);
    },
    changeMonth: function(month, year) {
      var mo = month.index + 1;
      var event = new Date(year + "-" + mo + "-" + "01");
      $scope.truncateShiftsList({date: event});
    },
  };
  $scope.truncateShiftsList = function (event) {
    var eventDate = new Date(event.date);

    var grouped = groupBy($scope.shifts, function(item){return [item.date];});
    for (var i = 0; i< grouped.length; i++) {
      var thisDate = new Date(grouped[i][0].date);
      if (eventDate.getYear() > thisDate.getYear()) {
        $scope.groupedShifts = [];
        console.log('after year');
        return;
      }
      if (eventDate.getYear() < thisDate.getYear() || eventDate.getMonth() < thisDate.getMonth()) {
        $scope.groupedShifts = grouped.splice(i);
        console.log('before year and/or month');
        return;
      }
      if (eventDate.getMonth() == thisDate.getMonth() && eventDate.getYear() == thisDate.getYear()) {
        if (eventDate.getDate() <= thisDate.getDate()) {
          $scope.groupedShifts = grouped.splice(i);
          console.log('same year & month, before date');
          return;
        }
      }

    }
    $scope.groupedShifts = [];
  };
  // Flex cal error displays one day behind
  $scope.shifts = [
    {
      company: 'Instacart', date: "2015-11-23",
      startsAt: new Date("November 22, 2015 07:00:00"),
      endsAt: new Date("November 22, 2015 10:00:00"),
    },
    {
      company: 'Bento', date: "2015-11-23",
      startsAt: new Date("November 22, 2015 11:00:00"),
      endsAt: new Date("November 22, 2015 14:00:00"),
    },
    {
      company: 'Saucey', date: "2015-11-25",
      startsAt: new Date("November 24, 2015 13:00:00"),
      endsAt: new Date("November 24, 2015 14:30:00"),
    },
    {
      company: 'Caviar', date: "2015-11-26",
      startsAt: new Date("November 25, 2015 8:00:00"),
      endsAt: new Date("November 25, 2015 11:30:00"),
    },
    {
      company: 'Luxe', date: "2015-11-27",
      startsAt: new Date("November 26, 2015 07:00:00"),
      endsAt: new Date("November 26, 2015 10:00:00"),
    },
    {
      company: 'Munchery', date: "2015-11-27",
      startsAt: new Date("November 26, 2015 11:00:00"),
      endsAt: new Date("November 26, 2015 14:00:00"),
    },
    {
      company: 'Shyp', date: "2015-11-29",
      startsAt: new Date("November 28, 2015 13:00:00"),
      endsAt: new Date("November 28, 2015 14:30:00"),
    },
    {
      company: 'Sprig', date: "2015-11-30",
      startsAt: new Date("November 29, 2015 8:00:00"),
      endsAt: new Date("November 29, 2015 11:30:00"),
    },
  ];
  $scope.deleteShift = function (shift, group, shifts) {
    var idx = group.indexOf(shift);
    if (group.length === 1) {
      
      idx = shifts.indexOf(group);
      shifts.splice(idx, 1);
      group.splice(idx, 1);
    } else {

      group.splice(idx, 1);
    }
  };
  $scope.groupedShifts = groupBy($scope.shifts, function(item){return [item.date];});

}])

.controller('ScheduleListCtrl', ['$scope', function($scope) {
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
