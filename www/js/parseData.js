angular.module('parseData', [])

.factory('debounce', ['$timeout', '$q', function($timeout, $q) {
  return function(func, wait, immediate) {
    var timeout;
    var deferred = $q.defer();
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if(!immediate) {
          deferred.resolve(func.apply(context, args));
          deferred = $q.defer();
        }
      };
      var callNow = immediate && !timeout;
      if ( timeout ) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(later, wait);
      if (callNow) {
        deferred.resolve(func.apply(context,args));
        deferred = $q.defer();
      }
      return deferred.promise;
    };
  };
}])

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

  return {
    vehicles: formatVehicles,
    companies: formatCompanies,
    workTypes: formatWorkTypes,
  };
}])

.factory('setUserData', ['$rootScope', 'timePicker', 'formatUploadData', 'debounce', function ($rootScope, timePicker, formatUploadData, debounce) {

  // For items that are easy to toggle quickly, update after an interval
  var interval = 1000; // ms

  var setAvailabilityGrid = debounce(function () {

      if (Parse.User.current()) {
        $rootScope.currentUser.save({'availabilityGrid': $rootScope.currentUser.availabilityGrid});
      }
      var totalHours = 0;
      for (var i = 0; i < $rootScope.days.length; i++) {
        var day = $rootScope.days[i];
        for (var j = 0; j < $rootScope.intervals.length; j++) {
          if ($rootScope.currentUser.availabilityGrid[day][j]) {
            totalHours += 1;
          }
        }
      }
      $rootScope.currentUser.totalHours = totalHours;

    }, interval, false);

  var setCompanies = debounce(function () {

      if (Parse.User.current())
        $rootScope.currentUser.save({'companies': formatUploadData.companies()});

    }, interval, false);

  var setVehicles = debounce(function () {

      if (Parse.User.current())
        $rootScope.currentUser.save({'vehicles': formatUploadData.vehicles()});

    }, interval, false);

  var setWorkTypes = debounce(function () {

      if (Parse.User.current())
        $rootScope.currentUser.save({'workTypes': formatUploadData.workTypes()});

    }, interval, false);

  var setTarget = debounce(function (target) {

      if (Parse.User.current())
        $rootScope.currentUser.save({'target': Number(target)});

    }, interval, false);

  return {
    vehicles: setVehicles,
    companies: setCompanies,
    workTypes: setWorkTypes,
    target: setTarget,
    availabilityGrid: setAvailabilityGrid
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
  
  var getAvailabilityGrid = function (user) {
    var availability = user.get('availabilityGrid');
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

    var availabilityGrid = {}
    for (var i = 0; i < $rootScope.days.length; i++) {
      var day = $rootScope.days[i];
      availabilityGrid[day] = [];
      for (var j = 0; j < $rootScope.intervals.length; j++) {
        availabilityGrid[day][j] = false;
      }
    }
    return availabilityGrid;
  }

  return function () {

    if (!Parse.User.current()) {
      $rootScope.currentUser = {
        name             : 'AJ Shewki',
        email            : 'aj@workgeni.us',
        hourlyTarget     : 40,
        cancellations    : 0,
        vehicles         : getVehicles(),
        companies        : {},
        workTypes        : {},
        totalHours       : 0,
        availabilityGrid : initAvailability()
      };
      return;
    }
    $rootScope.currentUser = Parse.User.current();
    Parse.User.current().fetch().then(function (user) {

      var scheduleGrid = getAvailabilityGrid(user);
      angular.extend($rootScope.currentUser, {
        name             : user.get('name'),
        email            : user.get('email'),
        hourlyTarget     : user.get('target'),
        cancellations    : user.get('cancellations'),
        vehicles         : getVehicles(user),
        companies        : getCompanies(user),
        workTypes        : getWorkTypes(user),
        totalHours       : scheduleGrid.totalHours,
        availabilityGrid : scheduleGrid.availability
      });
    });
  };
}]);


// .factory('Preferences', function() {

//   var Preferences = Parse.Object.extend("Preferences", {
//     // Instance methods
//   }, {
//     // Class methods
//   });

//   // Title property
//   Preferences.prototype.__defineGetter__("title", function() {
//     return this.get("title");
//   });
//   Preferences.prototype.__defineSetter__("title", function(aValue) {
//     return this.set("title", aValue);
//   });

//   return Preferences;
// })
