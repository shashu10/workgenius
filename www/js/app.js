// Ionic Workgenius App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'workgenius' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'workgenius.controllers' is found in controllers.js
angular.module('workgenius', [
    'ionic',
    'ngCordova',
    'workgenius.registration',
    'workgenius.onboarding',
    'workgenius.controllers',
    'workgenius.directives',
    'workgenius.services',
    'workgenius.constants',
    'workgenius.filters',
    'parseData',
    'phoneFormatting',
    'ionic-timepicker',
    'flexcalendar',
    'pascalprecht.translate',
    'ngIOS9UIWebViewPatch',
    'templatescache',
    // 'ionic.service.core',
    // 'ionic.service.analytics'
  ])

.run(['$ionicPlatform', '$rootScope', '$state', '$cordovaStatusbar', 'getUserData',
  function($ionicPlatform, $rootScope, $state, $cordovaStatusbar, getUserData) {
    $ionicPlatform.ready(function() {

      // $ionicAnalytics.register();

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        // StatusBar.styleDefault();
        
        // Does not really work
        $cordovaStatusbar.overlaysWebView(true);
        $cordovaStatusBar.style(1);
      }
      // Variables defined here are hidden in their own scope.
    });
    
    // Initialize Parse here with AppID and JavascriptID
    Parse.initialize("cvvuPa7IqutoaMzFhVkULVPwYL6tI4dlCXa6UmGT", "JCq8yzqkFSogmE9emwBlbmTUTEzafbhpX0ro2Y1l");

    if (Parse.User.current()) {
      // $state.go('app.schedule-calendar-page');
    }

    // Setup variables used through out the app
    $rootScope.hourlyRate = 15;
    $rootScope.imageURL = "img/profile_default.jpg";
    $rootScope.cancellations = 0;
    $rootScope.intervals = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p','12a','1a'];
    $rootScope.days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
    $rootScope.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    $rootScope.phoneVal = "4159365883";

    $rootScope.companyList = [
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

    // Flex cal error displays one day behind
    $rootScope.shifts = [
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
    // Get user data and store it in the rootscope.
    getUserData();
  }])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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

  .state('app.earnings-page', {
     url: '/earnings-page',
     views: {
         'menuContent': {
             templateUrl: 'templates/main/earnings-page.html',
             controller: "EarningsController"
         }
     }
  })
  .state('app.hours-page', {
     url: '/hours-page',
     views: {
         'menuContent': {
             templateUrl: 'templates/main/hours-page.html',
             controller: "EarningsController"
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
  .state('app.vehicles-page', {
    url: '/vehicles-page',
    views: {
      'menuContent': {
        templateUrl: 'templates/main/vehicles-page.html',
        controller: 'VehiclesCtrl'
      }
    }
  })

  .state('app.availability-tabs', {
    url: "/availability-tabs",
    views: {
      'menuContent': {
        templateUrl: "templates/availability/availability-tabs.html",
      }
    }
  })

  .state('app.availability-tabs.availability', {
    url: '/availability',
    views: {
      'content': {
        templateUrl: 'templates/availability/availability.html',
        controller: 'AvailabilityCtrl'
      }
    }
  })
  .state('app.availability-tabs.block-days', {
    url: '/block-days',
    views: {
      'content': {
        templateUrl: 'templates/availability/block-days.html',
        controller: 'BlockDaysCtrl'
      }
    }
  })

  //  - - - - End - - - -

  // Login/Registration Tabs

  // setup an abstract state for the tabs directive
  .state('registration', {
    url: '/registration',
    abstract: true,
    templateUrl: 'templates/registration/registration.html',
    controller: 'RegisterCtrl' // Needs to persist across register pages
  })
  
  .state('registration.signup', {
    url: '/signup',
    views: {
      'content': {
        templateUrl: 'templates/registration/signup-tab.html',
        controller: 'SignupCtrl'
      }
    }
  })

  .state('registration.login', {
    url: '/login',
    views: {
      'content': {
        templateUrl: 'templates/registration/login-tab.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('registration.forgot-password-page', {
      url: '/forgot-password-page',
      views: {
          'content': {
              templateUrl: 'templates/registration/forgot-password-page.html',
              controller: 'ForgotCtrl'
          }
      }
  })
  
  //  - - - - End Registration - - - -

  // Onboarding Views

  // setup an abstract state for the tabs directive
  .state('onboarding', {
    url: '/onboarding',
    abstract: true,
    templateUrl: 'templates/onboarding/onboarding.html',
    controller: 'OnboardingCtrl' // Needs to persist across register pages
  })
  .state('onboarding.target-hours', {
      url: '/target-hours',
      views: {
          'content': {
              templateUrl: 'templates/onboarding/target-hours.html',
              controller: 'TargetCtrl'
          }
      }
  })
  .state('onboarding.work-types', {
      url: '/work-types',
      views: {
          'content': {
              templateUrl: 'templates/onboarding/work-types.html',
              controller: 'WorkTypesCtrl'
          }
      }
  })
  .state('onboarding.availability-questions', {
      url: '/availability-questions',
      views: {
          'content': {
              templateUrl: 'templates/onboarding/availability-questions.html',
              controller: 'AvailabilityQuestionsCtrl'
          }
      }
  })
  .state('onboarding.availability', {
      url: '/availability',
      views: {
          'content': {
              templateUrl: 'templates/onboarding/availability.html',
              controller: 'AvailabilityCtrl'
          }
      }
  });

  //  - - - - End Onboarding - - - -

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/registration/signup');
}]);
