angular.module('parseData', [])

// Remove redundant data and format it to minimize storage
.factory('formatUploadData', ['$rootScope', function ($rootScope) {

  var formatTargetHours = function () {
    return Number($rootScope.currentUser.target);
  };

  var formatVehicles = function () {

    var filtered = $rootScope.currentUser.vehicles.filter(function(vehicle) {
      return vehicle.selected;
    }).map(function(item) {
      return item.name;
    });

    return filtered;
  };

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

  var formatAvailability = function () {
    return $rootScope.currentUser.availability;
  };

  var formatBlockedDays = function () {
    return $rootScope.currentUser.blockedDays;
  };

  var formatAppState = function () {
    return $rootScope.currentUser.appState || {};
  };

  return {
    target       : formatTargetHours,
    vehicles     : formatVehicles,
    companies    : formatCompanies,
    workTypes    : formatWorkTypes,
    availability : formatAvailability,
    blockedDays  : formatBlockedDays,
    appState     : formatAppState,
  };
}])

.factory('setUserData',
  ['$rootScope', 'formatUploadData',
  function ($rootScope, formatUploadData) {

  return {
    save : function (type, success, failure) {
      var data = {};
      data[type] = formatUploadData[type]();

      if (Parse.User.current()) {
        $rootScope.currentUser.save(data, {
          success: function(obj) {
            if (success) {
              success();
              $rootScope.$apply();
            }
            console.log('saved');
          },
          error: function(obj, error) {
            if (failure)
              failure();

            console.log('Failed to create new object, with error code: ' + error.message);
          }
        });


      // Demo
      } else {
        console.log('User not logged in.');
        if (success)
          success();
      }
    }
  };
}])

.factory('getUserData',
  ['$rootScope', '$q',
  function ($rootScope, $q) {

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
  
  var getBlockedDays = function (user) {
    // var companies = {};
    // for (var day in user.get('blockedDays')) {
    //   companies[user.get('companies')[company]] = true;
    // }
    return user.get('blockedDays') || [];
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
      blockedDays      : [],
      totalHours       : 0,
      availability     : initAvailability(),
      appState         : {},
    });
  };
  
  return function (newUser, name, email) {

    var deferred = $q.defer();

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
          name             : user.get('name')  || '',
          email            : user.get('email') || '',
          target           : user.get('target') || 40,
          cancellations    : user.get('cancellations') || 0,
          appState         : user.get('appState') || {},
          vehicles         : getVehicles(user),
          companies        : getCompanies(user),
          workTypes        : getWorkTypes(user),
          blockedDays      : getBlockedDays(user),
          totalHours       : scheduleGrid.totalHours,
          availability     : scheduleGrid.availability,
        });

        deferred.resolve(true);
      });
    }

    return deferred.promise;
  };
}]);
