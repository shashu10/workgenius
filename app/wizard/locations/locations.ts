class LocationsCtrl {

    private options = [
        'San Francisco',
        'East Bay',
        'South Bay',
        'Peninsula',
        'Other',
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

    // // Toggle to save/remove selected cities
    // toggleCity(city) {
    //     var i = this.selectedCities.indexOf(city)
    //     if (i === -1) this.selectedCities.push(city)
    //     else this.selectedCities.splice(i, 1)
    // }

    next() {
        this.WizardStates.next()
    }

}

LocationsCtrl.$inject = ["$state", "currentUser", "PostmatesLocations", "WizardStates"]