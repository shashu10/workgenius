class ApplicationStatesService {

    public progressbar
    private _states = [
        "app.phone",
        "app.address",
        "app.weight-limit",
        "app.car-info",
        "app.car-documents",
        "app.headshot",
        "app.background-check-info",
        "app.background-check-ssn",
        "app.phone-call",
        "app.companies"
    ]

    constructor(public $state: ng.ui.IStateService,
                public $rootScope: ng.IRootScopeService,
                public $ionicHistory: ionic.navigation.IonicHistoryService,
                public wgCompanies: WGCompaniesService,
                public wgVehicles: WGVehiclesService,
                public currentUser: CurrentUserService,
                public ngProgressFactory: any) {
        this.progressbar = this.ngProgressFactory.createInstance();
        this.progressbar.setColor('#09f');
    }

    get nextPage(): string {
        return this._states[this.index + 1]
    }
    get index(): number {
        return this._states.indexOf(this.$state.current.name)
    }
    linkProgressBar() {
        var unregister = this.$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => { 

            if (this.hasFinished(toState, fromState)) {
                console.log("finished")
                this.progressbar.complete()
                unregister()

            } else if (this.gonebackToStart(toState, fromState)) {
                console.log("gonebackToStart")
                this.progressbar.reset()
                unregister()

            } else {
                this.setProgress(this.index + 1)
            }
        });
    }
    hasFinished(toState: angular.ui.IState, fromState: angular.ui.IState) {
        console.log(toState)
        console.log(fromState)
        return (toState.name === "app.companies" && fromState.name === this._states[this._states.length - 2])
    }
    gonebackToStart(toState: angular.ui.IState, fromState: angular.ui.IState) {
        console.log(toState)
        console.log(fromState)
        return (toState.name === "app.companies" && fromState.name === this._states[0])
    }
    setProgress(index: number) {
        this.progressbar.set(index / this._states.length * 100)
    }
    next(params?: Object) {
        console.log("next")
        console.log(this.index)
        this.currentUser.save(params)

        var options
        // If the last page is companies, clear history
        if (this.nextPage === 'app.companies') {
            this.$ionicHistory.nextViewOptions({
                historyRoot: true,
            });
            options = {clear: true}
        }

        console.log(options)
        this.$state.go(this.nextPage)
    }
    start() {
        this._states = [
            "phone",
            "address",
            "weight-limit",
            "car-info",
            "car-documents",
            "headshot",
            "background-check-info",
            "background-check-ssn",
            "phone-call",
        ]

        // show only pages that are requirements
        this._states = _.intersection(this._states, this.wgCompanies.requirements)
        // in the end, go back to the companies view
        this._states.push('companies')

        // If the worker does not have a car, don't ask car stuff
        if (!this.wgVehicles.carIsSelected) _.pull(this._states, 'car-info', 'car-documents')

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

ApplicationStatesService.$inject = ["$state", "$rootScope", "$ionicHistory", "wgCompanies", "wgVehicles", "currentUser", "ngProgressFactory"]
