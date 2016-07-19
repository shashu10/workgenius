/// <reference path="../../ts/wg.data.vehicles.ts" />
const VehicleObj = Parse.Object.extend("Vehicle");

class VehiclesCtrl {

    private vehicles: WGVehicle[]
    private none: WGVehicle

    constructor(public WizardStates: WizardStatesService) {

        this.vehicles = [
            {selected: false, type: 'Car',        icon: 'wg-icon-car'},
            {selected: false, type: 'Truck/Van',  icon: 'wg-icon-truck'},
            {selected: false, type: 'Motorcycle', icon: 'wg-icon-motorcycle'},
            {selected: false, type: 'Scooter',    icon: 'wg-icon-scooter'},
            {selected: false, type: 'Bicycle',    icon: 'wg-icon-bicycle'},
            {selected: false, type: 'None',       icon: 'wg-icon-none'}
        ]
        this.none = this.vehicles[this.vehicles.length - 1]
    }

    toggleSelect(vehicle: WGVehicle) {

        // If selecting none
        if (vehicle === this.none && !vehicle.selected) {

            // Unselect all others
            _.forEach(this.vehicles, v => { v.selected = false })

            vehicle.selected = true;

        // If selecting some other vehicle
        } else {

            vehicle.selected = !vehicle.selected

            // Unselect none
            this.none.selected = false
        }
    }

    next() {
        const toSave = _.chain(angular.copy(this.vehicles))
        .filter((v) => v.selected)    // Get only selected vehicles
        .map((v) => ({type: v.type})) // Save only type
        .value()

        this.WizardStates.next({vehicles: toSave})
    }
}

VehiclesCtrl.$inject = ["WizardStates"]