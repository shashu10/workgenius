class BackgroundCheckInfoCtrl {

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUserService, public ApplicationStates: ApplicationStatesService) { }

    next() {
        this.ApplicationStates.next()
    }
}

BackgroundCheckInfoCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]