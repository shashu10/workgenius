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
        $state.go('app.schedule-calendar-page');
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.forwardCache(true);

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
  .state('app.target-page', {
    url: '/target-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/target-page.html',
        controller: 'TargetCtrl'
      }
    }
  })

  .state('app.availability-page', {
    url: '/availability-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/availability-page.html',
        controller: 'AvailabilityCtrl'
      }
    }
  })

  .state('app.preferences-page', {
    url: '/preferences-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/preferences-page.html',
        controller: 'PreferencesCtrl'
      }
    }
  })

  .state('app.schedule-list-page', {
      url: '/schedule-list-page',
      views: {
        'menuContent': {
          templateUrl: 'templates/main/schedule-list-page.html'
        }
      }
    })

  .state('app.schedule-calendar-page', {
      url: '/schedule-calendar-page',
      views: {
        'menuContent': {
          templateUrl: 'templates/main/schedule-calendar-page.html'
        }
      }
    })

  // .state('app.login-page', {
  //     url: '/login-page',
  //     views: {
  //         'menuContent': {
  //             templateUrl: 'templates/main/login-page.html',
  //             controller: 'LoginController'
  //         }
  //     }
  // })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/login/tabs.html',
    controller: 'RegisterController'
  })

  // Each tab has its own nav history stack:

  .state('tab.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/login/login-tab.html',
        controller: 'LoginController'
      }
    }
  })

  .state('tab.forgot-password-page', {
      url: '/forgot-password-page',
      views: {
          'tab-login': {
              templateUrl: 'templates/main/forgot-password-page.html',
              controller: 'ForgotPasswordController'
          }
      }
  })
  .state('tab.register-account-info', {
      url: '/register-account-info',
      views: {
          'tab-register': {
              templateUrl: 'templates/login/register-account-info.html',
          }
      }
  })
  .state('tab.register-companies', {
      url: '/register-companies',
      views: {
          'tab-register': {
              templateUrl: 'templates/login/register-companies.html',
          }
      }
  })
  .state('tab.register-schedule', {
      url: '/register-schedule',
      views: {
          'tab-register': {
              templateUrl: 'templates/login/register-schedule.html',
          }
      }
  })
  .state('tab.register-target-hours', {
      url: '/register-target-hours',
      views: {
          'tab-register': {
              templateUrl: 'templates/login/register-target-hours.html',
          }
      }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');
  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/app/login-page');
});
