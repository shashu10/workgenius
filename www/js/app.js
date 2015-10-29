// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'workgenius.controllers', 'workgenius.directives', 'workgenius.filters', 'flexcalendar' , 'pascalprecht.translate', 'ionic-timepicker', 'ionic.ion.autoListDivider'])

.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Initialize Parse here with AppID and JavascriptID
    Parse.initialize("cvvuPa7IqutoaMzFhVkULVPwYL6tI4dlCXa6UmGT", "JCq8yzqkFSogmE9emwBlbmTUTEzafbhpX0ro2Y1l");
    var currentUser = Parse.User.current();

    if (currentUser) {
        $rootScope.user = currentUser;
        $rootScope.isLoggedIn = true;
        $state.go('app.schedule');
    } else {
      $rootScope.user = null;
      $rootScope.isLoggedIn = false;
    }
    if (!$rootScope.pref) {
      $rootScope.pref = {};
    }
    if (!$rootScope.pref.hourlyTarget) {
      $rootScope.pref.hourlyTarget = 40;
    }
    if (!$rootScope.hourlyRate) {
      $rootScope.hourlyRate = 15;
    }
    if (!$rootScope.schedules) {
      $rootScope.schedules = {};
      $rootScope.totalHours = 0;
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
  })

  .state('app.shifts', {
    url: '/shifts',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/shifts.html',
        controller: "ShiftsCtrl"
      }
    }
  })
  .state('app.stats-page', {
       url: '/stats-page',
       views: {
           'menuContent': {
               templateUrl: 'templates/main/stats-page.html',
               controller: "StatsController"
           }
       }
  })
  .state('app.companies-page', {
    url: '/companies-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/companies-page.html',
        controller: 'CompaniesCtrl'
      }
    }
  })
  .state('app.vehicles-page', {
    url: '/vehicles-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/vehicles-page.html',
        controller: 'VehiclesCtrl'
      }
    }
  })
  .state('app.weeklyTarget', {
    url: '/weeklyTarget',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/weeklyTarget.html',
        controller: 'weeklyTargetCtrl'
      }
    }
  })

  .state('app.availability', {
    url: '/availability',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/availability.html',
        controller: 'AvailabilityCtrl'
      }
    }
  })

  .state('app.preferences', {
    url: '/preferences',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/preferences.html',
        controller: 'PreferencesCtrl'
      }
    }
  })

  .state('app.scheduleList', {
      url: '/scheduleList',
      views: {
        'menuContent': {
          templateUrl: 'templates/main/scheduleList.html'
        }
      }
    })

  .state('app.schedule', {
      url: '/schedule',
      views: {
        'menuContent': {
          templateUrl: 'templates/main/schedule.html'
        }
      }
    })

  .state('app.login', {
      url: '/login',
      views: {
          'menuContent': {
              templateUrl: 'templates/main/login.html',
              controller: 'LoginController'
          }
      }
  })

  .state('app.forgot', {
      url: '/forgot',
      views: {
          'menuContent': {
              templateUrl: 'templates/main/forgotPassword.html',
              controller: 'ForgotPasswordController'
          }
      }
  })

  .state('app.register', {
      url: '/register',
      views: {
          'menuContent': {
              templateUrl: 'templates/main/register.html',
              controller: 'RegisterController'
          }
      }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
