class LoginCtrl {

    public error: string
    public success: string
    public loading = false

    constructor(public $scope: angular.IScope,
                public $state: angular.ui.IStateService,
                public $ionicHistory: ionic.navigation.IonicHistoryService,
                public currentUser: CurrentUserService,
                public getUserData: Function,
                public wgState: WGState) {

        if (!currentUser.newUserCreated) currentUser.create()

        this.checkState()
    }

    // Checks if the user can be on this state
    checkState() {
        if (this.$state.current.name === 'login-forgot-password') return

        // If user doesn't have email, they shouldn't go to the next stage
        else if (this.$state.current.name !== 'login-email' && !this.currentUser.email) {
            this.wgState.goWithoutAnimate('login-email')

        } // else password page
    }
    doLogin() {
        this.loading = true

        this.currentUser.logIn()

            .then((user) => {
                this.loading = false
                this.success = undefined
                this.error = undefined

                this.$state.go('app.schedule', {
                    clear: true
                })
            },

            (err) => {
                this.loading = false
                this.success = undefined

                if (err.code === 101) // invalid email
                    this.error = "Email or password was incorrect"
                else
                    this.error = "Something went wrong :( Try again later"

                this.$scope.$apply()
            })
    }

    goBack() {
        this.success = undefined
        this.error = undefined
        this.$ionicHistory.goBack()
    }

    next(type: string, stateName:string) {

        switch (type) {
            case "name":
                if (!this.currentUser.name) {
                    this.error = 'Please enter your full name'
                    return
                }
                break
            case "email":
                if (!this.currentUser.email) {
                    this.error = 'Please enter a valid email'
                    return
                }
                break
            case "password":
                if (!this.currentUser.password) {
                    this.error = 'Please enter a password'
                    return
                }
                break
        }
        this.$state.go(stateName)
    }

    forgotPassword() {
        this.$state.go('login-forgot-password')
    }

    resetPassword() {

        this.currentUser.resetPassword()

            .then((argument) => {

                this.error = undefined
                this.success = 'Password  sent'
                this.$scope.$apply()
            },

            (err) => {

                this.success = undefined

                if (err.code === 125)
                    this.error = 'This is not a valid email address'
                else if (err.code === 205)
                    this.error = 'This email is not registered'
                else
                    this.error = "Something went wrong :( Try again later"

                console.log(err)
                this.$scope.$apply()
            })
    }
}

LoginCtrl.$inject = ["$scope", "$state", "$ionicHistory", "currentUser", "getUserData", "wgState"]
