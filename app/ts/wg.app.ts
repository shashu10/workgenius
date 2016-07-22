// Ionic Workgenius App

declare var IS_TESTING
declare var PARSE_APP_ID
declare var PARSE_JS_KEY

class WGAppRun {

    constructor(public $rootScope:    angular.IRootScopeService,
                public $state:        angular.ui.IStateService,
                public $interval:     angular.IIntervalService,
                public PtrService,
                public currentUser: CurrentUserService,
                public wgState: WGState,

                public wgShifts: WGShiftsService,
                public keyboardManager: KeyboardManagerService) {

        // Initialize Parse here with AppID and JavascriptID
        Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

        // Initialize local data
        currentUser.init();

        // Figure out which state to load
        initState();

        //////////////////

        $rootScope['days'] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        // $rootScope.availabilityLock = {
        //     // Using ISO day numbers Monday - 1, Sunday - 7
        //     // Users cannot edit their availability in App on or after start day
        //     start: "Sunday",
        //     // and on or before end day
        //     end: "Sunday",
        //     disableLock: true,
        // };

        // Reload shifts if sent to background and reopened
        document.addEventListener("resume", () => {
            mixpanel.track('Resumed app');
            reloadConnectedShifts();
        }, false);

        loadPlugins()

        /////////////////

        function loadPlugins() {
            if (IS_TESTING) return

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                // not working
                StatusBar.overlaysWebView(true);
                StatusBar.styleDefault();
            }
        }

        // Config does not have 'this' keyword so we need function definitions
        function reloadConnectedShifts() {

            // Refresh connected and available shifts. Show refresh spinner if on the right page
            if ($state.current.name.indexOf('app.schedule') > -1)
                PtrService.triggerPtr('scheduleScroll');
            else
                wgShifts.getAllScheduled();

            if ($state.current.name.indexOf('app.claim-days') > -1)
                PtrService.triggerPtr('claimDaysScroll');
            else
                wgShifts.getAllAvailable();

        }

        function initState() {

            if (IS_TESTING && window.location.hash !== "") return;

            let transition;

            if (currentUser.isLoggedIn) {
                console.log("logged in");
                // If not finished wizard, go to wizard
                if (currentUser.shouldFinishWizard) {
                    transition = wgState.goWithoutAnimate('wizard-goal');

                } else { // Go to main app
                    transition = wgState.goWithoutAnimate('app.schedule');
                }

            } else {

                console.log("not logged in");
                const curr = $state.current.name;
                // If not authenticated, user can go to auth pages
                if (_.includes(curr, 'welcome') ||  _.includes(curr, 'tutorial') || _.includes(curr, 'login') || _.includes(curr, 'signup')) {
                // Else user should be redirected to welcome
                } else {
                    transition = wgState.goWithoutAnimate('tutorial');
                }
            }

            // After transitioning to the right state, reload connected shifts to trigger refresh spinner
            if (transition) {
                transition.then(() => {

                    // Wait for dom to render
                    $interval(() => {
                        // hide splash screen
                        if (navigator && navigator.splashscreen) navigator.splashscreen.hide();
                        reloadConnectedShifts();

                    // What's the magic number?
                    }, 400, 1);
                });
            }
        }
    }
}

class WGAppConfig {

    constructor($stateProvider,
                $urlRouterProvider,
                $ionicConfigProvider,
                $analyticsProvider) {

        // $ionicConfigProvider.tabs.position('bottom');
        // $ionicConfigProvider.backButton.text('Back');
        // $ionicConfigProvider.views.forwardCache(true);

        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true); /* Records full path */

        $stateProvider

        .state('app',                    {url: '/app', abstract: true, templateUrl: 'tabs/tabs.html'})

        // Tabs
        .state('app.schedule',           {url: '/schedule',           views: {'tab-schedule':    {templateUrl: 'schedule/schedule.html'                  }}})
        .state('app.profile',            {url: '/profile',            views: {'tab-profile':     {templateUrl: 'profile/profile.html'                    }}})

        // Sub Views Tabs
        .state('app.info',               {url: '/info',               views: {'tab-profile':     {templateUrl: 'preferences/info/info.html'                   }}})
        .state('app.goal',               {url: '/goal',               views: {'tab-profile':     {templateUrl: 'preferences/goal/goal.html'              }}})
        .state('app.locations',          {url: '/locations',          views: {'tab-profile':     {templateUrl: 'preferences/locations/locations.html'    }}})
        .state('app.new-vehicle',        {url: '/new-vehicle',        views: {'tab-profile':     {templateUrl: 'preferences/vehicles/vehicles.html'      }}})
        .state('app.vehicle-list',       {url: '/vehicles',           views: {'tab-profile':     {templateUrl: 'preferences/vehicles/vehicles-list.html' }}})
        .state('app.documents',       {url: '/documents',           views: {'tab-profile':     {templateUrl: 'preferences/documents/documents.html' }}})
        .state('app.new-vehicle-make',       {url: '/vehicles-make',           views: {'tab-profile':     {templateUrl: 'preferences/vehicles/vehicle-info.html' }}})


        // Earnings
        .state('app.earnings',           {url: '/earnings',           views: {'tab-profile':     {templateUrl: 'main/earnings.html'                      }}})
        .state('app.hours',              {url: '/hours',              views: {'tab-profile':     {templateUrl: 'main/hours.html'                         }}})

