class WelcomeCtrl {

    private $inject = ["$state", "currentUser", "getUserData"]

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUserService, public getUserData: Function) {}

    login() {
        // Easier to do this and store login credentials in currentuser
        // even though parse.login needs credientials passed in directly
        this.currentUser.create()
        this.$state.go('login-email')
    }
    signup() {
        this.currentUser.create()
        this.$state.go('signup-name')
    }
    skip() {
        this.currentUser.create()
        this.getUserData()
        this.$state.go('app.schedule')
    }
}