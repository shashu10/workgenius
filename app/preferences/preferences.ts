/// <reference path="./goal/goal.ts" />
/// <reference path="./locations/locations.ts" />
/// <reference path="./vehicles/vehicles.ts" />
/// <reference path="./vehicles/vehicles-list.ts" />
/// <reference path="./info/info.ts" />

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

.controller('LocationsPreferenceCtrl', LocationsPreferenceCtrl)

.controller('VehiclesPreferenceCtrl', VehiclesPreferenceCtrl)

.controller('PersonalInfoPageCtrl', PersonalInfoPageCtrl)

.controller('GoalPreferencesCtrl', GoalPreferencesCtrl)

.controller('VehicleListCtrl', VehicleListCtrl)

.controller('PreferencesCtrl', PreferencesCtrl)
