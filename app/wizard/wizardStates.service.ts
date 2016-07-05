class WizardStatesService {

    private _states = [
        'wizard-goal',
        'wizard-locations',
        'wizard-availability-days',
        'wizard-availability-times',
        'wizard-vehicles',
        'apply-company-recommendation',
    ]

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUserService, public AvailabilityConverter: AvailabilityConverterService) { }

    next(params?: Object) {
        this.currentUser.save(params)

        var i = this._states.indexOf(this.$state.current.name)
        this.$state.go(this._states[i+1])
    }
}

WizardStatesService.$inject = ["$state", "currentUser", "AvailabilityConverter"]