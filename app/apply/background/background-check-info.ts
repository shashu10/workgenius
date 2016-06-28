class BackgroundCheckInfoCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

BackgroundCheckInfoCtrl.$inject = ["ApplicationStates"]