class ApplicationStatesService {

    private _states = [
        'apply-company-recommendation',
        'apply-phone',
        'apply-address',
        'apply-weight-limit',
        'apply-car-info',
        'apply-car-documents',
        'apply-headshot',
        'apply-background-check-info',
        'apply-background-check-ssn',
        // 'apply-phone-call',
        'app.connect-accounts'
    ]

    constructor(public $state: ng.ui.IStateService,
                public wgCompanies: WGCompaniesService,
                public wgVehicles: WGVehiclesService,
                public currentUser: CurrentUserService) {}

    private _index = 0

    get nextPage(): string {
        return this._states[this._index + 1]
    }

    next(params?: Object) {
        this.currentUser.save(params)

        this._index = this._states.indexOf(this.$state.current.name)

        // If the worker does not need to lift, continue to the next page
        if (this.nextPage === 'apply-weight-limit' && !this.wgCompanies.needsToLift) this._index++

        // If the worker does not have a car, don't ask car stuff
        if (this.nextPage === 'apply-car-info' && !this.wgVehicles.carIsSelected) this._index++

        this.$state.go(this.nextPage)
    }
}

ApplicationStatesService.$inject = ["$state", "wgCompanies", "wgVehicles", "currentUser"]