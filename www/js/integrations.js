angular.module('integrations', ['parseUtils', 'parseShifts'])
    .factory('eligibilities', ['$rootScope', 'connectedShifts', '$interval', eligibilities])

    .factory('connectedShifts', ['$rootScope', 'getCompanyEligibility', 'getShifts', connectedShifts]);

function connectedShifts($rootScope, getCompanyEligibility, getShifts) {
    function hasConflict(shift) {
        var start = new Date(shift.startsAt);
        var end = new Date(shift.endsAt);
        for (var i = 0; i < $rootScope.currentUser.shifts.length; i++) {
            var s = $rootScope.currentUser.shifts[i];
            // proof: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap/325964#325964
            // (StartA < EndB) and (EndA > StartB)
            if (s.startsAt < end && s.endsAt > start) {
                return true;
            }
        }
    }
    function appendNewShifts(shifts, company) {

        shifts = shifts || [];

        // Get all current available shifts in list form
        var availShifts = $rootScope.currentUser.availableShiftsArr || [];

        // Remove current company shifts
        removeCompanyShifts(availShifts, company);

        // add company name
        shifts = shifts.map(function (shift) {
            shift.company = company;
            return shift;
        });

        // Merge old and new shifts
        Array.prototype.push.apply(availShifts, shifts);

        updateWith(availShifts);

        // When is this called?
        // $rootScope.$apply();
    }
    function removeCompanyShifts(shifts, company) {
        _.remove(shifts, function(o) { return o.company === company; });
    }
    function getConnectedShifts(el, success, failure) {

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
                console.log(shifts);
                appendNewShifts(shifts, el.company);

                if (success) success();
                $rootScope.$apply();
            },
            error: function(error) {
                console.log('Could not get connected shifts');
                console.log(error);
                if (failure) failure();
            }
        });
    }
    // Sorting by primary param: startsAt and secondary param: endsAt
    // http://stackoverflow.com/questions/16426774/underscore-sortby-based-on-multiple-attributes
    function sortAndFormatShifts(shifts) {
        if (!shifts || shifts.length <= 1) return shifts;

        return _(shifts)
        .chain()
        // First convert to dates
        .map(function(s) {
            s.location = s.location || "san francisco";
            s.startsAt = new Date(s.startsAt);
            s.endsAt = new Date(s.endsAt);
            return s;
        })
        // Next sort by endsAt
        .sortBy(function(shift) {
            return shift.endsAt;

        // Lastly sort by starts. Shifts with same startsAt will be sorted by endsAt
        })
        .sortBy(function(shift) {
            return shift.startsAt;
        })
        .value();
    }

    function groupPostmatesShifts(days) {

        _.forEach(days, function function_name(day) {
            var shifts = day.shifts;
            // get postmates only shifts
            var PMShifts = _.remove(shifts, function (shift) {
                return shift.company === 'postmates';
            });
            if (!PMShifts.length) return;

            // Group contiguous shifts into one master shift

            var curr, prev, groups = [];

            while (curr = PMShifts.shift()) {

                if (prev && moment(prev.endsAt).isSame(curr.startsAt)) { // Get the first element in the array

                    prev.endsAt = curr.endsAt;
                    prev.shifts.push(curr);

                } else {
                    prev = {
                        location: curr.location,
                        groupedShift: true,
                        company: 'postmates',
                        startsAt: curr.startsAt,
                        endsAt: curr.endsAt,
                        shifts: [curr]
                    };
                    groups.push(prev);
                }
            }
            Array.prototype.push.apply(shifts, groups);
            day.shifts = sortAndFormatShifts(shifts); // sort again after adding postmates at the end
        });
        return days;
    }
    // Shifts are sorted by startsAt
    function groupByDay(shifts) {

        if (!shifts || !shifts.length) {
            return [];
        }

        var days = [];
        var day;

        for (var i = 0, j = 0; i < shifts.length; i++) {
            var s = shifts[i];

            if (!s || !s.startsAt || moment(s.startsAt).isBefore()) continue;

            while (!day || !moment(day.date).isSame(s.startsAt, 'day')) {
                day = {
                    date: moment().add(j, 'days').toDate(),
                    shifts: []
                };
                days.push(day);
                j++;
            }
            day.shifts.push(s);
        }
        return days;
    }

    // Update currentUser with new available shifts
    function updateWith(shifts) {
        $rootScope.currentUser.availableShiftsArr = sortAndFormatShifts(shifts);
        var grouped = groupByDay($rootScope.currentUser.availableShiftsArr);
        $rootScope.currentUser.availableShifts = groupPostmatesShifts(grouped);
    }

    function removeShift(shift) {
        var removed = _.remove($rootScope.currentUser.availableShiftsArr, function (s) {
            return s === shift;
        });
        updateWith($rootScope.currentUser.availableShiftsArr);
    }
    return {

        appendNewShifts: appendNewShifts,

        updateWith: updateWith,

    	getAvailable: getConnectedShifts,

    	getAllAvailable: function(success, failure) {
            if (!Parse.User.current()) return success && success();

	        Parse.Cloud.run('getAllConnectedShifts', {},
	        {
	            success: function(shifts) {
	                console.log('Successfully got all available shifts');

                    updateWith(shifts);
	                if (success) success();
                    $rootScope.$apply();
	            },
	            error: function(error) {
	                console.log('Could not get all available shifts');
	                console.log(error);
	                if (failure) failure();
	            }
	        });
		},
        getAllScheduled: function(success, failure) {
            if (!Parse.User.current()) return success && success();

            Parse.Cloud.run('getAllScheduledShifts', {},
            {
                success: function(shifts) {
                    console.log('Successfully got all scheduled shifts');

                    getShifts().then(function(shifts) {
                        $rootScope.currentUser.shifts = shifts;
                        if (success) success();
                        $rootScope.$apply();
                    }, function(error) {
                        console.log('Could not get all scheduled shifts');
                        console.log(error);
                        if (success) success();
                        $rootScope.$apply();
                    });
                },
                error: function(error) {
                    console.log('Could not get all scheduled shifts');
                    console.log(error);
                    if (failure) failure();
                }
            });
        },
		claim: function (shift, success, failure) {
	        console.log("claiming");
	        if (!Parse.User.current()) return success && success();

            if (hasConflict(shift)) {
                console.log('conflict');
                return failure && failure({message: 'conflict'});
            }

	        var el = getCompanyEligibility(shift.company);

            // For claiming your own dropped shift in WIW. Logic should be moved server side
            var ownShift = false;
            if (parseInt(shift.workerId) === parseInt(el.workerId))
                ownShift = true;

	        return Parse.Cloud.run('claimShift',
	        {
                // DD
                starting_point: shift.starting_point,
                vehicle_id: el.vehicle_id,
                workerId: el.workerId,

                // DD && PM
                startsAt: moment(shift.startsAt).format('YYYY-MM-DDTHH:mm:00Z'),
                endsAt: moment(shift.endsAt).format('YYYY-MM-DDTHH:mm:00Z'),

                // WIW
                swapId : shift.swapId, // only for wiw swaps
                ownShift: ownShift,

                // Common
                shiftId : shift.shiftId,
                companyId : el.object.get('company').id,
                company : el.company,
                token : el.token,
                location : shift.location,
	        },
	        {
	            success: function(s) {
	                console.log('success');
	                // update shifts after claiming one
                    // removeShift(shift);

                    getShifts().then(function(shifts) {
                        $rootScope.currentUser.shifts = shifts;
                        $rootScope.$apply();
                    }); // Don't worry about failure

                    if (success) success();
                    $rootScope.$apply();
	            },
	            error: function(error) {
	                console.log('Could not claim shift');
	                console.log(error);
	                // update shifts. Error might have been caused because of out of date shifts
                    // removeShift(shift);

                    if (failure) failure(error);
                    $rootScope.$apply();

	            }
	        });
	    }
    };
}

