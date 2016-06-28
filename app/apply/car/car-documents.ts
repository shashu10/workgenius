class CarDocumentsCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

CarDocumentsCtrl.$inject = ["ApplicationStates"]