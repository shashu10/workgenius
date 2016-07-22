class PhoneCtrl {

    constructor(public ApplicationStates: ApplicationStatesService,
                public currentUser: CurrentUserService) {}

    next() {
        this.ApplicationStates.next()
    }
}

PhoneCtrl.$inject = ["ApplicationStates", "currentUser"]