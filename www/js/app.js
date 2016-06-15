// Ionic Workgenius App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'workgenius' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'workgenius.controllers' is found in controllers.js
angular.module('workgenius', [
    // Typescript
    'wg.auth',
    'wg.wizard',
    'wg.apply',
    'wg.user',
    'wg.constants',

    'ionic',
    'ngCordova',
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
    'inputFormatter',
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
        document.addEventListener("resume", function () {
            mixpanel.track('Resumed app');
            reloadConnectedShifts();
        }, false);

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.cordova && window.cordova.getAppVersion) {
            cordova.getAppVersion.getVersionNumber().then(function(version) {

                trackNewAppVersion(version);

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
                    transition = $state.go('welcome', {clear: true});
                    // transition = $state.go('registration.signup', {clear: true});

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

        function trackNewAppVersion(version) {
            $rootScope.appVersion = version;
            // update app version in sentry and mixpanel
            var rvContext = Raven.getContext();
            rvContext = (rvContext && rvContext.user) || {};
            rvContext.appVersion = version;
            Raven.setUserContext(rvContext);
            mixpanel.people.set({"appVersion": version});
        }
    }
])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$analyticsProvider',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $analyticsProvider) {

        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.text('Back');
        // $ionicConfigProvider.views.forwardCache(true);

        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true); /* Records full path */

        $stateProvider

        // Main Side Menu pages

        // ============ //
        //     AUTH     //
        // ============ //

        .state('welcome', {
            url: '/welcome',
            templateUrl: 'auth/welcome/welcome.html',
        })

        .state('signup-name', {
            url: '/signup-name',
            templateUrl: 'auth/signup/name.html',
        })

        .state('signup-email', {
            url: '/signup-email',
            templateUrl: 'auth/signup/email.html',
        })

        .state('signup-password', {
            url: '/signup-password',
            templateUrl: 'auth/signup/password.html',
        })

        .state('login-email', {
            url: '/login-email',
            templateUrl: 'auth/login/email.html',
        })

        .state('login-password', {
            url: '/login-password',
            templateUrl: 'auth/login/password.html',
        })

        .state('login-forgot-password', {
            url: '/login-forgot-password',
            templateUrl: 'auth/login/forgot-password.html',
        })


        // ============ //
        //  ONBOARDING  //
        // ============ //

        .state('wizard-goal', {
            url: '/wizard-goal',
            templateUrl: 'wizard/goal/goal.html',
        })

        .state('wizard-availability-days', {
            url: '/wizard-availability-days',
            templateUrl: 'wizard/availability/availability-days.html',
        })

        .state('wizard-availability-times', {
            url: '/wizard-availability-times',
            templateUrl: 'wizard/availability/availability-times.html',
        })

        .state('wizard-vehicles', {
            url: '/wizard-vehicles',
            templateUrl: 'wizard/vehicles/vehicles.html',
        })

        .state('wizard-locations', {
            url: '/wizard-locations',
            templateUrl: 'wizard/locations/locations.html',
        })

        // ============ //
        //  APPLICATION //
        // ============ //

        .state('apply-phone', {
            url: '/apply-phone',
            templateUrl: 'apply/phone/phone.html',
        })

        .state('apply-address', {
            url: '/apply-address',
            templateUrl: 'apply/address/address.html',
        })

        .state('apply-lift', {
            url: '/apply-lift',
            templateUrl: 'apply/lift/lift.html',
        })

        .state('apply-car-info', {
            url: '/apply-car-info',
            templateUrl: 'apply/car/car-info.html',
        })

        .state('apply-car-documents', {
            url: '/apply-car-documents',
            templateUrl: 'apply/car/car-documents.html',
        })

        .state('apply-headshot', {
            url: '/apply-headshot',
            templateUrl: 'apply/headshot/headshot.html',
        })

        .state('apply-background-check-info', {
            url: '/apply-background-check-info',
            templateUrl: 'apply/background/background-check-info.html',
        })

        .state('apply-background-check-ssn', {
            url: '/apply-background-check-ssn',
            templateUrl: 'apply/background/background-check-ssn.html',
        })

        // ============ //
        //     APP      //
        // ============ //

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'tabs.html',
            controller: 'MenuCtrl'
        })

        .state('app.preferences', {
            url: '/preferences',
            views: {
                'tab-preferences': {
                    templateUrl: 'main/preferences.html'
                }
            }
        })

        .state('app.schedule', {
            url: '/schedule',
            views: {
                'tab-schedule': {
                    templateUrl: 'main/schedule.html'
                }
            }
        })

        // EARNINGS //

        .state('app.earnings', {
            url: '/earnings',
            views: {
                'tab-preferences': {
                    templateUrl: 'main/earnings.html',
                    // controller: "EarningsController"
                }
            }
        })

        .state('app.hours', {
            url: '/hours',
            views: {
                'tab-preferences': {
                    templateUrl: 'main/hours.html',
                    // controller: "EarningsController"
                }
            }
        })

        // SUB VIEWS TABS //

        .state('app.vehicles', {
            url: '/vehicles',
            views: {
                'tab-preferences': {
                    templateUrl: 'main/vehicles.html',
                    // controller: 'VehiclesCtrl'
                }
            }
        })

        .state('app.device-type-page', {
            url: '/device-type-page',
            views: {
                'tab-preferences': {
                    templateUrl: 'main/device-type-page.html',
                }
            }
        })

        .state('app.personal-info', {
            url: '/personal-info',
            views: {
                'tab-preferences': {
                    templateUrl: 'main/personal-info.html',
                    controller: 'PersonalInfoPageCtrl'
                }
            }
        })

        .state('app.connect-accounts', {
            url: '/connect-accounts',
            views: {
                'tab-connect-accounts': {
                    templateUrl: 'main/connect-accounts.html',
                    controller: 'ConnectAccountsCtrl'
                }
            }
        })

        // Claim Shifts //

        .state('app.claim-days', {
            url: '/claim-days',
            views: {
                'tab-claim-days': {
                    templateUrl: 'main/claim-days.html',
                    controller: 'ClaimDaysCtrl'
                }
            }
        })

        .state('app.claim-shifts', {
            url: '/claim-shifts/:index',
            views: {
                'tab-claim-days': {
                    templateUrl: 'main/claim-shifts.html',
                    controller: 'ClaimShiftsCtrl'
                }
            }
        })

        .state('app.claim-group-detail', {
            url: '/claim-group-detail',
            views: {
                'tab-claim-days': {
                    templateUrl: 'main/claim-group-detail.html',
                    controller: 'ClaimGroupDetailCtrl'
                }
            }
        })

        .state('app.claim-detail', {
            url: '/claim-detail',
            views: {
                'tab-claim-days': {
                    templateUrl: 'main/claim-detail.html',
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
                    templateUrl: "availability/availability-tabs.html",
                    controller: 'AvailabilityTabsCtrl'
                }
            }
        })

        .state('app.availability', {
            url: '/availability',
            views: {
                'tab-preferences': {
                    templateUrl: 'availability/availability.html',
                    controller: 'AvailabilityCtrl'
                }
            }
        })

        .state('app.block-days', {
            url: '/block-days',
            views: {
                'tab-preferences': {
                    templateUrl: 'availability/block-days.html',
                    controller: 'BlockDaysCtrl'
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        // $urlRouterProvider.otherwise('/registration/signup');

        // $urlRouterProvider.otherwise('/splash');
    }
]);
