class FlexTimePicker implements ng.IDirective {

    static instance(): ng.IDirective {
        return new FlexTimePicker()
    }

    templateUrl = 'templates/shared/flex-time-picker.html'
    restrict = 'E'
    scope = {
        shift: '=',
    }

    link(scope: ng.IScope, element: JQuery, attributes: ng.IAttributes)
    {
        var s: WGAvailableShift = scope['shift']

        s.startsAt = new Date(s.startsAt)
        s.endsAt = new Date(s.endsAt)
        var min = new Date(s.startsAt)
        var max = new Date(s.endsAt)

        scope['updateStart'] = () => {
            var time = moment(s.startsAt).add(30, 'minutes').toDate()
            s['endTimes'] = this.getTimes(time, max)
            s.endsAt = this.getValue(s['endTimes'], s.endsAt)
        }
        scope['updateEnd'] = () => {
            var time = moment(s.endsAt).subtract(30, 'minutes').toDate()
            s['startTimes'] = this.getTimes(min, time)
            s.startsAt = this.getValue(s['startTimes'], s.startsAt)
        }

        scope['updateEnd']()
        scope['updateStart']()
    }
    private getTimes(min, max) {
        var intervals = []
        var d = {
            label: moment(min).format('h:mm a'),
            value: new Date(min)
        }

        while (moment(d.value).isSameOrBefore(max)) {
            intervals.push(d)
            d = {
                label: moment(d.value).add(30, 'minutes').format('h:mm a'),
                value: moment(d.value).add(30, 'minutes').toDate()
            }
        }
        return intervals
    }
    private getValue(times: {label: string, value: Date}[], date) {
        return _.find(times, (t) => {
            return moment(t.value).isSame(date)
        }).value
    }
}
