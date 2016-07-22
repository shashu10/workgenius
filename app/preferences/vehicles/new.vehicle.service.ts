class NewVehicleService {
//	private _states = ['app.new-vehicle','app.new-vehicle-make'];
	private carType:string
	constructor(public wgState:WGState,public currentUser:CurrentUserService, public alertDialog:AlertDialogService){
	}
	next(vehicle:WGVehicle){
		if (vehicle.type === "Car" ||  vehicle.type === "Truck/Van"){
			this.carType = vehicle.type
			this.wgState.go('app.new-vehicle-make')
		} else {
			this.save(vehicle.type)
			this.wgState.goWithoutAnimate('app.vehicle-list')
		}
	}

	complete(brand:string,model:string,year:number) {
		this.save(this.carType,brand,model,year);
		this.wgState.goWithoutAnimate('app.vehicle-list');
	}	
	save(type:string,brand?:string,model?:string,year?:number) {
		let vehicle:WGVehicle = {
			selected:true,
			make:brand,
			model:model,
			type:type,
			year:year,
			icon:''
		};

		var vehicles = this.currentUser.vehicles;
		if (!vehicles) {
			vehicles = [];
		}
		vehicles.push(vehicle);
		this.currentUser.save({"vehicles":vehicles});
	}
}

NewVehicleService.$inject = ['wgState','currentUser','alertDialog'];