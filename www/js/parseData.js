angular.module('parseData', ['workgenius.constants'])
    // Remove redundant data and format it to minimize storage
    .factory('formatUploadData', ['$rootScope', formatUploadData])
    .factory('setUserData', ['$rootScope', 'formatUploadData', setUserData])
    .factory('setEligibility', ['$rootScope', setEligibility])
    .factory('setShifts', ['$rootScope', '$q', setShifts])
    .factory('getShifts', ['$q', '$rootScope', getShifts])
    .factory('checkUpdates', ['$rootScope', '$ionicPopup', checkUpdates])
    .factory('getUserData', ['$rootScope', '$q', '$interval', 'fakeShifts', 'getShifts', getUserData])
    .factory('getCompanyData', ['$rootScope', 'companies', getCompanyData]);

function checkUpdates($rootScope, $ionicPopup) {
    return function (currentVersion) {
        Parse.Cloud.run('getVersion', { platform: 'ios'}, {
            success: function(app) {
                console.log('new app version: ' + app.version);

                var scope = $rootScope.$new();
                scope.app = app;

                if (currentVersion < app.version) {
                    $ionicPopup.show({
                        template: '<p ng-if="app.features.length">New features in v{{app.version}}</p><ul><li ng-repeat="feature in app.features">- {{feature}}</li></ul>',
                        title: 'App update available!',
                        scope: scope,
                        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                            text: 'Later',
                            type: 'button-dark',
                            onTap: function(e) {
                                return false;
                            }
                        }, {
                            text: 'Install',
                            type: 'button-positive',
                            onTap: function(e) {
                                return true;
                            }
                        }]
                    })
                    // Using then closes the popup and 'Then' executes the following code
                    .then(function(install) {
                        // Pressed Install Button
                        if (install) {
                            window.location = app.url;
                        }
                    });
                }
            },
            error: function(error) {
                console.log('could get version');
                console.log(error);
            }
        });
    };
}

function setShifts($rootScope, $q) {
    var removeShift = function(shift, refresh) {
        var start = moment(shift.startsAt);
        if (start.isBefore(moment().add(72, 'hours'))) {
            $rootScope.currentUser.strikes++;
        }

        // remove it from the view
        var idx = $rootScope.currentUser.shifts.indexOf(shift);
        $rootScope.currentUser.shifts.splice(idx, 1);

        // Maked the $watch fire in ion cal
        $rootScope.currentUser.shifts = angular.copy($rootScope.currentUser.shifts);

        if (refresh) { // was actually updated asynchronously
            $rootScope.$apply();
        }
    };
    return {
        cancel: function(shift) {

            // Running demo user
            if (!shift.object) {
                var deferred = $q.defer();
                deferred.resolve(false);
                removeShift(shift);
                return deferred.promise;
            }

            Parse.Cloud.run('cancelShift', {
                startsAt: shift.startsAt.toString(),
                shiftID: shift.id,
            }, {
                success: function(result) {
                    console.log('removed shift');
                    removeShift(shift, true);
                },
                error: function(error) {
                    console.log('could not cancel Shift');
                    console.log(error);
                }
            });
        }
    };
}

