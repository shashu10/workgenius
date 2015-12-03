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
    
  $rootScope.workTypes = [
    {
        name:'Meal',
        title: 'Meal Delivery',
        selected: true,
        icon: "ion-pizza",
        requirements : ['car', 'bike', '18+'],
        companies: {
          caviar : {
            available: true,
            info: 'Description',
            longInfo: 'Deliver food from local restaurants'
          },
          bento : {
            available: true,
            info: 'Description',
            longInfo: 'Assemble and deliver asian Bento boxes'
          },
          munchery : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver meals cooked by Munchery\'s own chefs'
          },
          doordash : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver from local restaurants'
          },
          sprig : {
            available: false,
            info: 'Description',
            longInfo: 'Healthy food delivered from Sprig\'s own chefs'
          },
          spoonrocket : {
            available: false,
            info: 'Description',
            longInfo: 'Chef cooked meals delivered in under 20 minutes'
          },
          // postmates : {
          //   available: false,
          //   info: 'Description',
          //   longInfo: 'Deliver mostly food but also other items for poeple around the city'
          // },
        }
      },{
        name:'Rideshare',
        title: 'Ridesharing Jobs',
        selected: true,
        icon: "ion-android-car",
        requirements : ['car', 'bike', '18+'],
        companies: {
          lyft : {
            available: true,
            info: 'Description',
            longInfo: 'Drive people to their desired destinations'
          },
          uber : {
            available: false,
            info: 'Description',
            longInfo: 'Drive people to their desired destinations'
          },
          sidecar : {
            available: false,
            info: 'Description',
            longInfo: 'Help small businesses deliver their goods to their customers'
          },
          carma : {
            available: false,
            info: 'Description',
            longInfo: 'Drive your neighbors to their work place through carpooling'
          },
        }
      },{
        name:'Grocery',
        title: 'Grocery Delivery',
        selected: true,
        icon: "ion-ios-nutrition",
        requirements : ['car', 'bike', '18+'],
        companies: {
          instacart : {
            available: true,
            info: 'Description',
            longInfo: 'Buy, pack and delkiver groceries to customers from various grocery stores'
          },
          good_eggs : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver groceries from local producers to customers'
          },
          amazon_fresh : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver groceries and household items to customers'
          },
          google_express : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver groceries and household items to customers'
          },
        }
      },{
        name:'Alcohol',
        title: 'Alcohol Delivery',
        selected: true,
        icon: "ion-beer",
        requirements : ['car', 'bike', '18+'],
        companies: {
          saucey : {
            available: true,
            info: 'Description',
            longInfo: 'Deliver alsohol, tobacco and snacks to thirsty customers. It\'s always 5pm!'
          },
          thirstie : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver alcohol to thirsty customers'
          },
          swill : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver alcohol to thirsty customers'
          },
        }
      },{
        name:'Package',
        title: 'Package Delivery',
        selected: true,
        icon: "ion-cube",
        requirements : ['car', 'bike', '18+'],
        companies: {
          shyp : {
            available: true,
            info: 'Description',
            longInfo: 'Pickup packages from customers'
          },
          doorman : {
            available: false,
            info: 'Description',
            longInfo: 'Deliver packages to customers'
          },
        }
      },{
        name:'Valet',
        title: 'Valet Services',
        selected: true,
        icon: "ion-key",
        requirements : ['car', 'bike', '18+'],
        companies: {
          luxe : {
            available: true,
            info: 'Description',
            longInfo: 'Meet customers curb side, park their cars and deliver it back when requested'
          },
          zirx : {
            available: false,
            info: 'Description',
            longInfo: 'Meet customers curb side, park their cars and deliver it back when requested'
          },
        }
      },
      // {
      //   name:'Marijuana',
      //   title: 'Medical Marijuana Delivery',
      //   selected: true,
      //   icon: "ion-ios-flower-outline",
      //   requirements : ['car', 'bike', '18+'],
      //   companies: {
      //     meadow : {
      //       available: false,
      //       info: 'Description',
      //       longInfo: 'Deliver medical marijuana to patients'
      //     },
      //     eaze : {
      //       available: false,
      //       info: 'Description',
      //       longInfo: 'Deliver medical marijuana to patients'
      //     },
      //     nugg : {
      //       available: false,
      //       info: 'Description',
      //       longInfo: 'Deliver medical marijuana to patients'
      //     },
      //   }
      // },
      // {
      //   name:'Pharmacy',
      //   selected: true,
      //   icon: "ion-medkit",
      //   requirements : ['car', 'bike', '18+'],
      //   companies: {
          
      //   }
      // }
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
      'inception': {
        templateUrl: 'templates/availability/availability.html',
        controller: 'AvailabilityCtrl'
      }
    }
  })
  .state('app.availability-tabs.block-days', {
    url: '/block-days',
    views: {
      'inception': {
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
              controller: 'AvailabilityCtrl'
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