function eligibilities($rootScope, connectedShifts, $interval) {

    var get = function(name) {
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
        var el = new Parse.Object("Eligibility");
        el.set("worker", Parse.User.current());
        el.set("company", getCompany(name));
        el.set("interested", true);

        // Wrapper obj
        var wrapper = {
            id: undefined,
            company: name,
            eligible: undefined,
            interested: true,
            object: el
        };

        $rootScope.currentUser.eligibility.push(wrapper);
        return wrapper;
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
                    el.object.set('vehicle_id', result.vehicle_id);
                    el.vehicle_id = result.vehicle_id;
                    el.object.set('workerId', result.workerId);
                    el.workerId = result.workerId;
                    el.id = result.id; // In case it's a new eligibility that has not had it's ID set
                    connectedShifts.getAvailable(el);
                    if (success) success();
                },
                error: function(error) {
                    console.log('Could not connect account');
                    console.log(error);
                    if (failure) failure();
                }
            });
    };

    var createRefresherTimer = function (el, minutesInterval, expiration) {

        if (el.refresher) {
            $interval.cancel(el.refresher);
        }

        el.refresher = $interval(function() {
            refreshToken(el, minutesInterval);
            el.refresher = null;
        }, moment(expiration).diff(moment()) + 10, 1);
    };
    var refreshToken = function(el, minutesInterval) {

        if (!Parse.User.current()) return;

        var expiration = moment(el.tokenRefreshedAt).add(minutesInterval, 'minutes');

        // Not expired
        if (el.tokenRefreshedAt && expiration.isAfter(moment())) {
            createRefresherTimer(el, minutesInterval, expiration);
            return;
        }

        // Expired
        return Parse.Cloud.run('refreshToken',
            {
                eligibilityId : el.id
            },
            {
                success: function(result) {
                    console.log(result);
                    el.object.set('token', result.token);
                    el.token = result.token;
                    el.object.set('tokenRefreshedAt', result.tokenRefreshedAt);
                    el.tokenRefreshedAt = result.tokenRefreshedAt;

                    expiration = moment(el.tokenRefreshedAt).add(minutesInterval, 'minutes');
                    createRefresherTimer(el, minutesInterval, expiration);
                },
                error: function(error) {
                    console.log('Could not refresh token');
                    console.log(error);
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
            var el = get(name) || createEligibility(name);

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
            var el = get(name) || createEligibility(name);

            // If unselecting parse object not in DB, just delete it
            // Makes my life simpler with wg-save-bar
            if (toggle === false && el.id === undefined)
                removeEligibility(name);

            else
                el.interested = toggle;
        },

        // Refresh tokens that expire. Currently it's only doordash.
        // Needs to be called only once.
        // Will refresh and/or set a timer to automatically refresh when tokens will expire
        refreshAllTokens: function () {
            for (var i = 0; i < $rootScope.currentUser.eligibility.length; i++) {

                var el = $rootScope.currentUser.eligibility[i];

                if (el.company === 'doordash') {
                    refreshToken(el, 180);
                } else if (el.company === 'postmates') {
                    refreshToken(el, 1200);
                }
            }
        },
        get: get
    };
}