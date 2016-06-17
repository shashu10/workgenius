/// <reference path="../../ts/wg.data.vehicles.ts" />
var VehicleObj = Parse.Object.extend("Vehicle");

class VehiclesCtrl {

    private vehicles: WGVehicle[]

    constructor(public $state: any, public currentUser: CurrentUser, public wgVehicles: WGVehicles, public WizardStates: any) {

        this.vehicles = wgVehicles.list
    }

    toggleSelect(vehicle: WGVehicle) {

        // If selecting none
        if (vehicle.type === 'None' && !vehicle.selected) {

            // Unselect all others
            _.forEach(this.vehicles, v => { v.selected = false })

            vehicle.selected = true;

        // If selecting some other vehicle
        } else {

            vehicle.selected = !vehicle.selected

            // Unselect none
            var none = _.find(this.vehicles, v => v.type === 'None');
            none.selected = false
        }
    }

    next() {
        this.wgVehicles.saveAll()
        this.WizardStates.next()
    }
}

VehiclesCtrl.$inject = ["$state", "currentUser", "wgVehicles", "WizardStates"];