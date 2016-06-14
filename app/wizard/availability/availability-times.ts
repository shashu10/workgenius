class AvailabilityTimesCtrl {

    private options: AvailabilityOption[] = [
        { selected: false, title: "mornings" },
        { selected: false, title: "mid-day" },
        { selected: false, title: "afternoons" },
        { selected: false, title: "evenings" },
        { selected: false, title: "nights" },
    ]

    constructor(public $state: any, public currentUser: CurrentUser, public WizardStates: any) {}

    next() {
        this.currentUser.availabilityTimes = this.options;
        this.WizardStates.next()
    }

}

AvailabilityTimesCtrl.$inject = ["$state", "currentUser", "WizardStates"];