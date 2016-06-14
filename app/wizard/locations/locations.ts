class LocationsCtrl {

    // private options = [
    //     'San Francisco',
    //     'East Bay',
    //     'South Bay',
    //     'Peninsula',
    //     'Other',
    // ]
    private groups: any[]
    private shownState: any
    private selectedCities: string[] = []

    constructor(public $state: any, public currentUser: CurrentUser, private PostmatesLocations: Object[]) {

        // Northern california
        this.shownState = PostmatesLocations[1]
    }

    // Toggle for accordion effect
    toggleState(state) {
        if (this.isStateShown(state)) this.shownState = null
        else this.shownState = state
    }
    isStateShown(state) {
        return this.shownState === state
    }

    // Toggle to save/remove selected cities
    toggleCity(city) {
        var i = this.selectedCities.indexOf(city)
        if (i === -1) this.selectedCities.push(city)
        else this.selectedCities.splice(i, 1)
    }

    next() {
        this.currentUser.locations = this.selectedCities
        this.$state.go('wizard-availability-days')
    }

}

LocationsCtrl.$inject = ["$state", "currentUser", "PostmatesLocations"]