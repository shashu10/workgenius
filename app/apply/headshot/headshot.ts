class HeadshotCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

HeadshotCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]