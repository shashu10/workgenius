class WelcomeCtrl {
    
    public $inject = ['$state', 'currentUser']

    constructor(public $state, public currentUser: CurrentUser) {
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
        this.$state.go('app.schedule')
    }
}

angular.module('workgenius.registration', ['wg.signup', 'wg.login'])

    .controller('WelcomeCtrl', WelcomeCtrl);