angular.module('parseData', ['workgenius.constants', 'parseUtils'])
    // Remove redundant data and format it to minimize storage
    .factory('formatUploadData', ['$rootScope', formatUploadData])

    .factory('claimShift', ['setEligibility', '$interval', 'getConnectedShifts', claimShift])
    .factory('acknowledgeShifts', ['$q', '$rootScope', '$ionicPopup', acknowledgeShifts])

    .factory('setUserData', ['$rootScope', 'formatUploadData', setUserData])
    .factory('setEligibility', ['$rootScope', 'getConnectedShifts', setEligibility])
    .factory('setShifts', ['$rootScope', '$q', 'setEligibility', setShifts])

    .factory('getConnectedShifts', ['$rootScope', getConnectedShifts])
    .factory('getShifts', ['$q', '$rootScope', 'acknowledgeShifts', 'debounce', getShifts])
    .factory('getUserData', ['$rootScope', '$q', '$interval', '$ionicPopup', 'fakeShifts', 'fakeAvailableShifts', 'getShifts', 'setupPush', getUserData])
    .factory('getCompanyData', ['$rootScope', 'companies', getCompanyData]);

var Shift = Parse.Object.extend("Shift");

function setShifts($rootScope, $q, setEligibility) {
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
            var el = setEligibility.findEligibility(shift.company);

            console.log(shift);
            console.log(shift.object.get('shiftId'));
            Parse.Cloud.run('cancelShift', {
                startsAt: shift.startsAt.toString(),
                endsAt: shift.endsAt.toString(),
                shiftID: shift.id, // parse id
                companyShiftId: shift.object.get('shiftId'), // company shift id
                company: shift.company,
                token : el.token,
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

// Update available shifts accordingly
function claimShift(setEligibility, $interval, getConnectedShifts) {

    return function (shift, success, failure) {
        console.log("claiming");
        if (!Parse.User.current()) return success && success();

        var el = setEligibility.findEligibility(shift.name);
        return Parse.Cloud.run('claimShift',
        {
            shiftId : shift.id,
            swapId : shift.swapId, // only for wiw swaps
            companyId : el.object.get('company').id,
            company : el.company,
            token : el.token,
        },
        {
            success: function(shift) {
                console.log('success');
                // update shifts after claiming one
                getConnectedShifts(el);
                if (success) success();
            },
            error: function(error) {
                console.log('Could not claim shift');
                console.log(error);
                // update shifts. Error might have been caused because of out of date shifts
                getConnectedShifts(el);
                if (failure) failure();
            }
        });
    };
}

function getConnectedShifts($rootScope) {
    return function(el, success, failure) {

        return Parse.Cloud.run('getConnectedShifts',
        {
            eligibilityId : el.id,
            company : el.company,
            username : el.username,
            token : el.token,
        },
        {
            success: function(shifts) {

                el.object.set('shifts', shifts);
                el.shifts = shifts;

                appendNewShifts(shifts, el.company, "san Francisco", $rootScope);

                if (success) success();
            },
            error: function(error) {
                console.log('Could not get connected shifts');
                console.log(error);
                if (failure) failure();
            }
        });
    };
}

function appendNewShifts(shifts, company, location, $rootScope) {
    // format shifts
    var shiftsFormatted = formatAvailableShifts(shifts, company, location);

    // Get all current available shifts
    var availShifts = $rootScope.currentUser.availableShifts;

    // Remove current company shifts
    availShifts = removeCompanyShifts(availShifts, company);

    // add company shifts
    // Merges two arrays
    availShifts.push.apply(availShifts, shiftsFormatted);

    $rootScope.currentUser.availableShifts = availShifts;
    
}

function setEligibility($rootScope, getConnectedShifts) {

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

    // Save parse object
    var saveEligObj = function(el, success) {

        el.object.save().then(function(val) {
            // Wrapper obj
            el.id = val.id;
            if (success) success();
        });
    };

    var authConnectedAccount = function(el, success, failure) {

        if (!Parse.User.current()) return success && success();

        var companyId = getCompany(el.company).id;
        return Parse.Cloud.run('authConnectedAccount',
            {
                eligibilityId : el.id,
                companyId : companyId,
                company : el.company,
                username : el.username,
                password : el.password,
            },
            {
                success: function(result) {
                    console.log(result);
                    el.object.set('token', result.token);
                    el.token = result.token;
                    el.id = result.id; // In case it's a new eligibility that has not had it's ID set
                    getConnectedShifts(el);
                    if (success) success();
                },
                error: function(error) {
                    console.log('Could not connect account');
                    console.log(error);
                    if (failure) failure();
                }
            });
    };

    // Updates eligibility parse obj with params. Returns the param that changed
    var updateAndGetDiff = function (el) {
        var diff = false;

        // Save if it is a new parse object
        if (el.id === undefined)
            diff = 'id';

        // Compare saved parse obj and wrapper obj
        // Designed to work with wg-save-bar
        if (el.eligible !== el.object.get('eligible')) {
            diff = 'eligible';
            el.object.set("eligible", el.eligible);
        }

        if (el.interested !== el.object.get('interested')) {
            diff = 'interested';
            el.object.set("interested", el.interested);
        }

        if (el.connected !== el.object.get('connected')) {
            diff = 'connected';
            el.object.set("connected", el.connected);
        }

        if (el.username !== el.object.get('username')) {
            diff = 'username';
            el.object.set("username", el.username);
        }

        if (el.password && (el.password !== el.object.get('password'))) {
            diff = 'password';
            el.object.set("password", el.password);
        }
        console.log('diff: ' + diff);
        return diff;
    };

    return {
        saveAll: function(success, failure) {

            // Save the ones that have changed
            for (var i = 0; i < $rootScope.currentUser.eligibility.length; i++) {

                var el = $rootScope.currentUser.eligibility[i];

                this.save(el, success, failure);
            }
        },
        save: function(el, success, failure) {
            // If password changed, we should connect that account and encrypt password
            var diff = updateAndGetDiff(el);
            if (diff) {
                if (diff === "password")
                    authConnectedAccount(el, success, failure);
                else
                    saveEligObj(el, success);
            }
        },
        toggleConnectedCompany: function(name, toggle, username, password, success, failure) {
            // If eligibility exists, get it. Else create new parse object
            var el = findEligibility(name) || createEligibility(name);

            // If unselecting parse object not in DB, just delete it
            // Makes my life simpler with wg-save-bar
            if (toggle === false && el.id === undefined)
                removeEligibility(name);

            else {
                el.connected = toggle;
                el.username = username;
                el.password = password;
            }
            this.save(el, success, failure);
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
            if (!Parse.User.current()) return success && success();

            var data = {};
            data[type] = formatUploadData[type]();

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
        }
    };
}

// Set with static value and asynchronously update from database
function getCompanyData($rootScope, companies) {
    $rootScope.companyList = companies;

    function createWorkTypeAndAppend(workType, array, company) {

        var found = workType && array && array.find && array.find(function(element, index, array) {
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
                        object: c,
                        toggle: false,
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

function acknowledgeShifts($q, $rootScope, $ionicPopup) {
    var shiftDateFormatter = function(date) {
        return moment(date).format('ddd, MMM Do');
    };
    var formatAMPM = function(date) {
        return moment(date).format('ha');
    };
    var shiftEarnings = function(shift) {
        return (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * 15;
    };
    var batchSave = function(shifts) {

        var arr = [];
        for (var i = 0; i < shifts.length; i++) {
            var shift = shifts[i];

            var shiftObj = new Shift();
            shiftObj.id = shift.id;
            shiftObj.set('acknowledgedAt', new Date());
            shiftObj.set('acknowledged', true);

            arr.push(shiftObj);
        }

        Parse.Object.saveAll(arr, {
            success: function(list) {
                console.log('success batchSave ' + arr.length + ' shifts');
            },
            error: function(error) {
                console.log(error);
            }
        });
    };
    return function(shifts) {
        if (!shifts.length) return;

        var scope = $rootScope.$new();
        scope.newShifts = shifts;

        scope.shiftDateFormatter = shiftDateFormatter;
        scope.formatAMPM = formatAMPM;
        scope.shiftEarnings = shiftEarnings;

        $ionicPopup.show({
            cssClass: 'shift-popup',
            template: '<ion-list><ion-item ng-repeat="shift in newShifts"><img ng-src="img/companies/{{shift.company.toLowerCase() | spaceless}}.png" alt=""><p><strong>{{shift.company.toLowerCase() | capitalize}}</strong> | Earnings Est: ${{shiftEarnings(shift)}}</p><p>{{shiftDateFormatter(shift.startsAt)}}, {{formatAMPM(shift.startsAt) | uppercase}} - {{formatAMPM(shift.endsAt) | uppercase}}</p></ion-item><p>You can cancel {{newShifts.length > 1 ? "these shifts" : "this shift"}} after tapping acknowledge</p></ion-list>',
            title: 'You have new shifts!',
            scope: scope,
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'Acknowledge',
                type: 'button-positive',
                onTap: function(e) {
                    batchSave(shifts);

                }
            }]
        });
    };
}

function getShifts($q, $rootScope, acknowledgeShifts, debounce) {

    var debouncedAcknowledge = debounce(function (newShifts) {
      acknowledgeShifts(newShifts);
    }, 1000, false);

    var shiftSort = function(a, b) {
        if (a.startsAt.getTime() > b.startsAt.getTime())
            return 1;

        return -1;
    };
    var formatShifts = function(results) {
        var shifts = [];
        var newShifts = [];

        for (var i = 0; i < results.length; i++) {
            var sh = results[i];

            if (moment(sh.get('endsAt')).isBefore(moment().subtract(5, 'hours')) || // If shift was finished, don't show. Leave them for 5 hours from the current time.
                sh.get('company') === undefined ||
                sh.get('startsAt') === undefined ||
                sh.get('endsAt') === undefined) {                                  // if shift doesn't have companies assigned
                continue;
            }
            var newShift = {
                id: sh.id,
                company: sh.get('company') && sh.get('company').get('name'),
                startsAt: sh.get('startsAt'),
                endsAt: sh.get('endsAt'),
                acknowledged: sh.get('acknowledged'),
                // date for ion-cal needs to be in format: YYYY-MM-DD 2015-01-01
                // Flex cal error displays one day behind date
                date: new Date(sh.get('startsAt').getFullYear(), sh.get('startsAt').getMonth(), sh.get('startsAt').getDate()),
                // Changed ion calendar
                // date       : moment(sh.get('startsAt')).add(1, 'day').format('YYYY-MM-DD'),
                object: sh
            };

            shifts.push(newShift);

            if (!newShift.acknowledged) {
                newShifts.push(newShift);
            }
        }

        shifts.sort(shiftSort);
        newShifts.sort(shiftSort);

        // Get shifts is called in app.js and schedule.js in a short interval
        debouncedAcknowledge(newShifts);

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

function getUserData($rootScope, $q, $interval, $ionicPopup, fakeShifts, fakeAvailableShifts, getShifts, setupPush) {

    var Eligibility = Parse.Object.extend("Eligibility");
    var Shift = Parse.Object.extend("Shift");

    var getEligibility = function() {
        var query = new Parse.Query(Eligibility);
        query.include('company');
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
            availableShifts: fakeAvailableShifts,
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

    function askAndSetupPush() {
        $ionicPopup.show({
            template: '<p>We\'d like to notify you about shifts that are assigned to you! To do this we need you to allow push notifications.</p>',
            title: 'Want to hear about new shifts?',
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'No',
                type: 'button-dark',
                onTap: function(e) {
                    return false;
                }
            }, {
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    return true;
                }
            }]
        })
        // Using then closes the popup and 'Then' executes the following code
        .then(function(yes) {
            // Pressed yes Button
            if (yes) {
                setupPush();
            }
        });
    }

    return function(newUser, name, email) {

        // To do some async stuff after data has loaded
        var deferred = $q.defer();

        $rootScope.currentUser = Parse.User.current() || {};

        // Only for demo purposes
        if (!Parse.User.current()) {

            setDefaultPrefs('AJ Shewki', 'aj@workgeni.us', true);
            Raven.setUserContext();
            mixpanel.identify();

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

                // if (user.get('allowNotifications') === undefined) {
                //     askAndSetupPush();
                // }

                mixpanel.identify(user.id);
                // only special properties need the $
                mixpanel.people.set({
                    "$email": user.get('email'),
                    "$name": user.get('name'),
                    "$phone": user.get('phone'),
                    "$last_login": new Date(),
                    "$created": user.get('createdAt'),
                    "appVersion": $rootScope.appVersion,
                });
                Raven.setUserContext({
                    email: user.get('email'),
                    id: user.id,
                    appVersion: $rootScope.appVersion,
                });

                angular.extend($rootScope.currentUser, {
                    name: user.get('name') || '',
                    email: user.get('email') || '',
                    phone: user.get('phone') || '',
                    target: user.get('target') || 0,
                    strikes: user.get('strikes') || 0,
                    appState: user.get('appState') || {},
                    hoursTotal: user.get('hoursTotal') || {
                        day: 0,
                        week: 0,
                        month: 0,
                        lifetime: 0
                    },
                    earningsTotal: user.get('earningsTotal') || {
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
                var shifts = [];

                for (var i = 0; i < results.length; i++) {
                    var el = results[i];
                    var company = el.get('company') && el.get('company').get('name');

                    eligibility.push({
                        id: el.id,
                        company: company,
                        eligible: el.get('eligible'),
                        interested: el.get('interested'),
                        connected: el.get('connected'),
                        username: el.get('username'),
                        token: el.get('token'),
                        object: el
                    });

                    // Merges two arrays
                    shifts.push.apply(shifts, formatAvailableShifts(el.get('shifts'), company, "san Francisco"));
                }

                // Sort in ascending order
                shifts.sort(function(a, b) {
                    return moment(a.startsAt).isBefore(b.startsAt) ? -1 : 1;
                });
                $rootScope.currentUser.availableShifts = shifts;
                $rootScope.currentUser.eligibility = eligibility;

                return getShifts();

                // Get Shift List
            }).then(function(shifts) {

                $rootScope.currentUser.shifts = shifts;

                deferred.resolve(true);
                $rootScope.$apply();

                setupPush();
            });
        }

        return deferred.promise;
    };
}

function removeCompanyShifts(shifts, company) {
    return _.filter(shifts, function(o) { return shifts.name !== company; });
}

function formatAvailableShifts(shifts, company, defaultLocation) {
    shifts = shifts || [];
    return _.map(shifts, function(s) {
        s.name = company;
        s.location = defaultLocation;
        s.startsAt = new Date(s.startsAt);
        s.endsAt = new Date(s.endsAt);
        return s;
    });

    // Needs to be this format
    // {
    //   name: "postmates",
    //   location: "san francisco",
    //   startsAt: "10:30pm",
    //   endsAt: "12:30am",
    //   flex: true,
    //   bonus: "+20%",
    //   notes: [
    //     "+20%",
    //     "Flex Shift"
    //   ]
    // }
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
