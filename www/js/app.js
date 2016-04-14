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
    'workgenius.schedule',
    'workgenius.availability',
    'parseData',
    'parseUtils',
    'integrations',
    'phoneFormatting',
    'ionic-timepicker',
    'angular.filter',
    'ioncal',
    'pascalprecht.translate',
    'ngIOS9UIWebViewPatch',
    'templatescache',
    'angulartics',
    'angulartics.mixpanel',
    'ngRaven',
    // 'workgenius.tracker',
    // 'ionic.service.core',
    // 'ionic.service.analytics'
])

.run(['$rootScope', '$state', 'getUserData', 'getCompanyData', 'getShifts', '$interval', 'updateAppSettings', '$ionicHistory',
    function($rootScope, $state, getUserData, getCompanyData, getShifts, $interval, updateAppSettings, $ionicHistory) {

        // ionic platform should be ready now
        $state.go('splash');

        // Initialize Parse here with AppID and JavascriptID
        Parse.initialize("cvvuPa7IqutoaMzFhVkULVPwYL6tI4dlCXa6UmGT", "JCq8yzqkFSogmE9emwBlbmTUTEzafbhpX0ro2Y1l");

        // Setup variables used through out the app
        $rootScope.appVersion = "9.9.9";
        // $rootScope.hourlyRate = 15; // For when we don't have the actual earnings
        // $rootScope.imageURL = "img/profile_default.jpg";
        $rootScope.days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

                
        // Testing on the browser. Unregister tracking and error logging.
        if (!ionic.Platform.isWebView()) {
            mixpanel.register({ "$ignore": true });
            Raven.uninstall();
        }

        // $ionicAnalytics.register();
        // Reload shifts if sent to background and reopened
        document.addEventListener("resume", onResume, false);

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.cordova && window.cordova.getAppVersion) {
            cordova.getAppVersion.getVersionNumber().then(function(version) {
                $rootScope.appVersion = version;

                var platform = "ios";
                if (window.device && window.device.platform) platform = device.platform.toLowerCase();

                updateAppSettings(version, platform);
            });

            // For localhost testing
        } else {
            $rootScope.appVersion = undefined;
            updateAppSettings("1.1.1", "");
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            // not working
            StatusBar.overlaysWebView(true);
            StatusBar.styleDefault();
        }

        // Update the company data
        getCompanyData();
        // Get user data and store it in the rootscope.
        // Goto correct state after deviceready
        getUserData().then(function(user) {

            if (window.location.hash === "" || window.location.hash === "#/splash") {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                if (user)
                    $state.go('app.schedule', {clear: true});
                else
                    $state.go('registration.signup', {clear: true});
            } else {
                $state.go('registration.signup', {clear: true});
            }

        }, function (error) {
            $state.go('registration.signup', {clear: true});
        });

        //////////

        function onResume() {
            console.log('resumed app');

            if ($state.current.name.indexOf('app.schedule') > -1) {
                getShifts().then(function(shifts) {
                    $rootScope.currentUser.shifts = shifts;

                    // If user is logged in, update scope
                    if (Parse.User.current()) $rootScope.$apply();
                });
            }
        }
    }
])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$analyticsProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $analyticsProvider) {
        // $ionicConfigProvider.views.forwardCache(true);

        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true); /* Records full path */

        $stateProvider

        // Main Side Menu pages

            .state('splash', {
            url: '/splash',
            templateUrl: 'templates/main/splash.html',
        })


        // ============ //
        //     APP      //
        // ============ //

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'MenuCtrl'
        })

        .state('app.preferences', {
            url: '/preferences',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/preferences.html'
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

        // EARNINGS //

        .state('app.earnings', {
            url: '/earnings',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/earnings.html',
                    // controller: "EarningsController"
                }
            }
        })

        .state('app.hours', {
            url: '/hours',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/hours.html',
                    // controller: "EarningsController"
                }
            }
        })

        // SUB VIEWS TABS //

        .state('app.target', {
            url: '/target',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/target.html',
                    // controller: 'TargetCtrl'
                }
            }
        })

        .state('app.companies', {
            url: '/companies',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/companies.html',
                    controller: 'CompaniesCtrl'
                }
            }
        })

        .state('app.vehicles', {
            url: '/vehicles',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/vehicles.html',
                    // controller: 'VehiclesCtrl'
                }
            }
        })

        .state('app.connect-accounts', {
            url: '/connect-accounts',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/connect-accounts.html',
                    controller: 'ConnectAccountsCtrl'
                }
            }
        })

        // Claim Shifts //

        .state('app.claim-days', {
            url: '/claim-days',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/claim-days.html',
                    controller: 'ClaimDaysCtrl'
                }
            }
        })

        .state('app.claim-shifts', {
            url: '/claim-shifts/:index',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/claim-shifts.html',
                    controller: 'ClaimShiftsCtrl'
                }
            }
        })

        .state('app.claim-detail', {
            url: '/claim-detail/:shift',
            views: {
                'menuContent': {
                    templateUrl: 'templates/main/claim-detail.html',
                    controller: 'ClaimDetailCtrl'
                }
            }
        })

        // AVAILABILITY TABS //

        .state('app.availability-tabs', {
            abstract: true,
            url: "/availability-tabs",
            views: {
                'menuContent': {
                    templateUrl: "templates/availability/availability-tabs.html",
                    controller: 'AvailabilityTabsCtrl'
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

        // .state('app.available-shifts', {
        //   url: '/available-shifts',
        //   views: {
        //     'menuContent': {
        //       templateUrl: 'templates/main/available-shifts.html',
        //       controller: "AvailableShiftsCtrl"
        //     }
        //   }
        // })

        //  - - - - End Main App - - - -

        // ============ //
        // REGISTRATION //
        // ============ //

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

        .state('registration.forgot-password', {
            url: '/forgot-password',
            views: {
                'content': {
                    templateUrl: 'templates/registration/forgot-password.html',
                    controller: 'ForgotCtrl'
                }
            }
        })

        //  - - - - End Registration - - - -

        // ============ //
        //  ONBOARDING  //
        // ============ //

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
                    // controller: 'TargetCtrl'
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
        // $urlRouterProvider.otherwise('/registration/signup');

        // $urlRouterProvider.otherwise('/splash');
    }
]);
