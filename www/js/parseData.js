angular.module('parseData', [])

.factory('timePicker', function () {
  return function (inputEpochTime) {
    return {
      inputEpochTime: inputEpochTime || ((new Date()).getHours() * 60 * 60),  //Optional
      step: 60,  //Optional
      format: 12,  //Optional
      titleLabel: 'Select Time',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          this.inputEpochTime = val;
        }
      }
    };
  };
})

// Remove redundant data and format it to minimize storage
.factory('formatUploadData', ['$rootScope', function ($rootScope) {

  var formatCompanies = function () {
    
      var selected = [];
      for (var company in $rootScope.currentUser.companies) {
        if ($rootScope.currentUser.companies[company])
          selected.push(company);
      }
      return selected;
    };

  var formatWorkTypes = function () {
    
      var selected = [];
      for (var type in $rootScope.currentUser.workTypes) {
        if ($rootScope.currentUser.workTypes[type])
          selected.push(type);
      }
      return selected;
    };

  var formatVehicles = function () {

    var filtered = $rootScope.currentUser.vehicles.filter(function(vehicle) {
      return vehicle.selected;
    }).map(function(item) {
      return item.name;
    });

    return filtered;
  };

  var formatTargetHours = function () {
    return Number($rootScope.currentUser.target);
  };

  var formatAvailability = function () {
    return $rootScope.currentUser.availability;
  };

  return {
    target       : formatTargetHours,
    vehicles     : formatVehicles,
    companies    : formatCompanies,
    workTypes    : formatWorkTypes,
    availability : formatAvailability,
  };
}])

.factory('setUserData',
  ['$rootScope', 'timePicker', 'formatUploadData',
  function ($rootScope, timePicker, formatUploadData) {

  var save = function (data, success, failure) {

    if (Parse.User.current()) {
      $rootScope.currentUser.save(data, {
        success: function(obj) {
          if (success)
            success();

          console.log('saved');
        },
        error: function(obj, error) {
          if (failure)
            failure();

          console.log('Failed to create new object, with error code: ' + error.message);
        }
      });
    }
  };

  return {
    save : function (type, success, error) {
      var data = {};
      data[type] = formatUploadData[type]();
      save(data, success, error);
    }
  };
}])

.factory('getUserData', ['$rootScope', 'timePicker', function ($rootScope, timePicker) {

  var getWorkTypes = function (user) {
    var workTypes = {};
    for (var type in user.get('workTypes')) {
      workTypes[user.get('workTypes')[type]] = true;
    }
    return workTypes;
  };

  var getCompanies = function (user) {
    var companies = {};
    for (var company in user.get('companies')) {
      companies[user.get('companies')[company]] = true;
    }
    return companies;
  };

  var getVehicles = function (user) {
    return [
      {
        name:"car",
        icon: "ion-android-car",
        selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('car') > -1
      },{
        name:"bicycle",
        icon: "ion-android-bicycle",
        selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('bicycle') > -1
      },{
        name:"motorbike",
        icon: "ion-android-bicycle",
        selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('motorbike') > -1
      },
    ];
  };
  
  var getAvailability = function (user) {
    var availability = user.get('availability');
    if (!availability) {
      return {availability: initAvailability(), totalHours: 0};
    } else {
      var totalHours = 0;
      for (var i = 0; i < $rootScope.days.length; i++) {
        var day = $rootScope.days[i];
        for (var j = 0; j < $rootScope.intervals.length; j++) {
          if (availability[day][j]) {
            totalHours += 1;
          }
        }
      }
      return {availability: availability, totalHours: totalHours};
    }
  };

  var initAvailability = function (avail) {

    var availability = {};
    for (var i = 0; i < $rootScope.days.length; i++) {
      var day = $rootScope.days[i];
      availability[day] = [];
      for (var j = 0; j < $rootScope.intervals.length; j++) {
        availability[day][j] = 0;
      }
    }
    return availability;
  };

  var setDefaultPrefs = function (name, email) {
    angular.extend($rootScope.currentUser, {
      name             : name,
      email            : email,
      target           : 40,
      cancellations    : 0,
      vehicles         : getVehicles(),
      companies        : {},
      workTypes        : {},
      totalHours       : 0,
      availability     : initAvailability()
    });
  };
  
  return function (newUser, name, email) {

    $rootScope.currentUser = Parse.User.current() || {};

    // Only for demo purposes
    if (!Parse.User.current()) {

      setDefaultPrefs('AJ Shewki', 'aj@workgeni.us');

    // New use needs default values immediately for onboarding flow
    } else if (newUser) {
      setDefaultPrefs(name, email);

    // Existing user must have their preferences fetched
    } else {
      Parse.User.current().fetch().then(function (user) {

        var scheduleGrid = getAvailability(user);
        angular.extend($rootScope.currentUser, {
          name             : user.get('name'),
          email            : user.get('email'),
          target           : user.get('target'),
          cancellations    : user.get('cancellations'),
          vehicles         : getVehicles(user),
          companies        : getCompanies(user),
          workTypes        : getWorkTypes(user),
          totalHours       : scheduleGrid.totalHours,
          availability     : scheduleGrid.availability
        });
      });
    }
  };
}]);
