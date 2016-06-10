/// <reference path="./goal/goal.ts" />
/// <reference path="./availability/availability-days.ts" />
/// <reference path="./availability/availability-times.ts" />

angular.module('wg.wizard', ['wg.user', 'parseData'])

    .controller('AvailabilityDaysCtrl', AvailabilityDaysCtrl)

    .controller('AvailabilityTimesCtrl', AvailabilityTimesCtrl)

    .controller('GoalCtrl', GoalCtrl)