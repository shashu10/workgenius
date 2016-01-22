angular.module('workgenius.controllers', [])


// ============ //
//     MENU     //
// ============ //

.controller('MenuCtrl', ['$scope', '$rootScope', '$state', '$ionicHistory', '$ionicModal', '$interval', 'zenMessage', 'getUserData',
    function($scope, $rootScope, $state, $ionicHistory, $ionicModal, $interval, zenMessage, getUserData) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.logout = function() {
            Parse.User.logOut();

            getUserData();

            $scope.toggleWithoutAnimation('registration.login');
            $ionicHistory.clearCache();
        };

        $scope.toggleWithoutAnimation = function(state) {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableAnimate: true
            });
            $state.go(state, {
                clear: true
            });
        };
        // End

        // Contact Us Modal

        $scope.contactStatus = 'Send';

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/shared/contact-us.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.contactModal = modal;
        });

        $scope.cancelMessage = function() {
            $scope.contactModal.hide();
        };

        $scope.sendMessage = function() {
            $scope.modalData.buttonStatus = 'button-positive';
            $scope.modalData.contactStatus = 'Sending...';
            zenMessage.send($scope.modalData.message, $scope.modalData.subject).then(function(result) {
                console.log('success sending message');
                messageSentCallback('Sent!', 'button-balanced');
            }, function(result) {
                console.log('failure sending message');
                messageSentCallback('Couldn\'t Send', 'button-assertive');
            });
        };

        function messageSentCallback(text, button) {

            $scope.modalData.buttonStatus = button;
            $scope.modalData.contactStatus = text;
            $interval(function() {
                $scope.contactModal.hide().then(function() {
                    $scope.modalData.message = '';
                    $scope.modalData.contactStatus = 'Send';
                    $scope.modalData.buttonStatus = 'button-positive';
                });
            }, 1000, 1);
        }
        $scope.modalData = {
            contactStatus: 'Send',
            buttonStatus: 'button-positive',
            message: '',
            subject: 'other',
            options: ['general', 'cancellation', 'app']
        };
        $scope.setActive = function(type) {
            $scope.modalData.subject = type;
        };
        $scope.isActive = function(type) {
            return type === $scope.modalData.subject;
        };
        // End

    }
])

// ============ //
// AVAILABILITY //
// ============ //

