class CarInfoCtrl {

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUser, public ApplicationStates: ApplicationStatesService) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

CarInfoCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]