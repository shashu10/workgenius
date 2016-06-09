angular.module('parseData', ['workgenius.constants', 'workgenius.earnings', 'parseUtils', 'parseShifts', 'integrations'])
    // Remove redundant data and format it to minimize storage
    .factory('formatUploadData', ['$rootScope', formatUploadData])
    .factory('setUserData', ['$rootScope', 'formatUploadData', setUserData])

    .factory('getUserData', ['$rootScope', '$q', '$interval', '$ionicPopup', 'fakeShifts', 'fakeAvailableShifts', 'getShifts', 'setupPush', 'connectedShifts', 'eligibilities', getUserData])
    .factory('getCompanyData', ['$rootScope', 'companies', getCompanyData]);

function setUserData($rootScope, formatUploadData) {

    return {
        save: function(type, success, failure) {
            if (!Parse.User.current()) return success && success();

            var data = formatUploadData[type]();
            
            if (!data) console.log('user property to save not specified');

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

        var found = _.find(array, function(o) { return o.name === workType.get('name'); });

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

function getUserData($rootScope, $q, $interval, $ionicPopup, fakeShifts, fakeAvailableShifts, getShifts, setupPush, connectedShifts, eligibilities) {

    var Eligibility = Parse.Object.extend("Eligibility");

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
        var car = _.find(user && user.get('vehicles'), function(v) { return v.indexOf('car') > -1; });

        return [{
            name: "walking",
            icon: "ion-ios-body",
            selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('none') > -1
        }, {
            name: "bicycle",
            icon: "ion-android-bicycle",
            selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('bicycle') > -1
        }, {
            name: "motorbike",
            icon: "ion-android-bicycle",
            selected: !!user && !!user.get('vehicles') && user.get('vehicles').indexOf('motorbike') > -1
        }, {
            name: "car",
            info: (car && car.substring(5)) || "",
            icon: "ion-android-car",
            selected: !!car
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
        if (isDemoUser) connectedShifts.updateWith(fakeAvailableShifts);
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

    function processEligibility(object) {

        var eligibility = [];

        for (var i = 0; i < object.length; i++) {
            var el = object[i];
            var company = el.get('company') && el.get('company').get('name');

            eligibility.push({
                id: el.id,
                company: company,
                eligible: el.get('eligible'),
                interested: el.get('interested'),
                connected: el.get('connected'),
                username: el.get('username'),
                token: el.get('token'),
                tokenRefreshedAt: el.get('tokenRefreshedAt'),
                workerId: el.get('workerId'),
                vehicle_id: el.get('vehicle_id'),
                object: el
            });

            // Append shifts
            connectedShifts.appendNewShifts(el.get('shifts'), company);
        }

        $rootScope.currentUser.eligibility = eligibility;
        eligibilities.refreshAllTokens();
        return getShifts();

        // Get Shift List
    }
    function processUserInfo(user) {

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

        // Legacy
        $rootScope.device.platform = user.get('platform') || $rootScope.device.platform;
        $rootScope.device.carrier = user.get('carrier') || $rootScope.device.carrier;
        $rootScope.device.model = user.get('model') || $rootScope.device.model;

        // New version
        var deviceInfo = user.get('deviceInfo');
        // if device info is empty, set it.
        if (!deviceInfo) {
            $rootScope.currentUser.save({
                deviceInfo : {
                    platform: $rootScope.device.platform,
                    carrier: $rootScope.device.carrier,
                    model: $rootScope.device.model,
                }
            });

        // else, use it to set rootscope device
        } else {
            $rootScope.device.platform = deviceInfo.platform || $rootScope.device.platform;
            $rootScope.device.carrier = deviceInfo.carrier || $rootScope.device.carrier;
            $rootScope.device.model = deviceInfo.model || $rootScope.device.model;
        }

        angular.extend($rootScope.currentUser, {
            name: user.get('name') || '',
            email: user.get('email') || '',
            phone: user.get('phone') || '',
            target: user.get('target') || 0,
            strikes: user.get('strikes') || 0,
            appState: user.get('appState') || {},
            address: user.get('address') || {},
            dob: user.get('dob') || undefined,
            ssn: user.get('ssn') || "",
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
    }
    return function(newUser) {

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

            deferred.resolve(true);

            var p1 = Parse.User.current().fetch().then(processUserInfo, function error(err) {
                console.log(err);
                Parse.User.logOut();
                console.log('Something went wrong. Probably user doesn\'t exist');
                console.log(error);
                setDefaultPrefs('AJ Shewki', 'aj@workgeni.us', false);
                Raven.setUserContext();
                mixpanel.identify();
            });

            var p2 = getEligibility().then(processEligibility);

            var p3 = getShifts().then(function (shifts) {
                $rootScope.currentUser.shifts = shifts;
            });

            // When everything is done, refresh scope;
            Parse.Promise.when([p1, p2, p3])
            .then(function() {
                $rootScope.$apply();
                setupPush();
            });
        }

        return deferred.promise;
    };
}

function formatUploadData($rootScope) {

    var formatTargetHours = function() {
        return {target: Number($rootScope.currentUser.target)};
    };

    var formatVehicles = function() {

        var filtered = _($rootScope.currentUser.vehicles)
        .chain()
        .filter(function (vehicle) {
            return vehicle.selected;
        })
        // First convert to dates
        .map(function(vehicle) {
            return vehicle.name + (vehicle.info ? ": " + vehicle.info : "");
        })
        .value();

        return {vehicles: filtered};
    };

    var formatWorkTypes = function() {

        var selected = [];
        for (var type in $rootScope.currentUser.workTypes) {
            if ($rootScope.currentUser.workTypes[type])
                selected.push(type);
        }
        return {workTypes: selected};
    };

    var formatAvailability = function() {
        // Total shown in menu and avail pages. Recalculated because availability was set & saved
        reCalculateTotalHours();
        return {availability : $rootScope.currentUser.availability};
    };
    var formatAvailabilityQuestions = function() {
        return {availabilityQuestions : $rootScope.currentUser.availabilityQuestions};
    };

    var formatBlockedDays = function() {
        return {blockedDays: $rootScope.currentUser.blockedDays};
    };

    var formatAppState = function() {
        return {appState: $rootScope.currentUser.appState || {}};
    };

    var formatPersonalInfo = function() {
        return {
            address: JSON.parse(angular.toJson($rootScope.currentUser.address)), // to remove $$hashkey
            dob: $rootScope.currentUser.dob,
            ssn: $rootScope.currentUser.ssn,
        };
    };
    var formatDevice = function() {
        return {deviceInfo: $rootScope.device};
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
        availabilityQuestions: formatAvailabilityQuestions,
        availability: formatAvailability,
        blockedDays: formatBlockedDays,
        appState: formatAppState,
        personalInfo: formatPersonalInfo,
        device: formatDevice,
    };
}