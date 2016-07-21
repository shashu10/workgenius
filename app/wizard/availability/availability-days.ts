class AvailabilityDaysCtrl {

    private options

    constructor(public WizardStates: WizardStatesService, public AvailabilityConverter: AvailabilityConverterService) {
        this.options = AvailabilityConverter.days
    }

    next() {

        const toSave = _.chain(this.options)
        .filter((o) => o.selected)
        .map((o: AvailabilityOption) => o.key)
        .value()

        this.WizardStates.next({
            availabilityDays: toSave
        })

        this.WizardStates.next()
    }
}

AvailabilityDaysCtrl.$inject = ["WizardStates", "AvailabilityConverter"];