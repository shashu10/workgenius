class BackgroundCheckSSNCtrl {

    constructor(public ApplicationStates: ApplicationStatesService,
                public currentUser: CurrentUserService) {}

    next() {
        this.ApplicationStates.next()
    }
}

BackgroundCheckSSNCtrl.$inject = ["ApplicationStates", "currentUser"]