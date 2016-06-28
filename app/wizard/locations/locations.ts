class LocationsCtrl {

    private otherOption = {selected: false, name: 'other', otherName: ''}
    private options: WGLocation[] = [
        {selected: false, name: 'san francisco'},
        {selected: false, name: 'east bay'},
        {selected: false, name: 'south bay'},
        {selected: false, name: 'peninsula'},
        this.otherOption,
    ]

    constructor(public WizardStates: WizardStatesService) {}

    canContinue(): boolean {
        // If other is selected, the other name must be at least 2 characters long
        if (this.otherOption.selected) return (this.otherOption.otherName || "").length >= 2

        // At least one options must be selected
        return _.reduce(this.options, (result: boolean, value: WGLocation, key) => (result || value.selected), false);
    }

    next() {
        console.log(_.filter(this.options, (o) => o.selected))
        console.log(angular.copy(_.filter(this.options, (o) => o.selected)))
        this.WizardStates.next({
            locations: angular.copy(_.filter(this.options, (o) => o.selected))
        })
    }

}

interface WGLocation {
    selected: boolean
    name: string
    otherName?: string
}

LocationsCtrl.$inject = ["WizardStates"]