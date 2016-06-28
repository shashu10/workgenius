class PhoneCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

PhoneCtrl.$inject = ["ApplicationStates"]