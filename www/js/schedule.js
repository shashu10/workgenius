angular.module('workgenius.schedule', [])

// ============ //
//   SCHEDULE   //
// ============ //

.controller('ScheduleCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$location', '$ionicPopup', '$http', 'setShifts', 'getShifts',
    function($scope, $rootScope, $ionicScrollDelegate, $location, $ionicPopup, $http, setShifts, getShifts) {

        $scope.$on('$stateChangeSuccess', function(event, current) {
            if (current.name.indexOf('app.schedule') > -1) {
                getShifts().then(function(shifts) {
                    $rootScope.currentUser.shifts = shifts;
                  });
            }
        });

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

            for (var i = 0; i < $scope.currentUser.shifts.length; i++) {

                if (eventDate.isSameOrBefore($scope.currentUser.shifts[i].date)) {
                    $scope.gotoAnchor("id" + moment($scope.currentUser.shifts[i].date).format('YYYY-MM-DD'));

                    return;
                }
            }
            // $scope.gotoAnchor('empty-shift-list');
            $ionicScrollDelegate.scrollBottom();
        };

        $scope.cancelWarning = function(shift) {
            $scope.shiftToCancel = shift;
            $scope.cancelPopup = $ionicPopup.show({
                template: '<img ng-src="img/companies/{{shiftToCancel.company.toLowerCase() | spaceless}}.png" alt=""><p>{{dividerFunction(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p><div ng-show="isWithin72Hr(shiftToCancel.startsAt)"><p><strong>Warning:</strong></p><p>This cancellation is within 72 hours and will result in a <strong>strike</strong></p><p>Late cancellations this quarter: <strong>{{currentUser.strikes}}/3</strong></p></div>',
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
                    if ($rootScope.currentUser.strikes >= 3) {
                        $scope.cannotCancelWarning();
                    } else {
                        $scope.cancelShift(shift);
                    }
                }
            });
        };
        $scope.cannotCancelWarning = function() {

            $scope.cannotCancelPopup = $ionicPopup.show({
                template: '<p>Please contact us immediately to cancel this shift if you can\'t make it.</p>',
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
                    type: 'button-dark',
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

        $scope.cancelShift = function(shift) {

            setShifts.cancel(shift).then(function(result) {
                console.log('cancel then');
                // Set cancellations if required
            });
        };

        function getCompanyEarnings (name) {
            for (var i = 0; i < $rootScope.companyList.length; i++) {
                if (name.toLowerCase() === $rootScope.companyList[i].name.toLowerCase())
                    return $rootScope.companyList[i].earningsEst;
            }
            return 15;
        }
        $scope.shiftEarnings = function(shift) {
            return (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * getCompanyEarnings(shift.company);
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
            return moment(date).format('dddd, MMM Do');
        };

        $scope.formatAMPM = function(date) {
            return moment(date).format('ha');
        };
        $scope.isWithin72Hr = function(date) {
            return moment(date).isBefore(moment().add(72, 'hour'));
        };
    }
]);
