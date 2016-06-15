class CarDocumentsCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

CarDocumentsCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]