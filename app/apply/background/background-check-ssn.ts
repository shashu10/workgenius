class BackgroundCheckSSNCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

BackgroundCheckSSNCtrl.$inject = ["ApplicationStates"]