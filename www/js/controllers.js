angular.module('workgenius.controllers', [])


// ============ //
//     MENU     //
// ============ //

.controller('TabCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', '$ionicModal', '$interval', 'zenMessage', 'getUserData',
    function($scope, $rootScope, $state, $ionicHistory, $ionicModal, $interval, zenMessage, getUserData) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.logout = function() {
            mixpanel.track('Logout');
            Parse.User.logOut();

            getUserData();

            $scope.toggleWithoutAnimation('welcome');
            $ionicHistory.clearCache();
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
        // End

        // Contact Us Modal

        $scope.contactStatus = 'Send';

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/shared/contact-us.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.contactModal = modal;
        });

        $scope.cancelMessage = function() {
            $scope.contactModal.hide();
        };

        $scope.sendMessage = function() {
            $scope.modalData.buttonStatus = 'button-positive';
            $scope.modalData.contactStatus = 'Sending...';
            zenMessage.send($scope.modalData.message, $scope.modalData.subject).then(function(result) {
                console.log('success sending message');
                messageSentCallback('Sent!', 'button-balanced');
            }, function(result) {
                console.log('failure sending message');
                messageSentCallback('Couldn\'t Send', 'button-assertive');
            });
        };

        function messageSentCallback(text, button) {

            $scope.modalData.buttonStatus = button;
            $scope.modalData.contactStatus = text;
            $interval(function() {
                $scope.contactModal.hide().then(function() {
                    $scope.modalData.message = '';
                    $scope.modalData.contactStatus = 'Send';
                    $scope.modalData.buttonStatus = 'button-positive';
                });
            }, 1000, 1);
        }
        $scope.modalData = {
            contactStatus: 'Send',
            buttonStatus: 'button-positive',
            message: '',
            subject: 'general',
            options: ['general', 'cancellation', 'app']
        };
        $scope.setActive = function(type) {
            $scope.modalData.subject = type;
        };
        $scope.isActive = function(type) {
            return type === $scope.modalData.subject;
        };
        // End

    }
])

// ============ //
//     Other    //
// ============ //

.controller('PersonalInfoPageCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.currentUser = $rootScope.currentUser;
}])

// - END -
;