angular.module('workgenius.claimShifts', [])

// ============ //
//     Claim    //
// ============ //

    .controller('ClaimGroupDetailCtrl', ['$stateParams', '$scope', 'wgShifts', 'shiftToClaim', '$interval', '$ionicHistory', '$ionicScrollDelegate', 'wgEarnings', '$state',
        function($stateParams, $scope, wgShifts, shiftToClaim, $interval, $ionicHistory, $ionicScrollDelegate, wgEarnings, $state) {

            $scope.wgEarnings = wgEarnings;

            // Shift Info
            $scope.group = shiftToClaim.get();

            // When testing and refreshing page on localhost
            // If shiftToClaim dones't exist, go back to claim days
            if (_.isEmpty($scope.group)) {
                console.log("done")
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                $state.go("app.claim-days");
                return;
            }

            $scope.group.showBlitzInfo = false;

            _($scope.group.shifts).forEach(function(shift) {

                // Set time string
                var start = moment(shift.startsAt);
                var end = moment(shift.endsAt);
                if (start.format('h') === '11')
                    shift.timeSlotStr = start.format('h a - ') + end.format('h a');
                else
                    shift.timeSlotStr = start.format('h - ') + end.format('h a');

                shift.claimStatus = shift.claimStatus || 0;
                shift.claimText = shift.claimText || "Claim";

                if (shift.blitz) $scope.group.showBlitzInfo = true;
            });

            $scope.claim = function(s) {

                s.claimStatus = 1;
                s.claimText = "";

                wgShifts.claim(s)
                .then(function success() {

                    mixpanel.track("Claimed Shift - " + s.company);
                    s.claimStatus = 2;
                    s.claimText = "Claimed";
                    // If no user, then it's just a demo. Don't need to apply scope.

                }, function failure(error) {

                    console.log(error);
                    s.claimStatus = 3;
                    s.claimText = "Failed";

                    if (error && error.message === 'conflict') {
                        s.claimMessage = "You have a conflict";
                        s.conflict = true;
                    } else
                        s.claimMessage = "Could not claim";
                });
            };
        }
    ])
    .controller('ClaimDetailCtrl', ['$stateParams', '$scope', 'wgShifts', 'shiftToClaim', '$interval', '$ionicHistory', '$ionicScrollDelegate', 'wgEarnings', '$state',
        function($stateParams, $scope, wgShifts, shiftToClaim, $interval, $ionicHistory, $ionicScrollDelegate, wgEarnings, $state) {

            $scope.wgEarnings = wgEarnings;

            // Shift Info
            $scope.shift = shiftToClaim.get();
            var s = $scope.shift;
            console.log(s);

            // When testing and refreshing page on localhost
            // If shiftToClaim dones't exist, go back to claim days
            if (_.isEmpty(s)) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                $state.go("app.claim-days");
                return;
            }

            // If it was a conflict with a flex shift, reset it so user can try again
            if (s.flex && s.claimStatus === 3 && s.conflict) {
                s.claimStatus = 0;
                s.claimText = "Claim";
                s.conflict = undefined;
                s.claimMessage = "";
            }
            var min = new Date(s.startsAt);
            var max = new Date(s.endsAt);
            // Reset start and end times when going back to the claim shifts view
            $scope.$on('$ionicView.beforeLeave', function() {
                // If it was a conflict with a flex shift, reset it so user can try again
                if (s.claimStatus === 0 || (s.claimStatus === 3 && s.conflict)) {
                    s.startsAt = min;
                    s.endsAt = max;
                }
            });

            // Keep claim status if already interracted with this element
            s.claimStatus = s.claimStatus || 0;
            s.claimText = s.claimText || "Claim";

            $scope.claim = function() {

                s.claimStatus = 1;
                s.claimText = "";

                // connectedShifts.claim(s, function success() {

                //     mixpanel.track("Claimed Shift - " + s.company);
                //     s.claimStatus = 2;
                //     s.claimText = "Claimed Shift!";
                //     // If no user, then it's just a demo. Don't need to apply scope.

                // }, function failure(error) {

                //     console.log(error);
                //     s.claimStatus = 3;
                //     s.claimText = "Failed to claim";

                //     if (error && error.message === 'conflict') {
                //         s.claimMessage = "There's a conflict! You are already working a shift at this time.";
                //         s.conflict = true;
                //     } else
                //         s.claimMessage = "Something went wrong. This shift may have already been claimed by someone else.";

                //     // Scroll to the bottom to show error message
                //     $ionicScrollDelegate.scrollBottom(true);
                // });
            };
        }
    ])

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