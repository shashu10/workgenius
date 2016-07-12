class SignupCtrl {

    public error: string
    public loading = false

    constructor(public $scope: ng.IScope,
                public $state: ng.ui.IStateService,
                public $ionicHistory: ionic.navigation.IonicHistoryService,
                public currentUser: CurrentUserService,
                public getUserData: Function,
                public wgState: WGState) {

        if (!currentUser.newUserCreated) currentUser.create()

        this.checkState()
    }

    // Checks if the user can be on this state
    checkState() {
        if (this.$state.current.name === 'signup-name') return

        // If user doesn't have name, they shouldn't go to the next stage
        if (this.$state.current.name !== 'signup-name' && !this.currentUser.name) {
            console.log("signup-name")
            this.wgState.goWithoutAnimate('signup-name')

        // If user doesn't have email, they shouldn't go to the next stage
        } else if (this.$state.current.name !== 'signup-email' && !this.currentUser.email) {
            console.log("signup-email")
            this.wgState.goWithoutAnimate('signup-email')

        } // else password page
    }
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

SignupCtrl.$inject = ["$scope", "$state", "$ionicHistory", "currentUser", "getUserData", "wgState"]
