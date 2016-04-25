angular.module('workgenius.claimShifts', ['integrations'])

// ============ //
//     Claim    //
// ============ //

.service('shiftToClaim', function() {
    var shift = {};
    var group = [];
    return {
        get: function() {
            return shift;
        },
        set: function(value) {
            shift = value;
        }
    };
})
.controller('ClaimDaysCtrl', ['$scope', '$state', 'connectedShifts',
  function($scope, $state, connectedShifts) {

  $scope.doRefresh = function() {
    connectedShifts.getAllAvailable(function success() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.select = function(index) {
    $state.go("app.claim-shifts", {index: index});
  };

}])
.controller('ClaimShiftsCtrl', ['$stateParams', '$scope', '$rootScope', '$state', 'shiftToClaim',
  function($stateParams, $scope, $rootScope, $state, shiftToClaim) {

  $scope.day = $rootScope.currentUser.availableShifts[$stateParams.index];
  $scope.title = moment($scope.day.date).format("ddd Do");
  $scope.shifts = $scope.day.shifts;

  $scope.select = function(shift) {
    shiftToClaim.set(shift);
    $state.go("app.claim-detail");
  };
}])
.controller('ClaimDetailCtrl', ['$stateParams', '$scope', 'connectedShifts', 'shiftToClaim', '$interval', '$ionicHistory', '$ionicScrollDelegate',
  function($stateParams, $scope, connectedShifts, shiftToClaim, $interval, $ionicHistory, $ionicScrollDelegate) {

  // device is overwritten by something else
  var deviceInformation = ionic.Platform.device();
  $scope.whichPlatform = 'localhost';
  if (deviceInformation && deviceInformation.platform) $scope.whichPlatform = deviceInformation.platform.toLowerCase();

  // Shift Info
  $scope.shift = shiftToClaim.get();
  var s = $scope.shift;
  console.log(s);

  // If it was a conflict with a flex shift, reset it so user can try again
  if (s.flex && s.claimStatus === 3 && s.conflict)  {
    s.claimStatus = 0;
    s.claimText = "Claim";
    s.conflict = undefined;
    s.claimMessage = "";
  }
  var min = new Date(s.startsAt);
  var max = new Date(s.endsAt);
  // Reset start and end times when going back to the claim shifts view
  $scope.$on('$ionicView.beforeLeave', function(){
    // If it was a conflict with a flex shift, reset it so user can try again
    if (s.claimStatus === 0 || (s.claimStatus === 3 && s.conflict)) {
      s.startsAt = min;
      s.endsAt = max;
    }
  });

  // Keep claim status if already interracted with this element
  s.claimStatus = s.claimStatus || 0;
  s.claimText = s.claimText || "Claim";

  $scope.claim = function () {

    s.claimStatus = 1;
    s.claimText = "";

    connectedShifts.claim(s, function success() {
      s.claimStatus = 2;
      s.claimText = "Claimed Shift!";
      // If no user, then it's just a demo. Don't need to apply scope.

    }, function failure(error) {

      console.log(error);
      s.claimStatus = 3;
      s.claimText = "Failed to claim";

      if (error && error.message === 'conflict') {
        s.claimMessage = "There's a conflict! You are already working a shift at this time.";
        s.conflict = true;
      } else
        s.claimMessage = "Something went wrong. This shift may have already been claimed by someone else.";

      // Scroll to the bottom to show error message
      $ionicScrollDelegate.scrollBottom(true);
    });
  };
}])

// ============ //
//    Connect   //
// ============ //

.controller('ConnectAccountsCtrl', ['$scope', '$rootScope', '$ionicPopup', 'eligibilities',
  function($scope, $rootScope, $ionicPopup, eligibilities) {

    $scope.isEditing = false;

    $scope.connect = function () {
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
            // Pulls up wg-save-bar
            if ($scope.wgSuccess) $scope.wgSuccess();
          },
          function failure(something) {
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

                // Pressed connect
                if (connect) {
                  $scope.connect(company);
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
        var eligibility = eligibilities.get(name);
        return eligibility && eligibility.connected;
    }
}])

// ============ //
//    Helpers   //
// ============ //

.directive('flexTimePicker', ['$ionicGesture', function($ionicGesture) {

  var getTimes = function(min, max) {
    var intervals = [];
    var d = {
      label: moment(min).format('h:mm a'),
      value: new Date(min)
    };

    while (moment(d.value).isSameOrBefore(max)) {
      intervals.push(d);
      d = {
        label: moment(d.value).add(30, 'minutes').format('h:mm a'),
        value: moment(d.value).add(30, 'minutes').toDate()
      };
    }
    return intervals;
  };
  var getValue = function(times, date) {
    return _.find(times, function(t) { return moment(t.value).isSame(date);}).value;
  };

  var link = function (scope, element, attr) {

    var s = scope.shift;

    s.startsAt = new Date(s.startsAt);
    s.endsAt = new Date(s.endsAt);
    var min = new Date(s.startsAt);
    var max = new Date(s.endsAt);

    scope.updateStart = function () {
      var time = moment(s.startsAt).add(30, 'minutes').toDate();
      s.endTimes = getTimes(time, max);
      s.endsAt = getValue(s.endTimes, s.endsAt);
    };
    scope.updateEnd = function () {
      var time = moment(s.endsAt).subtract(30, 'minutes').toDate();
      s.startTimes = getTimes(min, time);
      s.startsAt = getValue(s.startTimes, s.startsAt);
    };

    scope.updateEnd();
    scope.updateStart();
  };

  return  {
    templateUrl: 'templates/shared/flex-time-picker.html',
    scope: {
        shift: '=',
    },
    link: link
  };
}]);