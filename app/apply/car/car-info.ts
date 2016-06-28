class CarInfoCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

CarInfoCtrl.$inject = ["ApplicationStates"]