interface AvailabilityOption {
    selected: boolean
    title: string
    start?: string
    end?: string
    key?: string
}

interface WGAvailability {
    [day: string]: number[]
}

class AvailabilityConverterService {

    public days: AvailabilityOption[] = []

    public timeSlots: AvailabilityOption[] = []

    constructor(public currentUser: CurrentUserService) {
        this.reset()
    }

    reset() {
        _.remove(this.days)
        Array.prototype.push.apply(this.days, [
            {key: 'MON', title: 'monday',    selected: false},
            {key: 'TUE', title: 'tuesday',   selected: false},
            {key: 'WED', title: 'wednesday', selected: false},
            {key: 'THU', title: 'thursday',  selected: false},
            {key: 'FRI', title: 'friday',    selected: false},
            {key: 'SAT', title: 'saturday',  selected: false},
            {key: 'SUN', title: 'sunday',    selected: false},
        ])

        _.remove(this.timeSlots)
        Array.prototype.push.apply(this.timeSlots, [
            {title: 'mornings',   start: '6am',  end: '10am', selected: false},
            {title: 'lunch',      start: '10am', end: '2pm',  selected: false},
            {title: 'afternoons', start: '2pm',  end: '5pm',  selected: false},
            {title: 'evenings',   start: '5pm',  end: '9pm',  selected: false},
            {title: 'nights',     start: '9pm',  end: '2am',  selected: false},
        ])

    }
    setHourBlocks() {
        const availability: WGAvailability = {};
        // For each day
        _.forEach(this.days, (day) => {
            _.forEach(this.timeSlots, (slot) => {

                // If that day and timeslot is selected
                if (day.selected && slot.selected) {
                    availability[day.key] = availability[day.key] || [];
                    this.addAvailabilityWithSlot(slot, availability[day.key]);
                }
            })
        })
        this.currentUser.availability = availability
    }

    addAvailabilityWithSlot (timeslot: AvailabilityOption, dayAvail: number[]) {
        const start = Number(moment(timeslot.start, "ha").format('H'));
        let end = Number(moment(timeslot.end, "ha").format('H'));

        if (end < start)
            end += 24;

        for (let i = start; i < end; i++) {
            if (i >= 24) dayAvail.push(i - 24);
            else dayAvail.push(i);
        }
    }
}

AvailabilityConverterService.$inject = ["currentUser"]
