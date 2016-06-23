class LiftCtrl {

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUser, public ApplicationStates: ApplicationStatesService) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

LiftCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]