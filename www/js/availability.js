angular.module('workgenius.availability', [])

// ============ //
// AVAILABILITY //
// ============ //

    .controller('AvailabilityCtrl', ['$rootScope', '$scope', '$ionicPopup',
        function($rootScope, $scope, $ionicPopup) {

            $scope.intervals = ['6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a', '1a'];

            $scope.$on('$stateChangeSuccess', function(event, current) {
                $rootScope.canEditAvailability = checkAvailabilityLock();
                if (current.name.indexOf('onboarding.availability') > -1) {
                    $rootScope.canEditAvailability = true;
                }
            });
            var YES_NO = 2;
            var YES_MAYBE_NO = 3;

            function getTotalAvailability() {
                if (!$rootScope.currentUser.availability) return 0;
                var total = 0;
                for (var i in $rootScope.days) {
                    var week = $rootScope.days[i];
                    if ($rootScope.currentUser.availability[week]) total += $rootScope.currentUser.availability[week].length;
                }
                return total;
            }

            // New array format
            var toggleUniqueArray = function(day, hour) {
                hour = Number(moment(hour, "ha").format('H'));
                if (!$rootScope.currentUser.availability[day]) {
                    $rootScope.currentUser.availability[day] = [hour];
                    return;
                }
                var index = $rootScope.currentUser.availability[day].indexOf(hour);
                if (index > -1) {
                    // remove if it already exists
                    $rootScope.currentUser.availability[day].splice(index, 1);
                    if ($rootScope.currentUser.availability[day].length === 0) {
                        delete $rootScope.currentUser.availability[day];
                    }

                } else {
                    $rootScope.currentUser.availability[day].push(hour);
                }
                if ($rootScope.currentUser.availability[day])
                    $rootScope.currentUser.availability[day].sort(function(a, b) {
                        return a - b;
                    });
            };

            $scope.select = function(day, interval, hour) {
                if (!$rootScope.canEditAvailability) {
                    $ionicPopup.show({
                        template: '<p>We\'re working on getting you shifts for next week based on your current availability.</p><p>You can change your availability again on Monday</p>',
                        title: 'Wait till Monday to edit!',
                        scope: $scope,
                        buttons: [{
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: function(e) {
                                // Returning a value will cause the promise to resolve with the given value.
                                // return shift;
                                return true;
                            }
                        }]
                    });
                    return;
                }
                var before = getTotalAvailability();
                toggleUniqueArray(day, hour);
                var after = getTotalAvailability();

                // Set Updated At value here. User will be saved onChange with wg-save-bar directive
                if (Parse.User.current()) $rootScope.currentUser.set("availabilityUpdatedAt", new Date());
                mixpanel.track("Availability Changed", {
                    "change": before - after,
                });

                if ($scope.onChange) $scope.onChange();
            };

            $scope.isSelected = function(day, hour) {
                if (!$rootScope.currentUser.availability[day]) {
                    return false;
                }
                formattedHour = Number(moment(hour, "ha").format('H'));
                var retval = $rootScope.currentUser.availability[day].indexOf(formattedHour) > -1;
                return retval;
            };

            $scope.startEditDay = $rootScope.availabilityLock.start;
            $scope.endEditDay = moment($rootScope.availabilityLock.end, 'dddd').add(1, 'day').format('dddd');
            $scope.nextStartDate = getTimeTillEdit();

            function checkAvailabilityLock() {
                if ($rootScope.availabilityLock.disableLock) return true;
                var today = moment().isoWeekday();
                var start = moment().day($rootScope.availabilityLock.start).isoWeekday();
                var end   = moment().day($rootScope.availabilityLock.end).isoWeekday();
                return !(start <= today && today <= end);
            }

            function getTimeTillEdit() {
                // Gets the next day you can start editing
                var day = moment($rootScope.availabilityLock.end, "dddd").add(1, 'day').day();
                // moment().day(1) gives this monday moment().day(8) gives next monday
                var deadline = moment().day(day + 7).startOf('day');
                return fromNow(deadline);
            }
            function fromNow(deadline) {
                var fromNow = "";
                var hours = (deadline).diff(moment(), 'hour');
                var d = Math.floor(hours / 24);
                var h = hours % 24;
                if (d || h) fromNow = "in ";
                if (d) fromNow += d + "d ";
                if (h) fromNow += h + "h ";
                return fromNow;
            }
        }
    ])
    .controller('BlockDaysCtrl', ['$rootScope', '$scope', '$ionicPopup', 'wgShifts', 'wgEarnings',
        function($rootScope, $scope, $ionicPopup, wgShifts, wgEarnings) {

            $scope.wgEarnings = wgEarnings;
            
            $scope.strikes = function(shifts) {
                var strikes = 0;
                for (var i = 0; i < shifts.length; i++) {
                    var shift = shifts[i];
                    var deadline = moment().add(72, 'hours');
                    if (deadline.isAfter(shift.startsAt)) {
                        strikes++;
                    }
                }
                return strikes;
            };

            $scope.shiftDateFormatter = function(date) {
                return moment(date).format('ddd, MMM Do');
            };
            $scope.formatAMPM = function(date) {
                return moment(date).format('h:mm a');
            };

            // function cannotCancelWarning(date) {
            //     $scope.selectedEvents = date.event;
            //     var thisThese = $scope.selectedEvents.length > 1 ? 'these shifts' : 'this shift';

            //     $scope.cannotCancelPopup = $ionicPopup.show({
            //         cssClass: 'shift-popup',
            //         template: '<p>You will go above your maximum cancellation limit if you block this day. Please contact us immediately if you can\'t make ' + thisThese + '.</p> <ion-item ng-repeat="shiftToCancel in selectedEvents"><img ng-src="img/companies/{{shiftToCancel.company.toLowerCase()  | spaceless}}.png" alt=""><p><strong>{{shiftToCancel.company.toLowerCase() | capitalize}}</strong> | Earnings Est: ${{wgEarnings.shift(shiftToCancel)}}</p><p>{{shiftDateFormatter(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p></ion-item><div ng-if="strikes(selectedEvents)"><p> Late cancellations this quarter: <strong>{{currentUser.strikes}}/3</strong></p></div>',
            //         title: 'Cannot block this day!',
            //         scope: $scope,
            //         buttons: [{
            //             text: 'Don\'t Block',
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
            function blockWithEvents(date) {
                $scope.selectedEvents = date.event;

                var thisThese = $scope.selectedEvents.length > 1 ? 'these shifts' : 'this shift';

                // Late cancellation message:
                // You\'ll get {{strikes(selectedEvents)}} strike{{strikes(selectedEvents) > 1 ? "s" : ""}}</p> <p> Late cancellations this quarter: <strong>{{currentUser.strikes}}/3</strong>
                return $ionicPopup.show({
                    cssClass: 'shift-popup',
                    template: '<ion-list><ion-item ng-repeat="shiftToCancel in selectedEvents"><img ng-src="img/companies/{{shiftToCancel.company.toLowerCase() | spaceless}}.png" alt=""><p><strong>{{shiftToCancel.company.toLowerCase() | capitalize}}</strong> | Earnings Est: ${{wgEarnings.shift(shiftToCancel)}}</p><p>{{shiftDateFormatter(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p></ion-item><div ng-if="strikes(selectedEvents)"><p>WARNING: This shift is coming up soon. Please check the company cancellation policy. Late cancellations may result in a penalty.</p></div></ion-list>',
                    title: 'Blocking this day will<br>cancel ' + thisThese,
                    scope: $scope,
                    buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                        text: 'No, Leave it',
                        type: 'button-dark',
                        onTap: function(e) {
                            return false;
                        }
                    }, {
                        text: 'Yes, Block',
                        type: 'button-assertive',
                        onTap: function(e) {
                            return true;
                        }
                    }]
                });
            }

            function isAfterToday(date) {
                var current = new Date(date).setHours(0, 0, 0, 0);
                var today = new Date().setHours(0, 0, 0, 0);

                if (current > today) {
                    return true;
                }
                return false;
            }

            $scope.showMonth = true;

            setCurrentMoment(moment());

            $scope.blockedCount = getBlockedInNext30Days();

            $scope.options = {

                showHeader: true,
                minDate: moment().format('YYYY-MM-DD'),
                maxDate: moment().add(3, 'months').format('YYYY-MM-DD'),
                disabledDates: [],
                blockedDays: $scope.currentUser.blockedDays,
                disableClickedDates: true,

                eventClick: function(event, domEvent, getBlockedDays) {
                    setCurrentMoment(moment(event.date));

                    // Already blocked? This case will happen very rarely
                    if (event.blocked) {
                        toggleBlock(event, false, getBlockedDays);

                        // Event exists
                    } else if (!event.date.disabled && isAfterToday(event.date)) {

                        // Disable strikes
                        // var cancellations = shiftCountWithin72Hours(event.event);

                        // // Cannot cancel shifts on that day
                        // if ((cancellations + $rootScope.currentUser.strikes) > 3) {
                        //     cannotCancelWarning(event);

                        // } else {

                            // Can cancel shifts on that day
                            blockWithEvents(event)
                                .then(function(block) {

                                    if (block) {

                                        cancelShifts(event.event);

                                        toggleBlock(event, true, getBlockedDays);
                                    }
                                });
                        // }
                    }
                },
                dateClick: function(event, domEvent, getBlockedDays) {
                    setCurrentMoment(moment(event.date));
                    toggleBlock(event, !event.blocked, getBlockedDays);
                },
                changeMonth: function(month, year, blockedDays) {
                    $scope.selectedYear = year;
                    $scope.selectedMonth = month.name;
                    $rootScope.currentUser.blockedDays = blockedDays;
                    $scope.blockedCount = getBlockedInNext30Days();
                },
            };

            // function shiftCountWithin72Hours (shifts) {
            //     var count = 0;
            //     for (var i = 0; i < shifts.length; i++) {
            //         var shift = shifts[i];
            //         if (moment(shift.startsAt).isBefore(moment().add(72, 'hours'))) {
            //             count++;
            //         }
            //     }
            //     return count;
            // }

            function cancelShifts(shifts) {
                wgShifts.cancelAll(shifts);
            }

            function toggleBlock(event, val, getBlockedDays) {
                if (isAfterToday(event.date)) {
                    event.blocked = val;

                    var before = $rootScope.currentUser.blockedDays.length;
                    $rootScope.currentUser.blockedDays = getBlockedDays();
                    var after = $rootScope.currentUser.blockedDays.length;
                    $scope.blockedCount = getBlockedInNext30Days();

                    // Set Updated At value here. User will be saved onChange with wg-save-bar directive
                    if (Parse.User.current()) $rootScope.currentUser.set("blockedDaysUpdatedAt", new Date());

                    mixpanel.track("Blocked Days Changed");

                    $scope.onChange();
                }
            }

            function setCurrentMoment(moment) {
                $scope.selectedYear = moment.format('YYYY');
                $scope.selectedMonth = moment.format('MMMM');
            }

            function getBlockedInNext30Days() {
                var thirtyDays = moment().add(30, 'days');

                for (var i = 0; i < $rootScope.currentUser.blockedDays.length; i++) {

                    var day = $rootScope.currentUser.blockedDays[i];
                    var mom = moment(day.day + "-" + day.month + "-" + day.year, 'D-M-YYYY');

                    if (mom.isAfter(thirtyDays)) {
                        // index is number of elements before first mom
                        return i;
                    }
                }
                return $rootScope.currentUser.blockedDays.length;
            }
        }
    ]);
