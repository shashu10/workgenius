/// <reference path="./goal/goal.ts" />
/// <reference path="./locations/locations.ts" />
/// <reference path="./vehicles/vehicles.ts" />
/// <reference path="./vehicles/vehicles-list.ts" />
/// <reference path="./info/info.ts" />

angular.module('wg.preferences', [])

.controller('LocationsPreferenceCtrl', LocationsPreferenceCtrl)

.controller('VehiclesPreferenceCtrl', VehiclesPreferenceCtrl)

.controller('PersonalInfoPageCtrl', PersonalInfoPageCtrl)

.controller('GoalPreferencesCtrl', GoalPreferencesCtrl)

.controller('VehicleListCtrl', VehicleListCtrl)

.controller('DocumentsPreferenceCtrl',DocumentsPreferenceCtrl)