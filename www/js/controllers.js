angular.module('workgenius.controllers', ['integrations'])


// ============ //
//     MENU     //
// ============ //

.controller('MenuCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', '$ionicModal', '$interval', 'zenMessage', 'getUserData',
    function($scope, $rootScope, $state, $ionicHistory, $ionicModal, $interval, zenMessage, getUserData) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.logout = function() {
            Parse.User.logOut();

            getUserData();

            $scope.toggleWithoutAnimation('registration.login');
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
//   COMPANIES  //
// ============ //

.controller('CompaniesCtrl', ['$rootScope', '$scope', '$ionicModal', 'setUserData', 'eligibilities',
    function($rootScope, $scope, $ionicModal, setUserData, eligibilities) {

        $scope.customSave = eligibilities.saveAll;
        $scope.selectedWorkType = null;

        $ionicModal.fromTemplateUrl('templates/shared/companies-modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.decline = function(company) {
            $scope.modal.hide();
        };
        $scope.accept = function(company) {

            eligibilities.toggleInterest(company.name, true);
            $scope.modal.hide();
            if ($scope.onChange) $scope.onChange();
        };
        $scope.select = function(company) {
            // Unselect type if it's already selected
            if ($scope.isInterested(company.name)) {
                eligibilities.toggleInterest(company.name, false);

                if ($scope.onChange) $scope.onChange();

                // Open detailed modal when unselected option is clicked
            } else {
                $scope.selectedCompany = company;
                $scope.modal.show();
            }
        };

        $scope.isEligible = function(name) {
            var eligibility = eligibilities.get(name);
            return eligibility && eligibility.eligible;
        };
        $scope.isInterested = function(name) {
            var eligibility = eligibilities.get(name);
            return eligibility && eligibility.interested;
        };
    }
])

.controller('ClaimDaysCtrl', ['$scope', '$state', 'connectedShifts',
  function($scope, $state, connectedShifts) {

  $scope.$on('$stateChangeSuccess', function(event, current) {
    if (current.name.indexOf('app.claim-days') > -1) {
      connectedShifts.getAll();
    }
  });

  $scope.days = [];

  for (var i = 0; i < 7; i++) {
    $scope.days.push(moment().add(i, 'days').toDate());
  }

  $scope.select = function(day) {
    $state.go("app.claim-shifts", {selectedDay: day, short: moment(day).format("ddd Do")});
  };
}])
.controller('ClaimShiftsCtrl', ['$stateParams', '$scope', '$state',
  function($stateParams, $scope, $state) {

  $scope.selectedDay = $stateParams.selectedDay;
  $scope.short = $stateParams.short;

  $scope.select = function(shift) {
    $state.go("app.claim-detail", {shift: JSON.stringify(shift)});
  };
}])
.controller('ClaimDetailCtrl', ['$stateParams', '$scope', '$rootScope', 'connectedShifts',
  function($stateParams, $scope, $rootScope, connectedShifts) {
  $scope.shift = JSON.parse($stateParams.shift);
  // Claim Status:
  // 0: nothing
  // 1: loading
  // 2: success
  // 3: failure
  $scope.shift.claimStatus = 0;
  $scope.shift.claimMessage = "Claim";
  $scope.claim = function (shift) {

    $scope.shift.claimStatus = 1;
    $scope.shift.claimMessage = "";
    connectedShifts.claim(shift, function success() {
      $scope.shift.claimStatus = 2;
      $scope.shift.claimMessage = "Claimed Shift!";
      // If no user, then it's just a demo. Don't need to apply scope.
    }, function failure() {
      $scope.shift.claimStatus = 3;
      $scope.shift.claimMessage = "Failed to claim";
    });
  };
}])
.controller('ConnectAccountsCtrl', ['$scope', '$rootScope', '$ionicPopup', 'eligibilities',
  function($scope, $rootScope, $ionicPopup, eligibilities) {

    $scope.isEditing = false;

    $scope.toggleConnection = function(company) {

        // If toggle is turned on
        if (company && company.connected) {
            $scope.isEditing = true;

            $scope.user = {};
            // if (window.cordova && window.cordova.getAppVersion && window.device && window.device.platform) {
            //     document.addEventListener("hidekeyboard", function onHide() {
                  
            //     }, false);
            //     document.addEventListener("showkeyboard", function onShow() {
                  
            //     }, false);
            // }


            $ionicPopup.show(newConnectPopup())
            .then(function(connect) {

                $scope.isEditing = false;

                // Pressed connect
                if (connect) {
                  if ($scope.user.username && $scope.user.password) {
                    eligibilities.toggleConnectedCompany(
                      company.name,
                      true, // toggle value
                      $scope.user.username,
                      $scope.user.password,
                      function success() {
                        // Pulls up wg-save-bar
                        if ($scope.wgSuccess) $scope.wgSuccess();
                      },
                      function failure(something) {
                        company.connected = false;
                        if (Parse.User.current()) $scope.$apply();
                        $ionicPopup.show(newFailurePopup());
                        console.log('failure');
                      });

                  // Empty username/password
                  } else {
                    company.connected = false;
                  }
                // Pressed never mind
                } else {
                  company.connected = false;
                }
            });

        // If toggle is turned off
        } else {
          eligibilities.toggleConnectedCompany(company.name, false);
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
          template: '<div class="list"><label class="item item-input"><i class="icon ion-person placeholder-icon"></i><input placeholder="Username" type="text" ng-model="user.username"></label><label class="item item-input"><i class="icon ion-lock-combination placeholder-icon"></i><input placeholder="Password" type="password" ng-model="user.password"></label></div><p>Your information will be secure! We store all information with industry-standard AES 256 bit encryption algorithm.</p>',
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
        var eligibility = eligibilities.get(name);
        return eligibility && eligibility.connected;
    }
}])



// .controller('EarningsController', [ '$scope', function($scope) {
// }])
// .controller('VehiclesCtrl', ['$scope', function($scope) {
// }])
// .controller('TargetCtrl', ['$scope', function($scope) {
// // }])
// .controller('AvailableShiftsCtrl', ['$scope', '$ionicModal', function($scope, $ionicModal) {

//   $scope.shifts=[
//     {
//       name:"Coleen", company: "caviar", earnings: 62,
//       date: new Date("October 23, 2014"),
//       startsAt: new Date("October 23, 2014 18:30:00"),
//       endsAt: new Date("October 23, 2014 21:30:00")
//     },
//   ];
//   $scope.selectedShift = $scope.shifts[0];
//   // Create the login modal that we will use later
//   $ionicModal.fromTemplateUrl('templates/shared/accept-shift.html', {
//     scope: $scope
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });

//   $scope.accept = function (shift) {
//     $scope.selectedShift = shift;
//     $scope.modal.show();
//   };

//   $scope.acceptShift = function (shift) {
//     $scope.modal.hide();
//   };
//   $scope.declineShift = function (shift) {
//     $scope.modal.hide();
//   };

// }])

// - END -
;