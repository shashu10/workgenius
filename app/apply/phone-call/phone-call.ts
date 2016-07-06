class PhoneCallCtrl {

    constructor(public ApplicationStates: ApplicationStatesService) {}

    next() {
        this.ApplicationStates.next()
    }
}

PhoneCallCtrl.$inject = ["ApplicationStates"]