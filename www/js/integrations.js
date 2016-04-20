angular.module('integrations', [])
    .factory('eligibilities', ['$rootScope', 'connectedShifts', eligibilities])

    .factory('connectedShifts', ['$rootScope', connectedShifts]);

function connectedShifts($rootScope) {
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
    function getEligibility(companyName) {
        var el = $rootScope.currentUser.eligibility;
        for (var i = 0; i < el.length; i++) {
            if (companyName === el[i].company) {
                return el[i];
            }
        }
        return undefined;
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
        $rootScope.currentUser.availableShifts = groupByDay($rootScope.currentUser.availableShiftsArr);
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
	                console.log('Successfully got all connected shifts');

                    updateWith(shifts);
	                if (success) success();
                    $rootScope.$apply();
	            },
	            error: function(error) {
	                console.log('Could not get all connected shifts');
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
                    console.log('Successfully got all connected shifts');

                    updateWith(shifts);
                    if (success) success();
                    $rootScope.$apply();
                },
                error: function(error) {
                    console.log('Could not get all connected shifts');
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

	        var el = getEligibility(shift.company);

            // For claiming your own dropped shift in WIW. Logic should be moved server side
            var ownShift = false;
            if (parseInt(shift.workerId) === parseInt(el.workerId))
                ownShift = true;

	        return Parse.Cloud.run('claimShift',
	        {
	            shiftId : shift.shiftId,
	            swapId : shift.swapId, // only for wiw swaps
	            companyId : el.object.get('company').id,
	            company : el.company,
	            token : el.token,
                ownShift: ownShift
	        },
	        {
	            success: function(shift) {
	                console.log('success');
	                // update shifts after claiming one
	                if (success) success();
	                $rootScope.$apply();

	                getConnectedShifts(el);
	            },
	            error: function(error) {
	                console.log('Could not claim shift');
	                console.log(error);
	                // update shifts. Error might have been caused because of out of date shifts
	                if (failure) failure(error);
	                $rootScope.$apply();

	                getConnectedShifts(el);
	            }
	        });
	    }
    };
}

function eligibilities($rootScope, connectedShifts) {

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
        var el = {
            id: undefined,
            company: name,
            eligible: undefined,
            interested: true,
            object: el
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
        get: get
    };
}