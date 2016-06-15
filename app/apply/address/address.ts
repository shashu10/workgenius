class AddressCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) { }

    next() {
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

AddressCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]