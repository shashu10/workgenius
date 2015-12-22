angular.module('parseData', ['workgenius.constants'])
// Remove redundant data and format it to minimize storage
.factory('formatUploadData', ['$rootScope', formatUploadData])
.factory('setUserData', ['$rootScope', 'formatUploadData', setUserData])
.factory('setEligibility', ['$rootScope', 'formatUploadData', setEligibility])
.factory('getUserData', ['$rootScope', '$q', getUserData])
.factory('getCompanyData', ['$rootScope', '$q', 'companies', getCompanyData]);

function setEligibility ($rootScope, formatUploadData) {

  var findEligibility = function (name) {
    var el = $rootScope.currentUser.eligibility;
    for (var i = 0; i < el.length; i++) {
      if (name === el[i].company){
        return el[i];
      }
    }
    return undefined;
  };
  var removeEligibility = function (name) {
    var el = $rootScope.currentUser.eligibility;
    for (var i = 0; i < el.length; i++) {
      if (name === el[i].company){
        el.splice(i, 1);
        return;
      }
    }
  };
  var createEligibility = function (name) {
      var eligibility = new Parse.Object("Eligibility");
      eligibility.set("worker", Parse.User.current());
      eligibility.set("company", getCompany(name));
      eligibility.set("interested", true);

      // Wrapper obj
      var el = {
        id         : undefined,
        company    : name,
        eligible   : undefined,
        interested : true,
        object     : eligibility
      };

      $rootScope.currentUser.eligibility.push(el);
      return el;
  };
  var getCompany = function (name) {
    for (var i = 0; i < $rootScope.companyList.length; i++) {
      var comp = $rootScope.companyList[i];
      if (comp.name === name) {
        return comp.object;
      }
    }
  };

  return {
    save: function (success) {

      var successWrapper = function () {
        console.log('saved eligibility');
        if (success) success();
      };

      // Save the ones that have changed
      for (var i = 0; i < $rootScope.currentUser.eligibility.length; i++) {

        var el = $rootScope.currentUser.eligibility[i];

        var changed = false;

        // Save if it is a new parse object
        if (el.id === undefined)
          changed = true;

        // Compare saved parse obj and wrapper obj
        // Designed to work with wg-save-bar
        if (el.eligible !== el.object.get('eligible')) {
          changed = true;
          el.object.set("eligible", el.eligible);
        }

        if (el.interested !== el.object.get('interested')) {
          changed = true;
          el.object.set("interested", el.interested);
        }

        if (changed) el.object.save().then(successWrapper);
      }
    },
    toggleInterest: function (name, toggle) {
      // If eligibility exists, get it. Else create new parse object
      var el = findEligibility(name) || createEligibility(name);

      // If unselecting parse object not in DB, just delete it
      // Makes my life simpler with wg-save-bar
      if (toggle === false && el.id === undefined)
        removeEligibility(name);

      else
        el.interested = toggle;
    },
    findEligibility: findEligibility
  };
}

function setUserData ($rootScope, formatUploadData) {

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
}

// Set with static value and asynchronously update from database
function getCompanyData ($rootScope, $q, companies) {
  $rootScope.companyList = companies;

  return function () {
    var Company = Parse.Object.extend("Company");
    var query = new Parse.Query(Company);
    query.equalTo("location", "san francisco");

    query.find({
      success: function(results) {
        // Do something with the returned Parse.Object values
        var companyList = [];
        for (var i = 0; i < results.length; i++) {
          companyList.push({
            name: results[i].get('name'),
            description : results[i].get('description'),
            object: results[i]
          });
        }
        $rootScope.companyList = companyList;
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });    
  };
}
function getUserData ($rootScope, $q) {

  var Eligibility = Parse.Object.extend("Eligibility");

  var getEligibility = function (user) {
    var query = new Parse.Query(Eligibility);
    query.equalTo("worker", Parse.User.current());
    return query.find();
  };

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
      companies[user.get('companies')[company.name]] = {status: company.status};
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
    return user.get('blockedDays') || [];
  };

  var getAvailability = function (user) {
    return user.get('availability') || {};
  };

  var calculateTotalHours = function (user) {
    var availability = getAvailability(user);
    var totalHours = 0;
    for (var i = 0; i < $rootScope.days.length; i++) {
      var day = $rootScope.days[i];
      if (availability[day]) {
        totalHours += availability[day].length;
      }
    }
    return totalHours;
  };

  var setDefaultPrefs = function (name, email) {
    angular.extend($rootScope.currentUser, {
      name             : name,
      email            : email,
      target           : 40,
      cancellations    : 0,
      totalHours       : 0,
      vehicles         : getVehicles(),
      eligibility      : [],
      blockedDays      : [],
      availability     : {},
      companies        : {},
      workTypes        : {},
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

      // setup default values while actual values load 
      setDefaultPrefs('', '');

      Parse.User.current().fetch().then(function (user) {

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
          availability     : getAvailability(user),
          totalHours       : calculateTotalHours(user)
        });
        
        return getEligibility();

      }).then(function(results) {

        var eligibility = [];

        for (var i = 0; i < results.length; i++) {
          var el = results[i];


          eligibility.push({
            id         : el.id,
            company    : el.get('company') && el.get('company').get('name'),
            eligible   : el.get('eligible'),
            interested : el.get('interested'),
            object     : el
          });
        }

        $rootScope.currentUser.eligibility = eligibility;

        deferred.resolve(true);
      });
    }

    return deferred.promise;
  };
}
function formatUploadData ($rootScope) {

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
        if ($rootScope.currentUser.companies[company] === true)
          selected.push({name: company, status: 1});
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
    reCalculateTotalHours();
    return $rootScope.currentUser.availability;
  };

  var formatBlockedDays = function () {
    return $rootScope.currentUser.blockedDays;
  };

  var formatAppState = function () {
    return $rootScope.currentUser.appState || {};
  };

  var reCalculateTotalHours = function () {
    var totalHours = 0;
    for (var i = 0; i < $rootScope.days.length; i++) {
      var day = $rootScope.days[i];
      if ($rootScope.currentUser.availability[day]) {
        totalHours += $rootScope.currentUser.availability[day].length;
      }
    }
    $rootScope.currentUser.totalHours = totalHours;
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
}