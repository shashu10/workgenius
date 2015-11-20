angular.module('workgenius.onboarding', [])

.controller('LoginCtrl', function($scope, $state, $rootScope, $ionicLoading, $ionicHistory, getUserData) {
    $scope.user = {
        email: '',
        password: '',
    };
    $scope.error = {};
    $scope.loginDemoUser = function () {

        getUserData();

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $state.go('app.schedule-calendar-page', {
            clear: true
        });
    };
    $scope.login = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.logIn(('' + $scope.user.email).toLowerCase(), $scope.user.password, {
            success: function(user) {
                $ionicLoading.hide();

                getUserData();

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('app.schedule-calendar-page', {
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
            }
        });
    };

    $scope.forgot = function() {
        $state.go('tab.forgot-password-page');
    };
})

.controller('ForgotCtrl', function($scope, $rootScope, $state, $ionicLoading) {
    $scope.user = {
        email: ''
    };
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
                $ionicLoading.hide();
                $scope.state.success = true;
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
            }
        });
    };

    $scope.login = function() {
        $state.go('tab.login');
    };
})

.controller('RegisterCtrl', ['$scope', '$state', '$ionicLoading', '$rootScope', '$ionicHistory', '$ionicLoading', 'getUserData', 'formatUploadData', function($scope, $state, $ionicLoading, $rootScope, $ionicHistory, $ionicLoading, getUserData, formatUploadData) {

    $rootScope.user = {
        name: '',
        email: '',
        password: '',
        password1: '',
    };
    getUserData();

    $scope.error = {};
    $scope.showPager = true;

    $scope.pages = [
      'tab.register-account-info',
      'tab.register-target-hours',
      'tab.register-companies',
      'tab.register-work-types',
      'tab.register-availability',
    ];
    $scope.syncPagerState = function () {
      $scope.currentPage = $scope.pages.indexOf($state.current.name);
    };
    $scope.getNextPage = function () {
      var idx = $scope.pages.indexOf($state.current.name);
      var nextPage = $scope.pages[idx+1];
      return nextPage;
    };
    $scope.syncPagerState();

    $scope.$on('$stateChangeSuccess', function(event, current) {
        $scope.syncPagerState();
    });
    $scope.next = function() {
      var nextPage = $scope.getNextPage(true);
      $state.go(nextPage, {
          clear: true
      });
    };

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
        user.set("name", $rootScope.user.name);
        user.set("username", $rootScope.user.email);
        user.set("password", $rootScope.user.password);
        user.set("email", $rootScope.user.email);

        // user.set('availability', formatUploadData.availability());
        user.set('vehicles', formatUploadData.vehicles());
        user.set('companies', formatUploadData.companies());
        user.set('workTypes', formatUploadData.workTypes());
        user.set('target', Number($rootScope.currentUser.hourlyTarget));

        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                getUserData();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('app.schedule-calendar-page', {
                    clear: true
                });
            },
            error: $scope.errorHandler
        });
    };
    $scope.errorHandler = function(user, error) {

        $ionicLoading.hide();

        // Parse uses codes -1 - 252. WG starts from 1000
        // http://parse.com/docs/dotnet/api/html/T_Parse_ParseException_ErrorCode.htm
        if (error.code === 125) {
            $scope.error.message = 'Please specify a valid email ' +
                'address';
        } else if (error.code === 202) {
            $scope.error.message = 'The email address is already ' +
                'registered';

        // Workgenius error messages: please select availability, target, companies, etc

        // } else if (error.code === 1000) {
        //     $scope.error.message = 'The email address is already ' +
        //         'registered';

        } else {
            $scope.error.message = error.message;
        }
    };

    $scope.loginDemoUser = function () {
        getUserData();

        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $state.go('app.schedule-calendar-page', {
            clear: true
        });
    };
}]);
