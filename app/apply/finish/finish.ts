class FinishCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

FinishCtrl.$inject = ["ApplicationStates"]