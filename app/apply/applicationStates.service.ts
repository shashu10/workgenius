class ApplicationStatesService {

    private _states = [
        'apply-company-recommendation',
        'apply-phone',
        'apply-address',
        'apply-lift',
        'apply-car-info',
        'apply-car-documents',
        'apply-headshot',
        'apply-background-check-info',
        'apply-background-check-ssn',
        // 'apply-phone-call',
        'app.schedule'
    ]

    constructor(public $state: ng.ui.IStateService, public wgCompanies: WGCompanies, public currentUser: CurrentUser) { }

    next() {
        console.log("next called")
        var i = this._states.indexOf(this.$state.current.name)
        var next = this._states[i+1];

        // If the worker does not need to lift, continue to the next page
        if (next === 'apply-lift' && !this.wgCompanies.needsToLift()) next = 'apply-car-info'

        // If the worker does not have a car, don't ask car stuff
        if (next === 'apply-car-info' && !this.currentUser.hasCar()) next = 'apply-headshot'

        this.$state.go(next)
    }
}

ApplicationStatesService.$inject = ["$state", "wgCompanies", "currentUser"]