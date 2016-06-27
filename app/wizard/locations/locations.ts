class LocationsCtrl {

    private otherCity: string
    private showOther = false;
    private options: WGLocation[] = [
        {selected: false, name: 'san francisco'},
        {selected: false, name: 'east bay'},
        {selected: false, name: 'south bay'},
        {selected: false, name: 'peninsula'},
        {selected: false, name: 'other'},
    ]

    constructor(public $state: ng.ui.IStateService, public currentUser: CurrentUserService, private PostmatesLocations: Object[], public WizardStates: WizardStatesService) {}

    // Accordion //

    // private groups: any[]
    // private shownState: any
    // private selectedCities: string[] = []

    // // Toggle for accordion effect
    // toggleState(state) {
    //     if (this.isStateShown(state)) this.shownState = null
    //     else this.shownState = state
    // }
    // isStateShown(state) {
    //     return this.shownState === state
    // }

    // Toggle to save/remove selected cities
    tapped(option: WGLocation) {
        if (option.name === 'other') {
            this.showOther = option.selected
            console.log("clicked other");
        }
    }

    canContinue(): boolean {
        // If other is selected, the other name must be at least 2 characters long
        const other = _.find(this.options, (o: WGLocation) => o.name === 'other')
        if (other.selected) return (this.otherCity || "").length >= 2

        // At least one options must be selected
        return _.reduce(this.options, (result: boolean, value: WGLocation, key) => (result || value.selected), false);
    }

    next() {
        this.WizardStates.next()
    }

}

interface WGLocation {
    selected: boolean
    name: string
}
LocationsCtrl.$inject = ["$state", "currentUser", "PostmatesLocations", "WizardStates"]