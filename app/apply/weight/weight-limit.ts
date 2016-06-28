class WeightLimitCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) { }

    next() {
        this.ApplicationStates.next()
    }
}

WeightLimitCtrl.$inject = ["ApplicationStates"]