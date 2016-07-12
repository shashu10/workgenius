/// <reference path="./claim.ts" />
/// <reference path="./flex-time-picker.ts" />

angular.module('wg.claim', [])

.controller('ClaimDaysCtrl', ClaimDaysCtrl)

.service('shiftToClaim', ShiftToClaim)

.directive('flexTimePicker', FlexTimePicker.instance)