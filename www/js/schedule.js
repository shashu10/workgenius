angular.module('workgenius.schedule', ['workgenius.earnings'])

// ============ //
//   SCHEDULE   //
// ============ //

.controller('ScheduleCtrl', ['$scope', '$rootScope', '$ionicScrollDelegate', '$location', '$ionicPopup', '$http', '$timeout', 'setShifts', 'getShifts', 'earningsEstimate',
    function($scope, $rootScope, $ionicScrollDelegate, $location, $ionicPopup, $http, $timeout, setShifts, getShifts, earningsEstimate) {

        $scope.earningsEstimate = earningsEstimate;

        $scope.$on('$stateChangeSuccess', function(event, current) {
            if (current.name.indexOf('app.schedule') > -1) {
                getShifts().then(function(shifts) {
                    $rootScope.currentUser.shifts = shifts;
                    
                    // If user is not logged in, we use fakeshifts and don't need to update scope
                    if (Parse.User.current()) {
                        $rootScope.$apply();
                    }
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
            // Does not work immediately
            $timeout(function () {
                $ionicScrollDelegate.anchorScroll(true);
            }, 10);
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
        $scope.cancelShift = function (shift) {
            $scope.shiftToCancel = shift;
            // Disabled strikes
            // if ($scope.isWithin72Hr(shift.startsAt) && $rootScope.currentUser.strikes >= 3) {
            //     cannotCancelWarning(shift);

            // // If user really want's to cancel, do it
            // } else {
                cancelWarning(shift);
            // }
        };

        function cancelWarning(shift) {

            // Late cancellation template
            // This cancellation is within 72 hours and will result in a <strong>strike</strong></p><p>Late cancellations this quarter: <strong>{{currentUser.strikes}}/3</strong>

            $scope.cancelPopup = $ionicPopup.show({
                template: '<img ng-src="img/companies/{{shiftToCancel.company.toLowerCase() | spaceless}}.png" alt=""><p>{{dividerFunction(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p>  <p>earnings estimate:  <strong class="light-green">{{earningsEstimate.shift(shiftToCancel) | currency:undefined:0}}</strong> </p> <div ng-show="isWithin72Hr(shiftToCancel.startsAt)"><p><strong>Warning:</strong></p><p>This shift is coming up soon. Please check <span ng-if="shiftToCancel.company">{{shiftToCancel.company + "\'s" | capitalize}}</span><span ng-if="!shiftToCancel.company">the company</span> cancellation policy. Late cancellations may result in a penalty</p></div>',
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

            .then(function(cancel) {
                if (cancel) setShifts.cancel(shift);
            });
        }
        // function cannotCancelWarning(shift) {
        //     $scope.cannotCancelPopup = $ionicPopup.show({
        //         template: '<p>Please contact us immediately to cancel this shift if you can\'t make it.</p><img ng-src="img/companies/{{shiftToCancel.company.toLowerCase() | spaceless}}.png" alt=""><p>{{dividerFunction(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p>  <p>earnings estimate: <strong class="light-green">{{earningsEstimate.shift(shiftToCancel) | currency:undefined:0}}</strong> </p>',
        //         title: 'Maximum number of cancellations reached!',
        //         scope: $scope,
        //         buttons: [{
        //             text: 'Don\'t Cancel',
        //             type: 'button-dark',
        //             onTap: function(e) {
        //                 return false;
        //             }
        //         }, {
        //             text: 'Contact Us',
        //             type: 'button-positive',
        //             onTap: function(e) {
        //                 // Returning a value will cause the promise to resolve with the given value.
        //                 // return shift;
        //                 return true;
        //             }
        //         }]
        //     }).then(function(show) {
        //         // From parent scope
        //         $scope.modalData.subject = 'cancellation';
        //         if (show) $scope.contactModal.show();
        //     });
        // }

        $scope.dividerFunction = function(date) {
            return moment(date).format('dddd, MMM Do');
        };

        $scope.formatAMPM = function(date) {
            return moment(date).format('h:mm a');
        };
        $scope.isWithin72Hr = function(date) {
            return moment(date).isBefore(moment().add(72, 'hour'));
        };
    }
]);
