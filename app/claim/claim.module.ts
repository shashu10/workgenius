/// <reference path="./claim.ts" />
/// <reference path="./claim-detail.ts" />
/// <reference path="./flex-time-picker.ts" />

angular.module('wg.claim', [])

.controller('ClaimDaysCtrl', ClaimDaysCtrl)

.controller('ClaimDetailCtrl', ClaimDetailCtrl)

.controller('ClaimGroupDetailCtrl', ClaimGroupDetailCtrl)

.service('shiftToClaim', ShiftToClaim)

.directive('flexTimePicker', FlexTimePicker.instance)