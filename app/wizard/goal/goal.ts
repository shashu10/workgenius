class GoalCtrl {

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUserService, public WizardStates: WizardStatesService) {}

    next() {
        this.currentUser.save()
        this.WizardStates.next()
    }
}

GoalCtrl.$inject = ["$state", "currentUser", "WizardStates"]