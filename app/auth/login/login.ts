class LoginCtrl {

    // public $inject = ['$state', 'currentUser']
    public user : CurrentUser
    public error: string

    constructor(public $scope: any, public $state: any, public $ionicHistory: any, public currentUser: CurrentUser) {
        this.user = currentUser
    }

    doLogin() {
        this.currentUser.logIn()

            .then((argument) => {

                console.log("success")
                this.$state.go("app.schedule")
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
        console.log(type)
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

LoginCtrl.$inject = ["$scope", "$state", "$ionicHistory", "currentUser"];

angular.module('wg.login', ['wg.user'])

.controller('LoginCtrl', LoginCtrl)