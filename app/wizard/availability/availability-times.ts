class AvailabilityTimesCtrl {

    private options

    constructor(public WizardStates: WizardStatesService, public AvailabilityConverter: AvailabilityConverterService) {
        this.options = AvailabilityConverter.timeSlots
    }

    next() {
        this.AvailabilityConverter.setHourBlocks()
        this.WizardStates.next()
    }
}

AvailabilityTimesCtrl.$inject = ["WizardStates", "AvailabilityConverter"];