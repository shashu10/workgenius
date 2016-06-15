class CarInfoCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

CarInfoCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]