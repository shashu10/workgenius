class PhoneCtrl {

    constructor(public $state: any, public currentUser: CurrentUser, public ApplicationStates: any) {}

    next() {
        console.log("nect typed")
        this.currentUser.save()
        this.ApplicationStates.next()
    }

}

PhoneCtrl.$inject = ["$state", "currentUser", "ApplicationStates"]