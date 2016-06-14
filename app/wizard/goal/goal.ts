class GoalCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public WizardStates: any) {
        this.currentUser.goal = 100
    }

    next() {
        this.currentUser.save()
        this.WizardStates.next()
    }
}

GoalCtrl.$inject = ["$state", "currentUser", "WizardStates"]