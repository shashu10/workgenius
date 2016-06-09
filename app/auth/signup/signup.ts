class SignupCtrl {

    public error: string

    constructor(public $scope: any, public $state: any, public $ionicHistory: any, public currentUser: CurrentUser, public getUserData: any) {}

    doSignup() {
        this.currentUser.signUp()

            .then((argument) => {
                this.getUserData(true);
                this.$state.go("app.schedule")
            },

            (err) => {
                if (err.code === 125) // invalid email
                    this.error = "Please enter a valid email address"
                else if (err.code === 202) // invalid email
                    this.error = "This user already exists. Try logging in instead"
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

SignupCtrl.$inject = ["$scope", "$state", "$ionicHistory", "currentUser", "getUserData"];

angular.module('wg.signup', ['wg.user', 'parseData'])

.controller('SignupCtrl', SignupCtrl)