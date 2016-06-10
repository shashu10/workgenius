class AvailabilityTimesCtrl {

    private options: AvailabilityOption[] = [
        { selected: false, title: "mornings" },
        { selected: false, title: "mid-day" },
        { selected: false, title: "afternoons" },
        { selected: false, title: "evenings" },
        { selected: false, title: "nights" },
    ]

    constructor(public $state: any, public currentUser: CurrentUser) {}

    next() {
        this.currentUser.availabilityTimes = this.options;
        this.$state.go('wizard-vehicles')
    }

}

AvailabilityTimesCtrl.$inject = ["$state", "currentUser"];