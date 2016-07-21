class AvailabilityTimesCtrl {

    private options: AvailabilityOption[]

    constructor(public WizardStates: WizardStatesService, public AvailabilityConverter: AvailabilityConverterService) {
        this.options = AvailabilityConverter.timeSlots
    }

    next() {
        this.AvailabilityConverter.setHourBlocks()

        const toSave = _.chain(this.options)
        .filter((o) => o.selected)
        .map((o: AvailabilityOption) => o.start + "-" + o.end)
        .value()

        this.WizardStates.next({
            availabilityTimes: toSave
        })
    }
}

AvailabilityTimesCtrl.$inject = ["WizardStates", "AvailabilityConverter"];