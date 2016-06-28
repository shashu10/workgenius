class GoalCtrl {

    constructor(public WizardStates: WizardStatesService) {}

    next() {
        this.WizardStates.next()
    }
}

GoalCtrl.$inject = ["WizardStates"]