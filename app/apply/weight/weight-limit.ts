class WeightLimitCtrl {

    constructor(public ApplicationStates: ApplicationStatesService,
                public currentUser: CurrentUserService) { }

    next() {
        this.ApplicationStates.next()
    }
}

WeightLimitCtrl.$inject = ["ApplicationStates", "currentUser"]