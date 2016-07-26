class VehicleListCtrl {
    private vehicles: WGVehicle[]
    public list: WGVehicle[] = []

    constructor(public currentUser: CurrentUserService, public $state) {
        console.log(currentUser)
        this.list = angular.copy(currentUser.vehicles)
    }
    deleteVehicle(index: number) {
        this.list.splice(index, 1)
        this.currentUser.vehicles = angular.copy(this.list)
        this.currentUser.save()
    }

    getIcon(vehicle: WGVehicle) {
        if (!vehicle || !vehicle.type) return

        switch (vehicle.type.toLowerCase()) {
            case "car":        return "wg-icon-car";
            case "truck/van":  return "wg-icon-truck";
            case "motorcycle": return "wg-icon-motorcycle";
            case "scooter":    return "wg-icon-scooter";
            case "bicycle":    return "wg-icon-bicycle";
        }
    }
    longText(vehicle: WGVehicle) {
        if (vehicle.type.toLowerCase() === 'car' || vehicle.type.toLowerCase() === 'truck/van') {

            console.log(vehicle)
            if (vehicle.make && vehicle.model && vehicle.year)
                return vehicle.make + " " + vehicle.model + " " + vehicle.year
        }
        return vehicle.type
    }
    addNew() {
        this.$state.go("app.new-vehicle");
    }
}
VehicleListCtrl.$inject = ["currentUser", "$state"];
