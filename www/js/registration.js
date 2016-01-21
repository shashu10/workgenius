angular.module('workgenius.registration', [])
    .controller('RegisterCtrl', function($scope, $state, $rootScope, $ionicLoading, $ionicHistory, getUserData) {
        $scope.signupActive = false;

        $scope.loginDemoUser = function() {

            getUserData();

            var next = 'onboarding.work-types';
            if ($state.current.name === 'registration.login') {
                next = 'app.schedule';
            }
            $scope.toggleWithoutAnimation(next);
        };

        $scope.toggleWithoutAnimation = function(state) {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableAnimate: true
            });
            $state.go(state, {
                clear: true
            });
        };

        // Manually change tab state
        $scope.$on('$stateChangeSuccess', function(event, current) {
            if (current.name == "registration.login" || current.name == "registration.forgot-password") {
                $scope.signupActive = false;
            } else if (current.name == "registration.signup") {
                $scope.signupActive = true;
            }
        });
    })
    .controller('LoginCtrl', function($scope, $state, $rootScope, $ionicLoading, $ionicHistory, getUserData) {
        $scope.user = {
            email: '',
            password: '',
        };
        $scope.error = {};

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

                    getUserData().then(function (onboarding) {

                        $ionicLoading.hide();
                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $state.go('app.schedule', {
                            clear: true
                        });
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
            $scope.toggleWithoutAnimation('registration.forgot-password');
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
        $scope.toggleWithoutAnimation('registration.login');
    };
})

.controller('SignupCtrl', ['$scope', '$state', '$ionicLoading', '$rootScope', '$ionicHistory', 'getUserData', 'formatUploadData',
    function($scope, $state, $ionicLoading, $rootScope, $ionicHistory, getUserData, formatUploadData) {

        $rootScope.user = {
            name: '',
            email: '',
            password: '',
            password1: '',
        };
        getUserData();

        $scope.error = {};

        $scope.register = function() {

            // TODO: add age verification step
            $scope.loading = $ionicLoading.show({
                content: 'Sending',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            if ($rootScope.user.password != $rootScope.user.password1) {
                $scope.errorHandler(null, {
                    code: 1000
                });
                return;
            }

            var user = new Parse.User();
            user.set("name", $rootScope.user.name);
            user.set("email", $rootScope.user.email);
            user.set("username", $rootScope.user.email);
            user.set("password", $rootScope.user.password);

            user.set('availability', {});
            user.set('vehicles', []);
            user.set('companies', []);
            user.set('workTypes', []);
            user.set('target', 40); // Default

            user.signUp(null, {
                success: function(user) {
                    $ionicLoading.hide();
                    getUserData(true, $rootScope.user.name, $rootScope.user.email);

                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $state.go('onboarding.work-types', {
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

            } else if (error.code === 1000) {
                $scope.error.message = 'Passwords do not match';

            } else {
                $scope.error.message = error.message;
            }
        };
    }
]);
