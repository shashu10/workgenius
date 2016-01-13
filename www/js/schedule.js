angular.module('workgenius.schedule', [])

// ============ //
//   SCHEDULE   //
// ============ //

.controller('ScheduleCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$location', '$ionicPopup', '$http', 'setShifts',
    function($scope, $rootScope, $ionicScrollDelegate, $location, $ionicPopup, $http, setShifts) {

        $scope.adjustCalendarHeight = function(argument) {

        };
        $scope.selectedMonth = moment().format('MMMM');
        $scope.selectedYear = moment().format('YYYY');

        $scope.Math = window.Math;
        $scope.options = {
            // Start calendar from current day

            minDate: moment('2015-12-01').format('YYYY-MM-DD'),
            maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),
            // disabledDates: [
            //     "2015-06-22"
            // ],

            // dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
            // mondayIsFirstDay: true,//set monday as first day of week. Default is false

            eventClick: function(event) {

                var m = moment(event.date);
                $scope.scrollTo(event);
                $scope.selectedMonth = m.format('MMMM');
            },
            dateClick: function(event) {

                var m = moment(event.date);
                $scope.scrollTo(event);
                $scope.selectedMonth = m.format('MMMM');
            },
            changeMonth: function(month, year) {

                $scope.selectedMonth = month.name;
                $scope.selectedYear = year;

                if (moment(event.date).format('M') === month.index) {
                    $scope.scrollTo({
                        date: new Date()
                    });
                } else {
                    $scope.scrollTo({
                        date: new Date(year + "/" + month.index + "/" + 1)
                    });
                }
            },
        };
        $scope.anchorID = function(group) {
            return "id" + moment(group[0].startsAt).format('YYYY-MM-DD');
        };
        $scope.gotoAnchor = function(anchorID) {
            $location.hash(anchorID);
            $ionicScrollDelegate.anchorScroll(true);
        };
        $scope.scrollTo = function(event) {
            var eventDate = moment(event.date);
            for (var i = 0; i < $scope.groupedShifts.length; i++) {
                if (!eventDate.isAfter($scope.groupedShifts[i][0].date)) {
                    $scope.gotoAnchor("id" + moment($scope.groupedShifts[i][0].date).format('YYYY-MM-DD'));
                    return;
                }
            }
            // $scope.gotoAnchor('empty-shift-list');
            $ionicScrollDelegate.scrollBottom(true);
        };

        $scope.cancelWarning = function(shift, group, shifts) {
            $scope.shiftToCancel = shift;
            $scope.cancelPopup = $ionicPopup.show({
                template: '<img ng-src="img/companies/{{shiftToCancel.company.toLowerCase()}}.png" alt=""><p>{{dividerFunction(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p><div ng-show="isWithin72Hr(shiftToCancel.startsAt)"><p><strong>Warning:</strong></p><p>This cancellation is within 72 hours and will result in a <strong>strike</strong></p><p>Late cancellations this quarter: <strong>{{currentUser.cancellations}}/3</strong></p></div>',
                title: 'Are you sure you want<br>to cancel this shift?',
                scope: $scope,
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: 'No, Leave it',
                    type: 'button-dark',
                    onTap: function(e) {
                        return false;
                    }
                }, {
                    text: 'Yes, Cancel',
                    type: 'button-assertive',
                    onTap: function(e) {
                        return true;
                    }
                }]
            })

            // Must call cannotCancelWarning in .then 
            .then(function(cancel) {

                if (cancel) {
                    if ($rootScope.currentUser.cancellations >= 3) {
                        $scope.cannotCancelWarning();
                    } else {
                        $scope.cancelShift(shift, group, shifts);
                    }
                }
            });
        };
        $scope.cannotCancelWarning = function() {

            $scope.cannotCancelPopup = $ionicPopup.show({
                template: '<p>Sorry you cannot cancel this shift automatically. Please contact us immediately to if you are unable to fulfil this shift.</p>',
                title: 'Maximum number of cancellations reached!',
                scope: $scope,
                buttons: [{
                    text: 'Contact Us',
                    type: 'button-positive',
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        // return shift;
                        return true;
                    }
                }, {
                    text: 'Don\'t Cancel',
                    type: 'button-default',
                    onTap: function(e) {
                        return false;
                    }
                }]
            }).then(function(show) {
                // From parent scope
                if (show)
                    $scope.contactModal.show();
            });
        };

        $scope.cancelShift = function(shift, group, shifts) {

            setShifts.remove(shift).then(function(result) {

                // Set cancellations if required
                // if (beforeCertainTime)
                $rootScope.currentUser.cancellations++;

                // remove it from the view
                var idx = group.indexOf($rootScope.currentUser.shifts);
                $rootScope.currentUser.shifts.splice(idx, 1);

                // Group it
                $scope.groupedShifts = groupBy($rootScope.currentUser.shifts, function(item) {
                    return [item.date];
                });

                if (result) { // was actually updated asynchronously
                    $scope.$apply();
                }

            });
        };
        $scope.groupedShifts = groupBy($rootScope.currentUser.shifts, function(item) {
            return [item.date];
        });

        $scope.shiftEarnings = function(shift) {
            return (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * $rootScope.hourlyRate;
        };
        $scope.groupEarnings = function(group) {
            var earnings = 0;
            for (var i = 0; i < group.length; i++) {
                var shift = group[i];
                earnings += $scope.shiftEarnings(shift);
            }
            return earnings;
        };
        $scope.dividerFunction = function(date) {
            return moment(date).format('MMM dddd Do');
        };

        $scope.formatAMPM = function(date) {
            return moment(date).format('ha');
        };
        $scope.isWithin72Hr = function(date) {
            return moment(date).isBefore(moment().add(72, 'hour'));
        };


        function groupBy(array, f) {
            var groups = {};
            array.forEach(function(o) {
                var group = JSON.stringify(f(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map(function(group) {
                return groups[group];
            });
        }
    }
]);
