class AvailabilityDaysCtrl {

    private options: AvailabilityOption[] = [
        { selected: false, title: "monday" },
        { selected: false, title: "tuesday" },
        { selected: false, title: "wednesday" },
        { selected: false, title: "thursday" },
        { selected: false, title: "friday" },
        { selected: false, title: "saturday" },
        { selected: false, title: "sunday" },
    ]

    constructor(public currentUser: CurrentUserService, public WizardStates: WizardStatesService) { }

    next() {
        this.currentUser.availabilityDays = this.options;
        this.WizardStates.next()
    }

}

AvailabilityDaysCtrl.$inject = ["currentUser", "WizardStates"];