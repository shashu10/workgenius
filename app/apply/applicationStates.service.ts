class ApplicationStatesService {

    public progressbar
    private _states: string[]
    constructor(public $state: ng.ui.IStateService,
                public $rootScope: ng.IRootScopeService,
                public $ionicHistory: ionic.navigation.IonicHistoryService,
                public wgCompanies: WGCompaniesService,
                public currentUser: CurrentUserService,
                public ngProgressFactory: any) {
        this.progressbar = this.ngProgressFactory.createInstance()
        this.progressbar.setColor('#09f')
        this.init()
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
        const unregister = this.$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {

            if (this.gonebackToStart(toState)) {

                if (this.hasFinished(toState, fromState)) {
                    this.progressbar.complete()

                } else this.progressbar.reset()
                    unregister()

            } else {
                this.setProgress(this.index + 1)
            }
        })
    }
    hasFinished(toState: angular.ui.IState, fromState: angular.ui.IState) {
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
    private removeExistingValues() {
        // Check if user already has already input this information
        // "phone"
        if (this.currentUser.phone) _.remove(this._states, (s) => s === 'phone')

        // "address"
        if (this.currentUser.address           &&
            this.currentUser.address['street'] &&
            this.currentUser.address['city']   &&
            this.currentUser.address['state']  &&
            this.currentUser.address['zip'])
            _.remove(this._states, (s) => s === 'address')

        // "weight-limit"
        if (this.currentUser.canLift50lbs) _.remove(this._states, (s) => s === 'weight-limit')

        // "car-info"
        // if (this.currentUser.phone) _.remove(this._states, (s) => s === 'phone')

        // "car-documents"
        // if (this.currentUser.phone) _.remove(this._states, (s) => s === 'phone')

        // "headshot"
        // if (this.currentUser.phone) _.remove(this._states, (s) => s === 'phone')

        // "bg-info"
        // "bg-ssn"
        if (this.currentUser.ssn) {
            _.remove(this._states, (s) => s === 'bg-info')
            _.remove(this._states, (s) => s === 'bg-ssn')
        }

        // "phone-call"
        // if (this.currentUser.phone) _.remove(this._states, (s) => s === 'phone')
    }
    init() {
        this.resetStates()

        // show only pages that are requirements
        this._states = _.intersection(this._states, this.wgCompanies.requiredPages)

        // If the worker does not have a car, don't ask car stuff

        this.removeExistingValues()
        // in the end, go back to the companies view
        this._states.push('finish')
        this._states.push('companies')

        // prepend 'app.' to the state name
        this._states = _.map(this._states, (s) => (`app.${s}`))

        this.linkProgressBar()
    }
    start() {

        this.init()
        // need to set progress and go to state manually
        this.setProgress(1)
        this.$state.go(this._states[0])
    }
    finish() {
        this.wgCompanies.applyToInterested()
        // need to set progress and go to state manually
        this.next()
    }
}

ApplicationStatesService.$inject = ["$state", "$rootScope", "$ionicHistory", "wgCompanies", "currentUser", "ngProgressFactory"]
