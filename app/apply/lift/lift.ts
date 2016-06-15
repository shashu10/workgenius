class LiftCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

LiftCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]