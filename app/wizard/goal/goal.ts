class GoalCtrl {

    constructor(public $state: any, public currentUser: CurrentUser) {
        this.currentUser.goal = 100
    }

    next() {
        this.currentUser.save()
        this.$state.go('wizard-locations')
    }
}

GoalCtrl.$inject = ["$state", "currentUser"]