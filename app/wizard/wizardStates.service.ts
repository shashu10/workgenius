class WizardStatesService {

    private _states = [
        'wizard-goal',
        'wizard-locations',
        'wizard-availability-days',
        'wizard-availability-times',
        'wizard-vehicles',
        'apply-phone',
    ]

    constructor(public $state: any) { }

    next() {
        console.log("next called")
        var i = this._states.indexOf(this.$state.current.name)
        this.$state.go(this._states[i+1])
        console.log(this._states[i + 1])
        // if (Parse.User.current()) // Testing env may not have current user
        //     return this._states.save()
        // else
        //     return Parse.Promise.as(this._states)
    }
}

WizardStatesService.$inject = ["$state"]