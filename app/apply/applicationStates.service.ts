class ApplicationStatesService {

    public progressbar
    private _states = [
        'app.companies',
        'app.phone',
        'app.address',
        'app.weight-limit',
        'app.car-info',
        'app.car-documents',
        'app.headshot',
        'app.background-check-info',
        'app.background-check-ssn',
        // 'apply-phone-call',
        'app.connect-accounts'
    ]

    constructor(public $state: ng.ui.IStateService,
                public $rootScope: ng.IRootScopeService,
                public wgCompanies: WGCompaniesService,
                public wgVehicles: WGVehiclesService,
                public currentUser: CurrentUserService,
                public ngProgressFactory: any) {
        this.initProgressBar()
    }

    get nextPage(): string {
        return this._states[this.index + 1]
    }
    get index(): number {
        return this._states.indexOf(this.$state.current.name)
    }
    initProgressBar() {
        this.progressbar = this.ngProgressFactory.createInstance();
        this.progressbar.setColor('#09f');

        var unregister = this.$rootScope.$on('$stateChangeSuccess', () => { 
            
            this.setProgress(this.index)
            if (this.hasFinished()) {
                this.progressbar.complete()
                unregister()
            }
        });
    }
    hasFinished() {
        return this.$state.current.name === this._states[this._states.length - 1]
    }
    setProgress(index: number) {
        this.progressbar.set(index / this._states.length * 100)
    }
    next(params?: Object) {
        console.log("next")
        console.log(this.index)
        this.currentUser.save(params)

        this.setProgress(this.index + 1)

        // // If the worker does not need to lift, continue to the next page
        // if (this.nextPage === 'apply-weight-limit' && !this.wgCompanies.needsToLift) this._index++

        // // If the worker does not have a car, don't ask car stuff
        // if (this.nextPage === 'apply-car-info' && !this.wgVehicles.carIsSelected) this._index++

        this.$state.go(this.nextPage)
    }
}

ApplicationStatesService.$inject = ["$state", "$rootScope", "wgCompanies", "wgVehicles", "currentUser", "ngProgressFactory"]
