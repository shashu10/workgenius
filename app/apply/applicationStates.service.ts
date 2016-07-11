class ApplicationStatesService {

    public progressbar
    private _states: string[]

    constructor(public $state: ng.ui.IStateService,
                public $rootScope: ng.IRootScopeService,
                public $ionicHistory: ionic.navigation.IonicHistoryService,
                public wgCompanies: WGCompaniesService,
                public currentUser: CurrentUserService,
                public ngProgressFactory: any) {
        this.resetStates()
        this.progressbar = this.ngProgressFactory.createInstance()
        this.progressbar.setColor('#09f')
    }

    resetStates() {
        this._states = [
            "phone",
            "address",
            "weight-limit",
            "car-info",
            "car-documents",
            "headshot",
            "bg-info",
            "bg-ssn",
            "phone-call",
        ]
    }
    get nextPage(): string {
        return this._states[this.index + 1]
    }
    get index(): number {
        return this._states.indexOf(this.$state.current.name)
    }
    linkProgressBar() {
        var unregister = this.$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => { 

            if (this.gonebackToStart(toState)) {
                console.log("completed application")
                if (this.hasFinished(toState, fromState)) this.progressbar.complete()
                else this.progressbar.reset()
                unregister()

            } else {
                this.setProgress(this.index + 1)
            }
        })
    }
    hasFinished(toState: angular.ui.IState, fromState: angular.ui.IState) {
        console.log(fromState)
        console.log(toState)
        return (toState.name === "app.companies" && fromState.name === this._states[this._states.length - 2])
    }
    gonebackToStart(toState: angular.ui.IState) {
        return (toState.name === "app.companies")
    }
    setProgress(index: number) {
        this.progressbar.set(index / this._states.length * 100)
    }
    next(params?: Object) {
        this.currentUser.save(params)

        // If the last page is companies, clear history
        if (this.nextPage === 'app.companies') this.$ionicHistory.nextViewOptions({historyRoot: true})

        this.$state.go(this.nextPage)
    }
    start() {
        this.resetStates()

        // show only pages that are requirements
        this._states = _.intersection(this._states, this.wgCompanies.requiredPages)
        // in the end, go back to the companies view
        this._states.push('companies')

        // If the worker does not have a car, don't ask car stuff

        // Check if user already has already input this information
        if (this.currentUser.phone) _.pull(this._states, 'phone')
        if (_.isEmpty(this.currentUser.address)) _.pull(this._states, 'address')

        // prepend 'app.' to the state name
        this._states = _.map(this._states, (s) => ('app.' + s))

        this.linkProgressBar()

        // need to set progress and go to state manually
        this.setProgress(1)
        this.$state.go(this._states[0])
    }
}

ApplicationStatesService.$inject = ["$state", "$rootScope", "$ionicHistory", "wgCompanies", "currentUser", "ngProgressFactory"]
