angular.module('workgenius.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $state, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.logout = function() {
      Parse.User.logOut();
      $rootScope.user = null;
      $rootScope.isLoggedIn = false;
      $ionicHistory.nextViewOptions({
          historyRoot: true
      });
      $state.go('app.schedule', {
          clear: true
      });
  };
})

.controller('AvailabilityCtrl', function($rootScope, $scope, $state, $ionicModal) {

    $scope.days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    
    // Required for modal initialization
    $scope.schedule = {
      id: "",
      repeatWeekly: true,
      editing: false,
      startsAt: newTimePickerObject(),
      endsAt: newTimePickerObject(),
      day: "",
    };
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/newSchedule.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.editSchedule = function (day, schedule) {

      $scope.schedule = schedule || {
        id: Math.random().toString(),
        repeatWeekly: false,
        startsAt: newTimePickerObject(),
        endsAt: newTimePickerObject(),
        day: day,
      };

      $scope.modal.show();
    };
    $scope.deleteSchedule = function (schedule) {
      $rootScope.totalHours -= ($scope.schedule.endsAt.inputEpochTime - $scope.schedule.startsAt.inputEpochTime)/3600;
      delete $rootScope.schedules[schedule.day][schedule.id];
    };
    $scope.saveDay = function () {
      if (!$rootScope.schedules[$scope.schedule.day]) {
        $rootScope.schedules[$scope.schedule.day] = {};
      }
      $rootScope.schedules[$scope.schedule.day][$scope.schedule.id] = $scope.schedule;
      $rootScope.totalHours += ($scope.schedule.endsAt.inputEpochTime - $scope.schedule.startsAt.inputEpochTime)/3600;
      $scope.modal.hide();
    };

    $scope.discardDay = function () {
      $scope.modal.hide();
    };

})

.controller('CompanyWhitelistCtrl', function($rootScope, $scope, $state) {
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

    if (!$rootScope.companies) {
      $rootScope.companies = {};
      for (var i=0; i<companyList.length; i++) {
        $rootScope.companies[companyList[i]] = false;
      }
    }

    var chunk = function (arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    };

    $scope.chunkedCompanies = chunk(companyList, 3);

    $scope.select = function(name) {
      $rootScope.companies[name] = !$rootScope.companies[name];
      console.log("select: " + name + ", " + $rootScope.companies[name]);
    };
})

.controller('PreferencesCtrl', function($rootScope, $scope, $state) {
})

.controller('weeklyTargetCtrl', function($rootScope, $scope, $state) {
})
.controller('TabsPageController', [ '$scope', '$state', function($scope, $state) {
        $scope.navTitle = 'Tab Page';

        $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.toggleMenu();
            }
        }];
    }])
.controller('LoginController', function($scope, $state, $rootScope, $ionicLoading, $ionicHistory) {
    $scope.user = {
        username: null,
        password: null
    };

    $scope.error = {};

    $scope.login = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = $scope.user;
        Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('app.schedule', {
                    clear: true
                });
            },
            error: function(user, err) {
                $ionicLoading.hide();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    $scope.error.message = 'Invalid login credentials';
                } else {
                    $scope.error.message = 'An unexpected error has ' +
                        'occurred, please try again.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.forgot = function() {
        $state.go('app.forgot');
    };
})

.controller('ForgotPasswordController', function($scope, $state, $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                // TODO: show success
                $ionicLoading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function() {
        $state.go('app.login');
    };
})

.controller('RegisterController', function($scope, $state, $ionicLoading, $rootScope, $ionicHistory) {
    $scope.user = {};
    $scope.error = {};

    $scope.register = function() {

        // TODO: add age verification step
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);


        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('app.schedule', {
                    clear: true
                });
            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
})

.controller('ScheduleCtrl', ['$scope', function($scope, $rootScope) {
    $scope.Math = window.Math;
    $scope.options = {
    defaultDate: "2015-08-06",
    minDate: "2015-01-01",
    maxDate: "2015-12-31",
    disabledDates: [
        "2015-06-22",
        "2015-07-27",
        "2015-08-13",
        "2015-08-15"
    ],
    dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true,//set monday as first day of week. Default is false
    eventClick: function(date) {
      console.log(date);
    },
    dateClick: function(date) {
      console.log(date);
    },
    changeMonth: function(month, year) {
      console.log(month, year);
    },
  };

  $scope.events = [
    {
      company: 'Instacart', date: "2015-08-20",
      startsAt: new Date("October 22, 2015 07:00:00"),
      endsAt: new Date("October 22, 2015 10:00:00"),
      guarantee: true,
    },
    {
      company: 'Bento', date: "2015-08-23",
      startsAt: new Date("October 22, 2015 11:00:00"),
      endsAt: new Date("October 22, 2015 14:00:00"),
      guarantee: true,
    },
    {
      company: 'Saucey', date: "2015-08-25",
      startsAt: new Date("October 24, 2015 13:00:00"),
      endsAt: new Date("October 24, 2015 14:30:00"),
      guarantee: false,
    },
  ];
}])

.controller('ScheduleListCtrl', ['$scope', function($scope) {
}]);

function newTimePickerObject () {
  return {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 12,  //Optional
      titleLabel: '12-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          this.inputEpochTime = val;
        }
      }
    };
}