        // Availability Tabs
        .state('app.availability',       {url: '/availability',       views: {'tab-profile':     {templateUrl: 'availability/availability.html'          }}})
        .state('app.block-days',         {url: '/block-days',         views: {'tab-profile':     {templateUrl: 'availability/block-days.html'            }}})

        // Claim Shifts
        .state('app.claim-days',         {url: '/claim-days',         views: {'tab-claim-days':  {templateUrl: 'claim/claim.html'                        }}})
        .state('app.claim-group-detail', {url: '/claim-group-detail', views: {'tab-claim-days':  {templateUrl: 'claim/claim-group-detail.html'           }}})
        .state('app.claim-detail',       {url: '/claim-detail',       views: {'tab-claim-days':  {templateUrl: 'claim/claim-detail.html'                 }}})

        // Application
        .state('app.phone',              {url: '/phone',              views: {'tab-companies':   {templateUrl: 'apply/phone/phone.html'                  }}})
        .state('app.address',            {url: '/address',            views: {'tab-companies':   {templateUrl: 'apply/address/address.html'              }}})
        .state('app.weight-limit',       {url: '/weight-limit',       views: {'tab-companies':   {templateUrl: 'apply/weight/weight-limit.html'          }}})
        .state('app.car-info',           {url: '/car-info',           views: {'tab-companies':   {templateUrl: 'apply/car/car-info.html'                 }}})
        .state('app.car-documents',      {url: '/car-documents',      views: {'tab-companies':   {templateUrl: 'apply/car/car-documents.html'            }}})
        .state('app.headshot',           {url: '/headshot',           views: {'tab-companies':   {templateUrl: 'apply/headshot/headshot.html'            }}})
        .state('app.bg-info',            {url: '/bg-info',            views: {'tab-companies':   {templateUrl: 'apply/background/bg-info.html'           }}})
        .state('app.bg-ssn',             {url: '/bg-ssn',             views: {'tab-companies':   {templateUrl: 'apply/background/bg-ssn.html'            }}})
        .state('app.phone-call',         {url: '/phone-call',         views: {'tab-companies':   {templateUrl: 'apply/phone-call/phone-call.html'        }}})
        .state('app.finish',             {url: '/finish',             views: {'tab-companies':   {templateUrl: 'apply/finish/finish.html'                }}})
        .state('app.companies',          {url: '/companies',          views: {'tab-companies':   {templateUrl: 'apply/companies/company-recommendation.html'}}, cache: false})

        // Auth
        .state('welcome',                {url: '/welcome',               templateUrl: 'auth/welcome/welcome.html'                  })
        .state('signup-name',            {url: '/signup-name',           templateUrl: 'auth/signup/name.html'                      })
        .state('signup-email',           {url: '/signup-email',          templateUrl: 'auth/signup/email.html'                     })
        .state('signup-password',        {url: '/signup-password',       templateUrl: 'auth/signup/password.html'                  })
        .state('login-email',            {url: '/login-email',           templateUrl: 'auth/login/email.html'                      })
        .state('login-password',         {url: '/login-password',        templateUrl: 'auth/login/password.html'                   })
        .state('login-forgot-password',  {url: '/login-forgot-password', templateUrl: 'auth/login/forgot-password.html'            })

        // Onboarding
        .state('wizard-goal',            {url: '/wizard-goal',           templateUrl: 'wizard/goal/goal.html'                      })
        .state('wizard-avail-days',      {url: '/wizard-avail-days',     templateUrl: 'wizard/availability/availability-days.html' })
        .state('wizard-avail-times',     {url: '/wizard-avail-times',    templateUrl: 'wizard/availability/availability-times.html'})
        .state('wizard-vehicles',        {url: '/wizard-vehicles',       templateUrl: 'wizard/vehicles/vehicles.html'              })
        .state('wizard-locations',       {url: '/wizard-locations',      templateUrl: 'wizard/locations/locations.html'            })

        // Tutorial
        .state('tutorial',               {url: '/tutorial',               templateUrl: 'tutorial/tutorial.html'                    })


	// if none of the above states are matched, use this as the fallback
        // This is now decided programatically
        // $urlRouterProvider.otherwise('/welcome');
    }
}

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
    'wg.data',
    'wg.utils',
    'wg.popups',
    'wg.schedule',
    'wg.claim',
    'wg.preferences',
    'wg.profile',
    'wg.directives',
    'wg.services',
    'wg.tutorial',

    // 'wg.preferences.location',
    'ionic',
    'ngCordova',
    'workgenius.directives',
    'workgenius.services',
    'workgenius.constants',
    'workgenius.filters',
    'workgenius.availability',
    'workgenius.claimShifts',
    'parseData',
    'parseUtils',
    'inputFormatter',
    'angular.filter',
    'ioncal',
    'pascalprecht.translate',
    'ngIOS9UIWebViewPatch',
    'templatescache',
    'angulartics',
    'angulartics.mixpanel',
    'ngRaven',
    'ngProgress',

    // 'workgenius.tracker',
    // 'ionic.service.core',
    // 'ionic.service.analytics'
])

.run([
    '$rootScope',
    '$state',
    '$interval',
    'PtrService',
    'currentUser',
    'wgState',
    'wgShifts',
    'keyboardManager',
    WGAppRun
])

.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$ionicConfigProvider',
    '$analyticsProvider',
    WGAppConfig
]);
