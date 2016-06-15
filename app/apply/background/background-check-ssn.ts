class BackgroundCheckSSNCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }
}

BackgroundCheckSSNCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]