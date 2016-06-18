class GoalCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public WizardStates: any) {}

    next() {
        this.currentUser.save()
        this.WizardStates.next()
    }
}

GoalCtrl.$inject = ["$state", "currentUser", "WizardStates"]