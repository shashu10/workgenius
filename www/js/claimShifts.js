angular.module('workgenius.claimShifts', [])

// ============ //
//    Connect   //
// ============ //

.controller('ConnectAccountsCtrl', ['$scope', '$rootScope', '$ionicPopup',
    function($scope, $rootScope, $ionicPopup) {

        $scope.isEditing = false;

        $scope.connect = function() {
            if ($scope.connectPopup) {
                console.log($scope.connectPopup);
                $scope.connectPopup.close();
                $scope.connectPopup = null;
            }
            if ($scope.user.username && $scope.user.password) {
                // eligibilities.toggleConnectedCompany(
                //     $scope.selectedCompany.name,
                //     true, // toggle value
                //     $scope.user.username,
                //     $scope.user.password,
                //     function success() {

                //         mixpanel.track("Connected company - " + $scope.selectedCompany.name);
                //         // Pulls up wg-save-bar
                //         if ($scope.wgSuccess) $scope.wgSuccess();
                //     },
                //     function failure(something) {

                //         mixpanel.track("Failed company connect - " + $scope.selectedCompany.name);
                //         $scope.selectedCompany.connected = false;
                //         if (Parse.User.current()) $scope.$apply();
                //         $ionicPopup.show(newFailurePopup());
                //         console.log('failure');
                //     });

                // Empty username/password
            } else {
                $scope.selectedCompany.connected = false;
            }
        };
        $scope.toggleConnection = function(company) {
            $scope.selectedCompany = company;
            // If toggle is turned on
            if (company && company.connected) {
                $scope.isEditing = true;

                $scope.user = {};

                $scope.connectPopup = $ionicPopup.show(newConnectPopup());

                $scope.connectPopup.then(function(connect) {
                    $scope.connectPopup = null;
                    $scope.isEditing = false;

                    // Pressed connect or hit enter/go on keyboard
                    if (connect || connect === undefined) {
                        $scope.connect(company);
                        // Pressed never mind
                    } else {
                        company.connected = false;
                    }
                });

                // If toggle is turned off
            } else {
                // eligibilities.toggleConnectedCompany(company.name, false);
            }
        };

        // Toggle connected/not connected for each company
        for (var i = 0; i < $rootScope.companyList.length; i++) {
            var company = $rootScope.companyList[i];
            company.connected = isConnected(company.name);
        }

        function newFailurePopup() {
            return {
                template: '<p>The username or password might be wrong</p>',
                title: 'Could not connect your account',
                scope: $scope,
                buttons: [{
                    text: 'Ok',
                    type: 'button-positive',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return true;
                    }
                }]
            };
        }

        function newConnectPopup() {
            return {
                template: '<form name="deviceForm" ng-submit="connect()" novalidate><div class="list borderless-input"><label class="item item-input"><i class="icon ion-person placeholder-icon"></i><input placeholder="Username" type="text" ng-model="user.username"></label><label class="item item-input"><i class="icon ion-lock-combination placeholder-icon"></i><input placeholder="Password" type="password" ng-model="user.password"></label><!-- Hidden input button necessary to make keyboard next button work --><input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;"/></div></form><p>Your information will be secure! We store all information with industry-standard AES 256 bit encryption algorithm.</p>',
                title: 'Enter your company login',
                scope: $scope,
                cssClass: 'connect-popup',
                buttons: [{
                    text: 'Never Mind',
                    type: 'button-dark',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return false;
                    }
                }, {
                    text: 'Connect',
                    type: 'button-positive',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return true;
                    }
                }]
            };
        }

        function isConnected(name) {
            // var eligibility = eligibilities.get(name);
            // return eligibility && eligibility.connected;
        }
    }
])