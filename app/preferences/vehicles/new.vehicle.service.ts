class NewVehicleService {
//    private _states = ['app.new-vehicle','app.new-vehicle-make'];
    private carType: string

    constructor(public wgState: WGState, public currentUser: CurrentUserService,  public $ionicHistory: ionic.navigation.IonicHistoryService) {}

    next(vehicle: WGVehicle) {
        if (vehicle.type === "Car" ||  vehicle.type === "Truck/Van") {
            this.carType = vehicle.type
            this.wgState.go('app.new-vehicle-make')
        } else {
            this.save(vehicle.type)
            this.$ionicHistory.goBack()
            // this.wgState.goWithoutBack('app.vehicle-list')
        }
    }

    complete(brand: string, model: string, year: number) {
        this.save(this.carType, brand, model, year);
        // this.wgState.goWithoutBack('app.vehicle-list');
        console.log(this)
        console.log(this.$ionicHistory)
        this.$ionicHistory.goBack(-2)
    }
    save(type: string, brand?: string, model?: string, year?: number) {
        this.currentUser.addVehicle({
            make: brand,
            model: model,
            type: type,
            year: year
        })
    }
}

NewVehicleService.$inject = ['wgState', 'currentUser', '$ionicHistory'];