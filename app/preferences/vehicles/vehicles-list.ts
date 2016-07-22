class VehicleListCtrl {
    private vehicles: WGVehicle[]

	constructor(public currentUser:CurrentUserService,public $state) {
		console.log("hello");
		this.vehicles = currentUser.vehicles
		this.insertIcons()
		console.log(this.vehicles)
	}
	insertIcons() {
		_(this.vehicles).forEach((vehicle)=>{
			switch (vehicle.type) {
				case "Car" : vehicle.icon = "wg-icon-car";break;
				case "Truck/Van" : vehicle.icon = "wg-icon-truck";break;
				case "Motorcycle" : vehicle.icon = "wg-icon-motorcycle";break;
				case "Scooter" : vehicle.icon = "wg-icon-scooter";break;
				case "Bicycle" : vehicle.icon = "wg-icon-bicycle";break;
			}
		});
	}
	addNew() {
		this.$state.go("app.new-vehicle");
	}
} 
VehicleListCtrl.$inject = ["currentUser", "$state"];