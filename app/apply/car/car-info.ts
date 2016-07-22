class CarInfoCtrl {

    constructor(public ApplicationStates: ApplicationStatesService,
                public currentUser: CurrentUserService) {}

    next() {
        this.ApplicationStates.next()
    }
}

CarInfoCtrl.$inject = ["ApplicationStates", "currentUser"]