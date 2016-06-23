class SignupCtrl {

    public error: string

    constructor(public $scope: ng.IScope, public $state: ng.ui.IStateService, public $ionicHistory: ionic.navigation.IonicHistoryService, public currentUser: CurrentUserService, public getUserData: any) { }

    doSignup() {
        this.currentUser.signUp()

            .then((argument) => {

                this.error = undefined

                this.getUserData(true);

                this.$ionicHistory.nextViewOptions({
                    historyRoot: true,
                    // disableAnimate: true
                });
                this.$state.go("wizard-goal", { clear: true });
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

    next() {

        switch (this.$state.current.name) {
            case "signup-name":
                if (!this.currentUser.name) return this.error = 'Please enter your full name';
                else return this.$state.go('signup-email');

            case "signup-email":
                if (!this.currentUser.email) return this.error = 'Please enter a valid email';
                else return this.$state.go('signup-password');

        }
    }
}

SignupCtrl.$inject = ["$scope", "$state", "$ionicHistory", "currentUser", "getUserData"];