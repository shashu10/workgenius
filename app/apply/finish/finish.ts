class FinishCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    finish() {
        this.ApplicationStates.finish()
    }
}

FinishCtrl.$inject = ["ApplicationStates"]