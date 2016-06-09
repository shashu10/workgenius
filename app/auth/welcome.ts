class WelcomeCtrl {
    
    public $inject = ['$state', 'currentUser']

    constructor(public $state, public currentUser: CurrentUser, public getUserData: any) {
        this.currentUser.create()
    }

    login() {
        // Easier to do this and store login credentials in currentuser
        // even though parse.login needs credientials passed in directly
        this.$state.go('login-email')
    }
    signup() {
        this.$state.go('signup-name')
    }
    skip() {
        this.getUserData();
        this.$state.go('app.schedule')
    }
}

WelcomeCtrl.$inject = ["$state", "currentUser", "getUserData"];

angular.module('wg.auth', ['wg.signup', 'wg.login', 'parseData'])

    .controller('WelcomeCtrl', WelcomeCtrl);