function setEligibility($rootScope) {

    var findEligibility = function(name) {
        var el = $rootScope.currentUser.eligibility;
        for (var i = 0; i < el.length; i++) {
            if (name === el[i].company) {
                return el[i];
            }
        }
        return undefined;
    };
    var removeEligibility = function(name) {
        var el = $rootScope.currentUser.eligibility;
        for (var i = 0; i < el.length; i++) {
            if (name === el[i].company) {
                el.splice(i, 1);
                return;
            }
        }
    };
    var createEligibility = function(name) {
        var eligibility = new Parse.Object("Eligibility");
        eligibility.set("worker", Parse.User.current());
        eligibility.set("company", getCompany(name));
        eligibility.set("interested", true);

        // Wrapper obj
        var el = {
            id: undefined,
            company: name,
            eligible: undefined,
            interested: true,
            object: eligibility
        };

        $rootScope.currentUser.eligibility.push(el);
        return el;
    };
    var getCompany = function(name) {
        for (var i = 0; i < $rootScope.companyList.length; i++) {
            var comp = $rootScope.companyList[i];
            if (comp.name === name) {
                return comp.object;
            }
        }
    };

    var saveObject = function(el, success) {
        el.object.save().then(function(val) {
            // Wrapper obj
            el.id = val.id;

            if (success) success();
        });
    };

    return {
        save: function(success) {

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

                if (changed) saveObject(el, success);
            }
        },
        toggleInterest: function(name, toggle) {
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

function setUserData($rootScope, formatUploadData) {

    return {
        save: function(type, success, failure) {
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
function getCompanyData($rootScope, companies) {
    $rootScope.companyList = companies;

    function createWorkTypeAndAppend(workType, array, company) {

        var found = array.find(function(element, index, array) {
            return element.name === workType.get('name');
        });

        if (!found) {
            found = {
                name: workType.get('name').toLowerCase(),
                title: workType.get('title').toLowerCase(),
                icon: workType.get('icon').toLowerCase(),
                showInApp: workType.get('showInApp'),
                earningsEst: 0,
                companies: []
            };
            array.push(found);
        }

        found.companies.push(company);
    }

    function countAvailable(companies) {
        var count = 0;
        companies.forEach(function(c) {
            if (c.availableNow)
                count++;
        });
        return count;
    }

    function setupWorkTypes(workTypes) {

        // Sort in order of most available companies
        workTypes.sort(function(a, b) {
            var aCount = countAvailable(a.companies);
            var bCount = countAvailable(b.companies);

            if (aCount > bCount) return -1;
            else if (aCount < bCount) return 1;
            else if (a.companies.length > a.companies.length) return -1;
            else if (a.companies.length < a.companies.length) return 1;
            else return 0;
        });

        // Get earnings estimate from companies
        workTypes.forEach(function(wType) {
            var count = 0;
            var total = 0;
            wType.companies.forEach(function(c) {
                if (c.availableNow) {
                    count++;
                    total += c.earningsEst;
                }
            });
            wType.earningsEst = Math.floor(total / count);
        });
    }
    return function() {
        var Company = Parse.Object.extend("Company");
        var query = new Parse.Query(Company);
        query.include('workType');
        query.equalTo("location", "san francisco");

        query.find({
            success: function(results) {
                // Do something with the returned Parse.Object values
                var companyList = [];
                var workTypes = [];

                for (var i = 0; i < results.length; i++) {
                    var c = results[i];
                    var company = {
                        name: c.get('name'),
                        description: c.get('description').toLowerCase(),
                        earningsEst: c.get('earningsEst'),
                        myCompanies: c.get('myCompanies'),
                        availableNow: c.get('availableNow'),
                        object: c
                    };
                    companyList.push(company);

                    createWorkTypeAndAppend(c.get('workType'), workTypes, company);
                }

                setupWorkTypes(workTypes);

                $rootScope.workTypes = workTypes;
                $rootScope.companyList = companyList;
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    };
}

function getShifts($q, $rootScope) {
    var Shift = Parse.Object.extend("Shift");

    var formatShifts = function(results) {
        var shifts = [];

        for (var i = 0; i < results.length; i++) {
            var sh = results[i];

            // If shift was finished, don't show. Leave them for 5 hours from the current time.
            if (moment(sh.get('endsAt')).isBefore(moment().subtract(5, 'hours'))) {
                continue;
            }

            shifts.push({
                id: sh.id,
                company: sh.get('company') && sh.get('company').get('name'),
                startsAt: sh.get('startsAt'),
                endsAt: sh.get('endsAt'),
                // date for ion-cal needs to be in format: YYYY-MM-DD 2015-01-01
                // Flex cal error displays one day behind date
                date: new Date(sh.get('startsAt').getFullYear(), sh.get('startsAt').getMonth(), sh.get('startsAt').getDate()),
                // Changed ion calendar
                // date       : moment(sh.get('startsAt')).add(1, 'day').format('YYYY-MM-DD'),
                object: sh
            });
        }

        shifts.sort(function(a, b) {
            if (a.startsAt.getTime() > b.startsAt.getTime())
                return 1;

            return -1;
        });

        return shifts;
    };

    return function() {

        if (!Parse.User.current()) {
            var deferred = $q.defer();
            deferred.resolve($rootScope.currentUser.shifts);
            return deferred.promise;
        }

        var query = new Parse.Query(Shift);
        query.equalTo("worker", Parse.User.current());
        query.descending('startsAt');

        return query.find().then(formatShifts);
    };
}

function getUserData($rootScope, $q, $interval, fakeShifts, getShifts) {

    var Eligibility = Parse.Object.extend("Eligibility");
    var Shift = Parse.Object.extend("Shift");

    var getEligibility = function() {
        var query = new Parse.Query(Eligibility);
        query.equalTo("worker", Parse.User.current());
        return query.find();
    };

    var getWorkTypes = function(user) {
        var workTypes = {};
        for (var type in user.get('workTypes')) {
            workTypes[user.get('workTypes')[type]] = true;
        }
        return workTypes;
    };

    var getVehicles = function(user) {
        return [{
            name: "car",
            icon: "ion-android-car",
            selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('car') > -1
        }, {
            name: "bicycle",
            icon: "ion-android-bicycle",
            selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('bicycle') > -1
        }, {
            name: "motorbike",
            icon: "ion-android-bicycle",
            selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('motorbike') > -1
        }, ];
    };

    var getBlockedDays = function(user) {
        return user.get('blockedDays') || [];
    };

    var getAvailability = function(user) {
        return user.get('availability') || {};
    };

    var calculateTotalHours = function(user) {
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

    var setDefaultPrefs = function(name, email, isDemoUser) {

        angular.extend($rootScope.currentUser, {
            name: name,
            email: email,
            phone: isDemoUser ? "4151234567" : "",
            target: 0,
            strikes: 0,
            totalHours: 0,
            vehicles: getVehicles(),
            eligibility: [],
            blockedDays: [],
            availability: {},
            workTypes: {},
            appState: {},
            shifts: isDemoUser ? fakeShifts : [],
            earningsTotal: {
                day: 188,
                week: 720,
                month: 2410,
                lifetime: 11002
            },
            hoursTotal: {
                day: 8,
                week: 31,
                month: 130,
                lifetime: 846
            },
        });
    };

    return function(newUser, name, email) {

        // To do some async stuff after data has loaded
        var deferred = $q.defer();

        $rootScope.currentUser = Parse.User.current() || {};

        // Only for demo purposes
        if (!Parse.User.current()) {

            setDefaultPrefs('AJ Shewki', 'aj@workgeni.us', true);

            deferred.resolve(false);
            // Setting default values immediately. And saving them. This methos did not save values after user signed up.
            // // New use needs default values immediately for onboarding flow
            // } else if (newUser) {
            //   setDefaultPrefs(name, email);

            // Existing user must have their preferences fetched
        } else {

            // setup default values while actual values load 
            setDefaultPrefs();

            // Get User Information
            Parse.User.current().fetch().then(function(user) {

                mixpanel.identify(user.get('email'));

                angular.extend($rootScope.currentUser, {
                    name: user.get('name') || '',
                    email: user.get('email') || '',
                    phone: user.get('phone') || '',
                    target: user.get('target') || 0,
                    strikes: user.get('strikes') || 0,
                    appState: user.get('appState') || {},
                    earningsTotal: user.get('earningsTotal') || {
                        day: 0,
                        week: 0,
                        month: 0,
                        lifetime: 0
                    },
                    hoursTotal: user.get('hoursTotal') || {
                        day: 0,
                        week: 0,
                        month: 0,
                        lifetime: 0
                    },
                    vehicles: getVehicles(user),
                    workTypes: getWorkTypes(user),
                    blockedDays: getBlockedDays(user),
                    availability: getAvailability(user),
                    totalHours: calculateTotalHours(user)
                });

                return getEligibility();

                // Get Company Eligibility
            }).then(function(results) {

                var eligibility = [];

                for (var i = 0; i < results.length; i++) {
                    var el = results[i];


                    eligibility.push({
                        id: el.id,
                        company: el.get('company') && el.get('company').get('name'),
                        eligible: el.get('eligible'),
                        interested: el.get('interested'),
                        object: el
                    });
                }

                $rootScope.currentUser.eligibility = eligibility;

                return getShifts();

                // Get Shift List
            }).then(function(shifts) {

                $rootScope.currentUser.shifts = shifts;

                deferred.resolve(true);
                $rootScope.$apply();
            });
        }

        return deferred.promise;
    };
}

function formatUploadData($rootScope) {

    var formatTargetHours = function() {
        return Number($rootScope.currentUser.target);
    };

    var formatVehicles = function() {

        var filtered = $rootScope.currentUser.vehicles.filter(function(vehicle) {
            return vehicle.selected;
        }).map(function(item) {
            return item.name;
        });

        return filtered;
    };

    var formatWorkTypes = function() {

        var selected = [];
        for (var type in $rootScope.currentUser.workTypes) {
            if ($rootScope.currentUser.workTypes[type])
                selected.push(type);
        }
        return selected;
    };

    var formatAvailability = function() {
        reCalculateTotalHours();
        return $rootScope.currentUser.availability;
    };

    var formatBlockedDays = function() {
        return $rootScope.currentUser.blockedDays;
    };

    var formatAppState = function() {
        return $rootScope.currentUser.appState || {};
    };

    var reCalculateTotalHours = function() {
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
        target: formatTargetHours,
        vehicles: formatVehicles,
        workTypes: formatWorkTypes,
        availability: formatAvailability,
        blockedDays: formatBlockedDays,
        appState: formatAppState,
    };
}
