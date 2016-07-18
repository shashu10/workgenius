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
                eligibilities.toggleConnectedCompany(
                    $scope.selectedCompany.name,
                    true, // toggle value
                    $scope.user.username,
                    $scope.user.password,
                    function success() {

                        mixpanel.track("Connected company - " + $scope.selectedCompany.name);
                        // Pulls up wg-save-bar
                        if ($scope.wgSuccess) $scope.wgSuccess();
                    },
                    function failure(something) {

                        mixpanel.track("Failed company connect - " + $scope.selectedCompany.name);
                        $scope.selectedCompany.connected = false;
                        if (Parse.User.current()) $scope.$apply();
                        $ionicPopup.show(newFailurePopup());
                        console.log('failure');
                    });

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

        function isConnected(name) {
            // var eligibility = eligibilities.get(name);
            // return eligibility && eligibility.connected;
        }
    }
])