class AvailabilityDaysCtrl {

    private options

    constructor(public WizardStates: WizardStatesService, public AvailabilityConverter: AvailabilityConverterService) {
        this.options = AvailabilityConverter.days
    }

    next() {
        this.WizardStates.next()
    }
}

AvailabilityDaysCtrl.$inject = ["WizardStates", "AvailabilityConverter"];