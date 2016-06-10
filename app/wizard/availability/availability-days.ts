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

    constructor(public $state: any, public currentUser: CurrentUser) {}

    next() {
        this.currentUser.availabilityDays = this.options;
        this.$state.go('wizard-availability-times')
    }

}

AvailabilityDaysCtrl.$inject = ["$state", "currentUser"];