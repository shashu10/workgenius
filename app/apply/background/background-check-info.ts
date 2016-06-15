class BackgroundCheckInfoCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) { }

    next() {
        this.ApplicationStates.next()
    }
}

BackgroundCheckInfoCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]