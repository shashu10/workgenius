class BackgroundCheckSSNCtrl {

    constructor(public ApplicationStates: ApplicationStatesService,
                public currentuser: CurrentUserService) {}

    next() {
        this.ApplicationStates.next()
    }
}

BackgroundCheckSSNCtrl.$inject = ["ApplicationStates", "currentuser"]