.controller('AvailabilityTabsCtrl', ['$scope',
        function($scope) {

            $scope.$on('$stateChangeSuccess', function(event, current) {
                if (current.name.indexOf('block-days') > -1) {
                    $scope.availActive = false;
                } else {
                    $scope.availActive = true;
                }
            });
        }
    ])
    .controller('AvailabilityCtrl', ['$rootScope', '$scope',
        function($rootScope, $scope) {

            var YES_NO = 2;
            var YES_MAYBE_NO = 3;

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
                toggleUniqueArray(day, hour);
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
        }
    ])
    .controller('BlockDaysCtrl', ['$rootScope', '$scope', '$ionicPopup',
        function($rootScope, $scope, $ionicPopup) {

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

            $scope.dividerFunction = function(date) {
                return moment(date).format('MMM dddd Do');
            };
            $scope.formatAMPM = function(date) {
                return moment(date).format('ha');
            };
            $scope.shiftEarnings = function(shift) {
                return (shift.endsAt.getTime() - shift.startsAt.getTime()) / 3600000 * 15;
            };

            function blockWithEvents(date) {
                $scope.selectedEvents = date.event;

                var thisThese = $scope.selectedEvents.length > 1 ? 'these shifts' : 'this shift';
                return $ionicPopup.show({
                    cssClass: 'block-popup',
                    template: '<ion-list><ion-item ng-repeat="shiftToCancel in selectedEvents"><img ng-src="img/companies/{{shiftToCancel.company.toLowerCase()}}.png" alt=""><p>{{shiftToCancel.company}} | Earnings Est: ${{shiftEarnings(shiftToCancel)}}</p><p>{{dividerFunction(shiftToCancel.startsAt)}}, {{formatAMPM(shiftToCancel.startsAt) | uppercase}} - {{formatAMPM(shiftToCancel.endsAt) | uppercase}}</p></ion-item><p ng-if="strikes(selectedEvents)">WARNING: You\'ll get {{strikes(selectedEvents)}} strike{{strikes(selectedEvents) > 1 ? "s" : ""}}</p></ion-list>',
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
                    if (event.blocked) {
                        event.blocked = false;
                    } else if (!event.date.disabled && isAfterToday(event.date)) {
                        if (event.event.length) {
                            console.log(event);
                            blockWithEvents(event)
                                .then(function(block) {

                                    if (block) {
                                        event.blocked = !event.blocked;
                                    }
                                });
                            return;
                        }
                        event.blocked = !event.blocked;
                    }
                    $rootScope.currentUser.blockedDays = getBlockedDays();
                    $scope.blockedCount = getBlockedInNext30Days();
                    $scope.onChange();
                },
                dateClick: function(event, domEvent, getBlockedDays) {
                    setCurrentMoment(moment(event.date));
                    event.blocked = !event.blocked;
                    $rootScope.currentUser.blockedDays = getBlockedDays();
                    $scope.blockedCount = getBlockedInNext30Days();
                    $scope.onChange();
                },
                changeMonth: function(month, year, blockedDays) {
                    $scope.selectedYear = year;
                    $scope.selectedMonth = month.name;
                    $rootScope.currentUser.blockedDays = blockedDays;
                    $scope.blockedCount = getBlockedInNext30Days();
                },
            };

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
    ])

// ============ //
//   COMPANIES  //
// ============ //

.controller('CompaniesCtrl', ['$rootScope', '$scope', '$ionicModal', 'setUserData', 'setEligibility',
    function($rootScope, $scope, $ionicModal, setUserData, setEligibility) {

        $scope.customSave = setEligibility.save;
        $scope.selectedWorkType = null;

        $ionicModal.fromTemplateUrl('templates/shared/companies-modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.decline = function(company) {
            $scope.modal.hide();
        };
        $scope.accept = function(company) {

            setEligibility.toggleInterest(company.name, true);
            $scope.modal.hide();
            if ($scope.onChange) $scope.onChange();
        };
        $scope.select = function(company) {
            // Unselect type if it's already selected
            if ($scope.isInterested(company.name)) {
                setEligibility.toggleInterest(company.name, false);

                if ($scope.onChange) $scope.onChange();

                // Open detailed modal when unselected option is clicked
            } else {
                $scope.selectedCompany = company;
                $scope.modal.show();
            }
        };

        $scope.isEligible = function(name) {
            var eligibility = setEligibility.findEligibility(name);
            return eligibility && eligibility.eligible;
        };
        $scope.isInterested = function(name) {
            var eligibility = setEligibility.findEligibility(name);
            return eligibility && eligibility.interested;
        };
    }
])

// .controller('EarningsController', [ '$scope', function($scope) {
// }])
// .controller('VehiclesCtrl', ['$scope', function($scope) {
// }])
// .controller('TargetCtrl', ['$scope', function($scope) {
// // }])
// .controller('AvailableShiftsCtrl', ['$scope', '$ionicModal', function($scope, $ionicModal) {

//   $scope.shifts=[
//     {
//       name:"Coleen", company: "caviar", earnings: 62,
//       date: new Date("October 23, 2014"),
//       startsAt: new Date("October 23, 2014 18:30:00"),
//       endsAt: new Date("October 23, 2014 21:30:00")
//     },
//   ];
//   $scope.selectedShift = $scope.shifts[0];
//   // Create the login modal that we will use later
//   $ionicModal.fromTemplateUrl('templates/shared/accept-shift.html', {
//     scope: $scope
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });

//   $scope.accept = function (shift) {
//     $scope.selectedShift = shift;
//     $scope.modal.show();
//   };

//   $scope.acceptShift = function (shift) {
//     $scope.modal.hide();
//   };
//   $scope.declineShift = function (shift) {
//     $scope.modal.hide();
//   };

// }])

// - END -
