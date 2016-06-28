class HeadshotCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

HeadshotCtrl.$inject = ["ApplicationStates"]