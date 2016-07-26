class VehicleInfoPreferenceCtrl {
    public model: string = ""
    public year: number
    public make: string = ""

    constructor(public newVehicleService: NewVehicleService,
                public currentUser: CurrentUserService) {}

    submit() {
        this.newVehicleService.complete(this.make, this.model, this.year);
    }
}

VehicleInfoPreferenceCtrl.$inject = ["newVehicleService", "currentUser"]