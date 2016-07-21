/// <reference path="../../ts/wg.data.vehicles.ts" />

class VehiclesPreferenceCtrl {

    private vehicles: WGVehicle[]
    private none: WGVehicle

    constructor(public currentUser:CurrentUserService, public debounce: WGDebounce, public alertDialog: AlertDialogService) {

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
        this.save()
    }

    save() {
    //     const toSave = _.chain(angular.copy(this.vehicles))
    //     .filter((v) => v.selected)    // Get only selected vehicles
    //     .map((v) => ({type: v.type})) // Save only type
    //     .value()

    }
}

VehiclesPreferenceCtrl.$inject = ["currentUser", "debounce","alertDialog"]