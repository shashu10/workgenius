class SignupCtrl {

    public error: string
    public loading = false

    constructor(public $scope: ng.IScope,
                public $state: ng.ui.IStateService,
                public $ionicHistory: ionic.navigation.IonicHistoryService,
                public currentUser: CurrentUserService,
                public getUserData: Function,
                public wgDataManager: WGDataManagerService) {}

    doSignup() {
        this.loading = true

        this.currentUser.signUp()

            .then((user) => {
                this.loading = false
                this.error = undefined

                this.$ionicHistory.nextViewOptions({
                    historyRoot: true,
                    // disableAnimate: true
                })

                this.wgDataManager.init()

                this.$state.go("wizard-goal", { clear: true })
            },

            (err) => {

                this.loading = false

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
        this.$ionicHistory.goBack()
    }

    next() {
        switch (this.$state.current.name) {
            case "signup-name":
                if (!this.currentUser.name) this.error = 'Please enter your full name'
                else this.$state.go('signup-email')
                break
            case "signup-email":
                if (!this.currentUser.email) this.error = 'Please enter a valid email'
                else this.$state.go('signup-password')
                break
        }
    }
}

SignupCtrl.$inject = ["$scope", "$state", "$ionicHistory", "currentUser", "getUserData", "wgDataManager"]