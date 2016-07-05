class WizardStatesService {

    public progressbar
    private _states = [
        'wizard-goal',
        'wizard-locations',
        'wizard-availability-days',
        'wizard-availability-times',
        'wizard-vehicles',
        'app.company-recommendation',
    ]

    constructor(public $state: ng.ui.IStateService,
                public $rootScope: ng.IRootScopeService,
                public currentUser: CurrentUserService,
                public AvailabilityConverter: AvailabilityConverterService,
                public ngProgressFactory) {

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
        this.currentUser.save(params)

        this.setProgress(this.index + 1)

        // // If the worker does not need to lift, continue to the next page
        // if (this.nextPage === 'apply-weight-limit' && !this.wgCompanies.needsToLift) this._index++

        // // If the worker does not have a car, don't ask car stuff
        // if (this.nextPage === 'apply-car-info' && !this.wgVehicles.carIsSelected) this._index++

        this.$state.go(this.nextPage)
    }
}

WizardStatesService.$inject = ["$state", "$rootScope", "currentUser", "AvailabilityConverter", "ngProgressFactory"]
