angular.module('workgenius.controllers', [])


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

.controller('CompaniesCtrl', ['$rootScope', '$scope', '$ionicModal', 'setUserData', 'setEligibility',
    function($rootScope, $scope, $ionicModal, setUserData, setEligibility) {

        $scope.customSave = setEligibility.save;
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

            setEligibility.toggleInterest(company.name, true);
            $scope.modal.hide();
            if ($scope.onChange) $scope.onChange();
        };
        $scope.select = function(company) {
            // Unselect type if it's already selected
            if ($scope.isInterested(company.name)) {
                setEligibility.toggleInterest(company.name, false);

                if ($scope.onChange) $scope.onChange();

                // Open detailed modal when unselected option is clicked
            } else {
                $scope.selectedCompany = company;
                $scope.modal.show();
            }
        };

        $scope.isEligible = function(name) {
            var eligibility = setEligibility.findEligibility(name);
            return eligibility && eligibility.eligible;
        };
        $scope.isInterested = function(name) {
            var eligibility = setEligibility.findEligibility(name);
            return eligibility && eligibility.interested;
        };
    }
])

.controller('ClaimDaysCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.days = [];

  for (var i = 0; i < 7; i++) {
    $scope.days.push(moment().add(i, 'days').format("dddd Do"));
  }

  $scope.select = function(day) {
    $state.go("app.claim-shifts", {selectedDay: day});
  };
}])
.controller('ClaimShiftsCtrl', ['$stateParams', '$scope', '$state', function($stateParams, $scope, $state) {

  $scope.selectedDay = $stateParams.selectedDay;
  $scope.shifts = [
    {
      name: "caviar",
      location: "nob hill",
      startsAt: "10:30am",
      endsAt: "12:30pm",
      notes: []
    },
    {
      name: "munchery",
      location: "san bruno",
      startsAt: "1:30pm",
      endsAt: "4:30pm",
      bonus: "+20%",
      notes: [
        "+20%",
      ]
    },
    {
      name: "doordash",
      location: "milpitas",
      startsAt: "5:30pm",
      endsAt: "8:30pm",
      flex: true,
      notes: [
        "Flex Shift"
      ]
    },
    {
      name: "postmates",
      location: "san francisco",
      startsAt: "10:30pm",
      endsAt: "12:30am",
      flex: true,
      bonus: "+20%",
      notes: [
        "+20%",
        "Flex Shift"
      ]
    }
  ];

  $scope.select = function(shift) {
    $state.go("app.claim-detail", {shift: JSON.stringify(shift)});
  };
}])
.controller('ClaimDetailCtrl', ['$stateParams', '$scope', function($stateParams, $scope) {
  $scope.shift = JSON.parse($stateParams.shift);
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
