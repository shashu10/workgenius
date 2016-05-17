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
    'workgenius.claimShifts',
    'parseData',
    'parseUtils',
    'parseShifts',
    'integrations',
    'phoneFormatting',
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

.run(['$rootScope', '$state', 'getUserData', 'getCompanyData', 'getShifts', '$interval', 'updateAppSettings', '$ionicHistory', 'ios_modes_map', 'connectedShifts', 'PtrService',
    function($rootScope, $state, getUserData, getCompanyData, getShifts, $interval, updateAppSettings, $ionicHistory, ios_modes_map, connectedShifts, PtrService) {

        // ionic platform should be ready now
        if (window.location.hostname !== 'localhost') $state.go('splash');

        // Initialize Parse here with AppID and JavascriptID
        Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

        // Setup variables used through out the app
        $rootScope.device = {
            platform: '',
            model: '',
            carrier: ''
        };
        $rootScope.appVersion = "9.9.9";
        // $rootScope.hourlyRate = 15; // For when we don't have the actual earnings
        // $rootScope.imageURL = "img/profile_default.jpg";
        $rootScope.days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        $rootScope.availabilityLock = {
            // Using ISO day numbers Monday - 1, Sunday - 7
            // Users cannot edit their availability in App on or after start day
            start: "Sunday",
            // and on or before end day
            end: "Sunday",
            disableLock: true,
        };
                
        // // Testing on the browser. Unregister tracking and error logging.
        // if (!ionic.Platform.isWebView()) {
        //     mixpanel.register({ "$ignore": true });
        //     Raven.uninstall();
        // }

        // $ionicAnalytics.register();
        // Reload shifts if sent to background and reopened
        document.addEventListener("resume", reloadConnectedShifts, false);

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.cordova && window.cordova.getAppVersion) {
            cordova.getAppVersion.getVersionNumber().then(function(version) {
                $rootScope.appVersion = version;

                var platform = "localhost";
                if (window.device && window.device.platform){
                    console.log('got device info');
                    platform = device.platform.toLowerCase();
                    $rootScope.device = angular.copy(device);
                    if (platform === 'ios') // Converts iPhone "iPhone7,2" to "iPhone 6"
                        $rootScope.device.model = ios_modes_map[device.model] || device.model;
                    $rootScope.prefilledDevice = true;
                    console.log(device);
                }

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

            var transition;

            // Don't transition anywhere if testing on localhost.
            if (window.location.hostname === 'localhost' && window.location.hash !== "") {}

            // If on a device disable transition and go straight to the right view.
            else if (window.location.hash === "" || window.location.hash === "#/splash") {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                if (user)
                    transition = $state.go('app.schedule', {clear: true});
                else
                    transition = $state.go('registration.signup', {clear: true});

            // Default case
            } else {
                transition = $state.go('registration.signup', {clear: true});
            }

            // After transitioning to the right state, reload connected shifts to trigger refresh spinner
            if (transition) {
                transition.then(function () {

                    // Wait for dom to render
                    $interval(function () {
                        // hide splash screen
                        if (navigator && navigator.splashscreen) navigator.splashscreen.hide();
                        reloadConnectedShifts();

                    // What's the magic number?
                    }, 400, 1);
                });
            }

        }, function (error) {
            $state.go('registration.signup', {clear: true});
        });

        //////////

        function reloadConnectedShifts() {
            console.log('resumed app');

            // Refresh connected and available shifts. Show refresh spinner if on the right page
            if ($state.current.name.indexOf('app.schedule') > -1)
                PtrService.triggerPtr('scheduleScroll');
            else
                connectedShifts.getAllScheduled();

            if ($state.current.name.indexOf('app.claim-days') > -1)
                PtrService.triggerPtr('claimDaysScroll');
            else
                connectedShifts.getAllAvailable();

        }
    }
])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$analyticsProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $analyticsProvider) {

        $ionicConfigProvider.tabs.position('bottom');
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
            templateUrl: 'templates/tabs.html',
            controller: 'MenuCtrl'
        })

        .state('app.preferences', {
            url: '/preferences',
            views: {
                'tab-preferences': {
                    templateUrl: 'templates/main/preferences.html'
                }
            }
        })

        .state('app.schedule', {
            url: '/schedule',
            views: {
                'tab-schedule': {
                    templateUrl: 'templates/main/schedule.html'
                }
            }
        })

        // EARNINGS //

        .state('app.earnings', {
            url: '/earnings',
            views: {
                'tab-preferences': {
                    templateUrl: 'templates/main/earnings.html',
                    // controller: "EarningsController"
                }
            }
        })

        .state('app.hours', {
            url: '/hours',
            views: {
                'tab-preferences': {
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
                'tab-preferences': {
                    templateUrl: 'templates/main/vehicles.html',
                    // controller: 'VehiclesCtrl'
                }
            }
        })

        .state('app.device-type-page', {
            url: '/device-type-page',
            views: {
                'tab-preferences': {
                    templateUrl: 'templates/main/device-type-page.html',
                }
            }
        })

        .state('app.personal-info', {
            url: '/personal-info',
            views: {
                'tab-preferences': {
                    templateUrl: 'templates/main/personal-info.html',
                    controller: 'PersonalInfoPageCtrl'
                }
            }
        })

        .state('app.connect-accounts', {
            url: '/connect-accounts',
            views: {
                'tab-connect-accounts': {
                    templateUrl: 'templates/main/connect-accounts.html',
                    controller: 'ConnectAccountsCtrl'
                }
            }
        })

        // Claim Shifts //

        .state('app.claim-days', {
            url: '/claim-days',
            views: {
                'tab-claim-days': {
                    templateUrl: 'templates/main/claim-days.html',
                    controller: 'ClaimDaysCtrl'
                }
            }
        })

        .state('app.claim-shifts', {
            url: '/claim-shifts/:index',
            views: {
                'tab-claim-days': {
                    templateUrl: 'templates/main/claim-shifts.html',
                    controller: 'ClaimShiftsCtrl'
                }
            }
        })

        .state('app.claim-group-detail', {
            url: '/claim-group-detail',
            views: {
                'tab-claim-days': {
                    templateUrl: 'templates/main/claim-group-detail.html',
                    controller: 'ClaimGroupDetailCtrl'
                }
            }
        })

        .state('app.claim-detail', {
            url: '/claim-detail',
            views: {
                'tab-claim-days': {
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
                'tab-preferences': {
                    templateUrl: "templates/availability/availability-tabs.html",
                    controller: 'AvailabilityTabsCtrl'
                }
            }
        })

        .state('app.availability', {
            url: '/availability',
            views: {
                'tab-preferences': {
                    templateUrl: 'templates/availability/availability.html',
                    controller: 'AvailabilityCtrl'
                }
            }
        })

        .state('app.block-days', {
            url: '/block-days',
            views: {
                'tab-preferences': {
                    templateUrl: 'templates/availability/block-days.html',
                    controller: 'BlockDaysCtrl'
                }
            }
        })

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

        .state('onboarding.personal-info', {
            url: '/personal-info',
            views: {
                'content': {
                    templateUrl: 'templates/onboarding/personal-info.html',
                    controller: 'PersonalInfoCtrl'
                }
            }
        })

        .state('onboarding.vehicle-type', {
            url: '/vehicle-type',
            views: {
                'content': {
                    templateUrl: 'templates/onboarding/vehicle-type.html',
                    controller: 'VehicleTypeCtrl'
                }
            }
        })

        .state('onboarding.device-type', {
            url: '/device-type',
            views: {
                'content': {
                    templateUrl: 'templates/onboarding/device-type.html',
                    controller: 'DeviceTypeCtrl'
                }
            }
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
