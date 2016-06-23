class PhoneCtrl {

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUser, public ApplicationStates: ApplicationStatesService) {}

    next() {
        console.log("nect typed")
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

PhoneCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]