/// <reference path="../../ts/wg.data.vehicles.ts" />

class VehiclesPreferenceCtrl {

    private vehicles: WGVehicle[]

    constructor(public currentUser: CurrentUserService, public alertDialog: AlertDialogService, public newVehicleService: NewVehicleService) {

        this.vehicles = [
            {selected: false, type: 'Car',        icon: 'wg-icon-car'},
            {selected: false, type: 'Truck/Van',  icon: 'wg-icon-truck'},
            {selected: false, type: 'Motorcycle', icon: 'wg-icon-motorcycle'},
            {selected: false, type: 'Scooter',    icon: 'wg-icon-scooter'},
            {selected: false, type: 'Bicycle',    icon: 'wg-icon-bicycle'},
        ]
    }

    toggleSelect(vehicle: WGVehicle) {

        this.newVehicleService.next(vehicle)
    }
}

VehiclesPreferenceCtrl.$inject = ["currentUser", "alertDialog", "newVehicleService"];
