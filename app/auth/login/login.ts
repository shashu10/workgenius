class LoginCtrl {

    public error: string

    constructor(public $scope: any, public $state: any, public $ionicHistory: any, public currentUser: CurrentUser, public getUserData: any) {}

    doLogin() {
        this.currentUser.logIn()

            .then((argument) => {
                this.getUserData().then(function(onboarding) {
                    mixpanel.register({
                        'Email': this.currentUser.email,
                        'Name': this.currentUser.email,
                        'Target': this.currentUser.email,
                    });

                    this.$state.go('app.schedule', {
                        clear: true
                    });
                });
            },

            (err) => {
                if (err.code === 101) // invalid email
                    this.error = "Email or password was incorrect"
                else
                    this.error = "Something went wrong :( Try again later"

                this.$scope.$apply()
            })
    }

    goBack() {
        this.error = undefined
        this.$ionicHistory.goBack();
    }

    next(type: string, stateName:string) {

        switch (type) {
            case "name":
                if (!this.currentUser.name)
                    return this.error = 'Please enter your full name';
                break;
            case "email":
                if (!this.currentUser.email)
                    return this.error = 'Please enter a valid email';
                break;
            case "password":
                if (!this.currentUser.password)
                    return this.error = 'Please enter a password';
                break;
        }
        this.$state.go(stateName)
    }
}

LoginCtrl.$inject = ["$scope", "$state", "$ionicHistory", "currentUser", "getUserData"];

angular.module('wg.login', ['wg.user', 'parseData'])

.controller('LoginCtrl', LoginCtrl)