class CarDocumentsCtrl {

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUserService, public ApplicationStates: ApplicationStatesService) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

CarDocumentsCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]