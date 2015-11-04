// Ionic Workgenius App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'workgenius' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'workgenius.controllers' is found in controllers.js
angular.module('workgenius', [
    'ionic',
    'ngCordova',
    'workgenius.onboarding',
    'workgenius.controllers',
    'workgenius.directives',
    'parseData',
    'workgenius.filters',
    'ionic-timepicker',
    'flexcalendar',
    'pascalprecht.translate',
    'ngIOS9UIWebViewPatch',
    'templatescache',
  ])

.run(function($ionicPlatform, $rootScope, $state, getUserData) {
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
    // Variables defined here are hidden in their own scope.
  });
  
  // Initialize Parse here with AppID and JavascriptID
  Parse.initialize("cvvuPa7IqutoaMzFhVkULVPwYL6tI4dlCXa6UmGT", "JCq8yzqkFSogmE9emwBlbmTUTEzafbhpX0ro2Y1l");

  $rootScope.currentUser = Parse.User.current() || {};
  if ($rootScope.currentUser && Parse.User.current()) {
    $rootScope.currentUser.email = Parse.User.current().get('email');
    $rootScope.currentUser.hourlyTarget = 40;
    $state.go('app.schedule-calendar-page');
  } else {
    $rootScope.currentUser.hourlyTarget = 40;
    $rootScope.currentUser.name = 'John Smith';
  }
  if (!$rootScope.hourlyRate) {
    $rootScope.hourlyRate = 15;
  }
  if (!$rootScope.currentUser.availability) {
    $rootScope.currentUser.availability = {};
    $rootScope.totalHours = 0;
  }
  if (!$rootScope.imageURL)
    $rootScope.imageURL = "img/profile_default.jpg";
  if (!$rootScope.currentUser.companies) {
    $rootScope.currentUser.companies = {};
  }

  getUserData();

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  // $ionicConfigProvider.views.forwardCache(true);

  $stateProvider

  // Main Side Menu pages

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
  })

  // Main Pages

  .state('app.stats-page', {
     url: '/stats-page',
     views: {
         'menuContent': {
             templateUrl: 'templates/main/stats-page.html',
             controller: "StatsController"
         }
     }
  })
  .state('app.available-shifts-page', {
    url: '/available-shifts-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/available-shifts-page.html',
        controller: "ShiftsCtrl"
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
  .state('app.schedule-list-page', {
    url: '/schedule-list-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/schedule-list-page.html'
      }
    }
  })
  .state('app.preferences-page', {
    url: '/preferences-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/preferences-page.html'
      }
    }
  })

  // Sub Views

  .state('app.target-page', {
    url: '/target-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/target-page.html',
        controller: 'TargetCtrl'
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
  .state('app.availability-page', {
    url: '/availability-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/availability-page.html',
        controller: 'AvailabilityCtrl'
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

  //  - - - - End - - - -

  // Login/Registration Tabs

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/login/tabs.html',
    controller: 'RegisterCtrl' // Needs to persist across register pages
  })

  // Each tab has its own nav history stack:

  .state('tab.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/login/login-tab.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('tab.forgot-password-page', {
      url: '/forgot-password-page',
      views: {
          'tab-login': {
              templateUrl: 'templates/main/forgot-password-page.html',
              controller: 'ForgotCtrl'
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
              controller: 'TargetCtrl'
          }
      }
  });

  //  - - - - End Login/Registration Tabs - - - -

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');
});
