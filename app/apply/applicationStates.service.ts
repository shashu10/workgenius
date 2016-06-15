class ApplicationStatesService {

    private _states = [
        'apply-phone',
        'apply-address',
        'apply-lift',
        'apply-car-info',
        'apply-car-documents',
        'apply-headshot',
        'apply-background-check-info',
        'apply-background-check-ssn',
        // 'apply-company-recommendation',
        'app.schedule'
    ]

    constructor(public $state: any) { }

    next() {
        console.log("next called")
        var i = this._states.indexOf(this.$state.current.name)
        console.log(this._states[i + 1])
        this.$state.go(this._states[i+1])
    }
}

ApplicationStatesService.$inject = ["$state"]