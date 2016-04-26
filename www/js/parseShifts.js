angular.module('parseShifts', ['workgenius.earnings', 'parseUtils', 'workgenius.directives'])

    .factory('setShifts', ['$rootScope', '$q', 'getCompanyEligibility', setShifts])
    .factory('getShifts', ['$q', '$rootScope', 'acknowledgeShifts', 'debounce', getShifts])
    .factory('acknowledgeShifts', ['$q', '$rootScope', '$ionicPopup', 'earningsEstimate', acknowledgeShifts]);

var Shift = Parse.Object.extend("Shift");

function setShifts($rootScope, $q, getCompanyEligibility) {
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
            var el = getCompanyEligibility(shift.company) || {};

            console.log(shift);
            console.log(shift.object.get('shiftId'));
            Parse.Cloud.run('cancelShift', {
                startsAt: shift.startsAt.toString(),
                endsAt: shift.endsAt.toString(),
                shiftID: shift.id, // parse id
                companyShiftId: shift.object.get('shiftId'), // company shift id
                company: shift.company,
                token : el.token,
                workerId : el.workerId,
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
                location: sh.get('location'),
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


function acknowledgeShifts($q, $rootScope, $ionicPopup, earningsEstimate) {

    var shiftDateFormatter = function(date) {
        return moment(date).format('ddd, MMM Do');
    };
    var formatAMPM = function(date) {
        return moment(date).format('h:mma');
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

        scope.earningsEstimate = earningsEstimate;
        scope.newShifts = shifts;

        scope.shiftDateFormatter = shiftDateFormatter;
        scope.formatAMPM = formatAMPM;

        $ionicPopup.show({
            cssClass: 'shift-popup',
            template: '<ion-list><ion-item ng-repeat="shift in newShifts"><img ng-src="img/companies/{{shift.company.toLowerCase() | spaceless}}.png" alt=""><p><strong>{{shift.company.toLowerCase() | capitalize}}</strong> | Earnings Est: ${{earningsEstimate.shift(shift)}}</p><p>{{shiftDateFormatter(shift.startsAt)}}, {{formatAMPM(shift.startsAt) | uppercase}} - {{formatAMPM(shift.endsAt) | uppercase}}</p></ion-item><p>You can cancel {{newShifts.length > 1 ? "these shifts" : "this shift"}} after tapping acknowledge</p></ion-list>',
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