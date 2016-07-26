class CarInfoCtrl {

    public vehicle: WGVehicle

    constructor(public ApplicationStates: ApplicationStatesService,
                public currentUser: CurrentUserService) {
        this.vehicle = this.currentUser.getAnyAutomobile()
    }

    next() {
        this.ApplicationStates.next()
    }
}

CarInfoCtrl.$inject = ["ApplicationStates", "currentUser"]