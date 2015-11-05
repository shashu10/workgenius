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

  var formatAvailability = function () {

    var avail = angular.copy($rootScope.currentUser.availability);
    for (var day in avail) {
      for (var sched in avail[day]) {
        // remove redundant info
        
        avail[day][sched].startsAt = avail[day][sched].startsAt.inputEpochTime;
        avail[day][sched].endsAt = avail[day][sched].endsAt.inputEpochTime;

        delete avail[day][sched].id;
        delete avail[day][sched].day;
      }
    }

    return avail;
  };

  var formatCompanies = function () {
    
      var selected = [];
      for (var company in $rootScope.currentUser.companies) {
        if ($rootScope.currentUser.companies[company])
          selected.push(company);
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
    availability: formatAvailability,
  };
}])

.factory('setUserData', ['$rootScope', 'timePicker', 'formatUploadData', 'debounce', function ($rootScope, timePicker, formatUploadData, debounce) {

  // Update instantly
  var setAvailability = function () {
    if (Parse.User.current())
      $rootScope.currentUser.save({'availability': formatUploadData.availability()});
  };

  // For items that are easy to toggle quickly, update after an interval
  var interval = 2000; // ms

  var setCompanies = debounce(function () {

      if (Parse.User.current())
        $rootScope.currentUser.save({'companies': formatUploadData.companies()});

    }, interval, false);

  var setVehicles = debounce(function () {

      if (Parse.User.current())
        $rootScope.currentUser.save({'vehicles': formatUploadData.vehicles()});

    }, interval, false);

  var setTarget = debounce(function (target) {

      if (Parse.User.current())
        $rootScope.currentUser.save({'target': target});

    }, interval, false);

  return {
    vehicles: setVehicles,
    companies: setCompanies,
    availability: setAvailability,
    target: setTarget,
  };
}])

.factory('getUserData', ['$rootScope', 'timePicker', function ($rootScope, timePicker) {

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

  var getSchedule = function (user) {
    var availability = user.get('availability');
    var totalHours = 0;

    for (var day in availability) {
      for (var schedule in availability[day]) {
        var s = availability[day][schedule];

        // add redundant info
        
        totalHours += (s.endsAt - s.startsAt)/3600;

        if (typeof s.startsAt == 'number')
          s.startsAt = timePicker(s.startsAt);
        if (typeof s.endsAt == 'number')
          s.endsAt = timePicker(s.endsAt);

        s.id = schedule;
        s.day = day;
      }
    }
    return {availability: availability, totalHours: totalHours};
  };
  
  return function () {

    if (!Parse.User.current()) {
      $rootScope.currentUser = {
        name : '',
        hourlyTarget : 40,
        companies : {},
        vehicles : getVehicles(),
        availability : {},
        totalHours : 0,
      };
      return;
    }
    $rootScope.currentUser = Parse.User.current();
    Parse.User.current().fetch().then(function (user) {

      var schedule = getSchedule(user);

      angular.extend($rootScope.currentUser, {
        name : user.get('name'),
        hourlyTarget : user.get('target'),
        companies : getCompanies(user),
        vehicles : getVehicles(user),
        availability : schedule.availability,
        totalHours : schedule.totalHours,
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
