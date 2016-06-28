class LocationsCtrl {

    private otherOption = {selected: false, name: 'other', otherName: ''}
    private options: WGLocation[] = [
        {selected: false, name: 'san francisco'},
        {selected: false, name: 'east bay'},
        {selected: false, name: 'south bay'},
        {selected: false, name: 'peninsula'},
        this.otherOption,
    ]

    constructor(public WizardStates: WizardStatesService, public currentUser: CurrentUserService) {
        this.loadUserlocations(currentUser.locations)
    }

    canContinue(): boolean {
        // If other is selected, the other name must be at least 2 characters long
        if (this.otherOption.selected) return (this.otherOption.otherName || "").length >= 2

        // At least one options must be selected
        return _.reduce(this.options, (result: boolean, value: WGLocation, key) => (result || value.selected), false);
    }
    loadUserlocations(locations: WGLocation[]) {
        _.forEach(locations, (l) => {
            _.forEach(this.options, (o) => {
                if (o.name.toLowerCase() === l.name.toLowerCase())
                    o.selected = true
            })
        })
    }
    next() {
        var toSave = _.chain(angular.copy(this.options))
        .filter((o) => o.selected)
        .forEach((o) => {delete o.selected})
        .value()

        this.WizardStates.next({
            locations: toSave
        })
    }

}

interface WGLocation {
    selected: boolean
    name: string
    otherName?: string
}

LocationsCtrl.$inject = ["WizardStates", "currentUser"]