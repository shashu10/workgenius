/// <reference path="./wizardStates.service.ts" />
/// <reference path="./goal/goal.ts" />
/// <reference path="./vehicles/vehicles.ts" />
/// <reference path="./locations/locations.ts" />
/// <reference path="./availability/availability-days.ts" />
/// <reference path="./availability/availability-times.ts" />

angular.module('wg.wizard', ['wg.user', 'parseData'])

    .service('WizardStates', WizardStatesService)

    .controller('AvailabilityDaysCtrl', AvailabilityDaysCtrl)

    .controller('AvailabilityTimesCtrl', AvailabilityTimesCtrl)

    .controller('GoalCtrl', GoalCtrl)

    .controller('VehiclesCtrl', VehiclesCtrl)

    .controller('LocationsCtrl', LocationsCtrl)