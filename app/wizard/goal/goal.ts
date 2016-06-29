class GoalCtrl {

    constructor(public WizardStates: WizardStatesService, public currentUser: CurrentUserService) {}

    next() {
        this.WizardStates.next()
    }
}

GoalCtrl.$inject = ["WizardStates", "currentUser"]