/// <reference path="./goal/goal.ts" />
/// <reference path="./locations/locations.ts" />
/// <reference path="./vehicles/vehicles.ts" />
/// <reference path="./vehicles/vehicles-list.ts" />

class PreferencesCtrl {

    constructor(public currentUser: CurrentUserService,
                public wgState: WGState) {}

    logout() {
        this.currentUser.logOut()
        this.wgState.goWithoutAnimate('welcome')
        this.wgState.clearCache()
    }
}

PreferencesCtrl.$inject = ['currentUser', 'wgState']

angular.module('wg.preferences', [])

.controller('PreferencesCtrl', PreferencesCtrl)

.controller('LocationsPreferenceCtrl',LocationsPreferenceCtrl)

.controller('GoalPreferencesCtrl', GoalPreferencesCtrl)

.controller('VehiclesPreferenceCtrl',VehiclesPreferenceCtrl)

.controller('VehicleListCtrl',VehicleListCtrl)