class AddressCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

AddressCtrl.$inject = ["ApplicationStates"]