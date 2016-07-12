var _acknowledgeShiftsPopupIsVisible = false

class WGShift extends Parse.Object {

    constructor() {super('Shift')}

    set acknowledgedAt(value: Date)  { this.set('acknowledgedAt', value)}
    set acknowledged(value: boolean) { this.set('acknowledged', value)}
    get acknowledged() : boolean   { return this.get('acknowledged')}
    get shiftId()      : string    { return this.get('shiftId')}
    get location()     : string    { return this.get('location')}
    get company()      : WGCompany { return this.get('company')}
    get startsAt()     : Date      { return this.get('startsAt')}
    get endsAt()       : Date      { return this.get('endsAt')}
    get date()         : Date      { return this.get('startsAt')}

    cancel(el: WGEligibility): Parse.IPromise<any> {

        return Parse.Cloud.run('cancelShift', {
            startsAt:       this.startsAt.toString(),
            endsAt:         this.endsAt.toString(),
            shiftID:        this.id,      // parse id
            companyShiftId: this.shiftId, // company shift id
            company:        this.company.name,
            token :         el.token,
            workerId :      el.workerId,
        })
        .then((result) => {
            console.log('removed shift')
            Parse.Promise.as('')
        }, (error) => {
            console.log('could not cancel Shift')
            console.log(error)
            Parse.Promise.error('')
        })
    }
}

interface WGAvailableShift {

    startsAt       : any
    endsAt         : any

    company        : string
    location       : string
    flex?          : boolean // Doordash
    starting_point?: number  // Doordash
    swapId?        : number  // WIW
    shiftId?       : number  // WIW
    workerId?      : string  // WIW
}
interface WGAvailableShiftDay {
    date: Date
    shifts: WGAvailableShift[]
    showShifts: boolean
}
class WGShiftsService {

    list: WGShift[] = []
    availableArr: WGAvailableShift[]
    available: WGAvailableShiftDay[]
    onDataReload = function() {}

    constructor(public $q: angular.IQService,
                public $rootScope: ng.IRootScopeService,
                public $ionicPopup: ionic.popup.IonicPopupService,
                public wgEarnings: WGEarnings,
                public wgEligibilities: WGEligibilitiesService) {
        Parse.Object.registerSubclass('Shift', WGShift)
    }
    init() {}

    load(): Parse.IPromise<any> {
        this.getAllAvailable()
        console.log("load")
        if (!Parse.User.current()) {
            this.list = []
            return Parse.Promise.as([])
        }
        console.log("did not load")
        return this.fetchAllShifts()

        .then((shifts: WGShift[]) => {

            this.list = _.chain(shifts)
            .filter((s) => {
                // If shift was finished, don't show. Leave them for 5 hours from the current time.
                if (moment(s.endsAt).isBefore(moment().subtract(5, 'hours')) ||
                    // if shift doesn't have companies assigned
                    !s.company ||
                    // Bad data
                    !s.startsAt || !s.endsAt) {
                    return false
                }
                return true
            })
            .sortBy((s) => s.startsAt)
            .value()

            this.acknowledgeShifts()

            this.$rootScope.$apply()

            return Parse.Promise.as(this.list)

        }, (err) => {
            console.log("error loading shifts")
            console.log(err)
            return Parse.Promise.as([])
        })
    }
    getAllScheduled(): Parse.IPromise<any> {
        return Parse.Cloud.run('getAllScheduledShifts')
        .then((shifts) => {
            console.log('Successfully got all scheduled shifts')
            return this.load()
        }, (error) => {
            console.log('Could not get all scheduled shifts')
            console.log(error)
            return Parse.Promise.as([])
        })
    }
    getAllAvailable() {

        if (!Parse.User.current()) return Parse.Promise.as([])

        return Parse.Cloud.run('getAllConnectedShifts')

        .then((shifts: WGAvailableShift[]) => {

            this.availableArr = shifts
            console.log('Successfully got all connected shifts')
            this.available = this.groupPostmatesShifts(this.groupByDay(this.sortAndFormatShifts(shifts)))

        }, (error) => {
            console.log('Could not get connected shifts')
            console.log(error)
        })
    }
    cancel(shift: WGShift): void {
        var el = this.wgEligibilities.getCompanyEligibility(shift.company.name)
        if (!shift) return
        shift.cancel(el)
        .then((result) => this.removeFromList(shift), (error) => {})
    }
    cancelAll(shifts: WGShift[]): void {_.forEach(shifts, (s) => this.cancel(s))}

    hasConflict(shift: WGAvailableShift) {
        // proof: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap/325964#325964
        // (StartA < EndB) and (EndA > StartB)
        return _.find(this.list, (s) => (s.startsAt < shift.endsAt && s.endsAt > shift.startsAt))
    }

    claim(shift: WGAvailableShift): ng.IPromise<any> {

            if (!Parse.User.current()) return this.$q.when('no user logged in')
            if (this.hasConflict(shift)) return this.$q.reject({message: 'conflict'});

            var el = this.wgEligibilities.getCompanyEligibility(shift.company);

            return Parse.Cloud.run('claimShift',
            {
                // DD
                starting_point: shift.starting_point,
                vehicle_id: el.vehicle_id,
                workerId: el.workerId,

                // DD && PM
                startsAt: moment(shift.startsAt).format('YYYY-MM-DDTHH:mm:00Z'),
                endsAt: moment(shift.endsAt).format('YYYY-MM-DDTHH:mm:00Z'),

                // WIW
                // only for wiw swaps
                swapId : shift.swapId,
                // For claiming your own dropped shift in WIW. Logic should be moved server side
                ownShift: parseInt(shift.workerId) === parseInt(el.workerId),

                // Common
                shiftId : shift.shiftId,
                companyId : el.company.id,
                company : el.company.name,
                token : el.token,
                location : shift.location,
            })
            .then((s) => {
                console.log('success');
                // update shifts after claiming one
                this.load()
                return s

            }) as ng.IPromise<any> // cast parse promise ng promise to stop the compiler from throwing errors
    }
    private groupByDay(shifts: WGAvailableShift[]) {

        if (!shifts || !shifts.length) return []

        var days = []
        var day

         _.forEach(shifts, (s) => {

            if (!day || !moment(day.date).isSame(s.startsAt, 'day')) {
                day = {
                    date: s.startsAt,
                    shifts: []
                }
                days.push(day)
            }
            day.shifts.push(s)
        })
        return days
    }
    // Sorting by primary param: startsAt and secondary param: endsAt
    // http://stackoverflow.com/questions/16426774/underscore-sortby-based-on-multiple-attributes
    private sortAndFormatShifts(shifts: WGAvailableShift[]) {
        if (shifts.length <= 1) return shifts

        return _(shifts)
        .chain()
        // Get only ones that have a start and end time
        .filter((s) => s.startsAt && s.endsAt)
        // First convert to dates
        .map((s) => {
            s.location = s.location || "san francisco";
            s.startsAt = new Date(s.startsAt);
            s.endsAt = new Date(s.endsAt);
            return s;
        })
        // Get only ones that are in the future
        .filter((s) => moment(s.startsAt).isAfter())
        // Sort by endsAt
        .sortBy((shift) => shift.endsAt)
        // Then sort by starts
        .sortBy((shift) => shift.startsAt)
        // Shifts with same startsAt will be sorted by endsAt
        .value()
    }
    private groupPostmatesShifts(days) {

        _.forEach(days, (day) => {
            var shifts = day.shifts
            // get postmates only shifts
            var PMShifts = _.remove(shifts, (shift: any) => {
                return shift.company.name === 'postmates'
            })
            if (!PMShifts.length) return

            // Group contiguous shifts into one master shift

            var curr, prev, groups = []

            while (curr = PMShifts.shift()) {
                console.log("msg")
                if (prev && moment(prev.endsAt).isSame(curr.startsAt)) { // Get the first element in the array

                    prev.endsAt = curr.endsAt
                    prev.shifts.push(curr)

                } else {
                    prev = {
                        location: curr.location,
                        flex: true,
                        groupedShift: true,
                        company: {name: 'postmates'},
                        startsAt: curr.startsAt,
                        endsAt: curr.endsAt,
                        shifts: [curr]
                    }
                    groups.push(prev)
                }
            }
            Array.prototype.push.apply(shifts, groups)
            day.shifts = this.sortAndFormatShifts(shifts) // sort again after adding postmates at the end
        })
        return days
    }
    private removeFromList(shift): void {
        _.remove(this.list, (s) => s.id === shift.id)
        if (Parse.User.current()) this.$rootScope.$apply()
    }
    private fetchAllShifts(): Parse.Promise<any[]> {

        if (!Parse.User.current()) return Parse.Promise.as([])

        var query = new Parse.Query(WGShift)
        query.include("company")
        query.equalTo("worker", Parse.User.current())
        query.descending('startsAt')

        return query.find({

            success: (results) => results,
            error: (error) => {
                console.error("Could not get shifts: " + error.code + " " + error.message)
                // TODO: Handle error here
                return []
            }
        })
    }

    // If called multiple times, will only show one popup at a time.
    private acknowledgeShifts(): void {
        var newShifts = _.filter(this.list, (s) => !s.acknowledged)

        var batchSave = function(shifts) {

            _.forEach(newShifts, (s) => {
                s.acknowledged = true
                s.acknowledgedAt = new Date()
            })
            Parse.Object.saveAll(newShifts)

            .then((list: WGShift[]) => {
                console.log('success batchSave ' + list.length + ' shifts')

            }, (error) => console.log(error))
        }

        if (!newShifts.length || _acknowledgeShiftsPopupIsVisible) return

        _acknowledgeShiftsPopupIsVisible = true

        var scope = this.$rootScope.$new()

        scope['newShifts'] = newShifts
        scope['formatAMPM'] = (date) => (moment(date).format('h:mma'))
        scope['wgEarnings'] = this.wgEarnings
        scope['shiftDateFormatter'] = (date) => (moment(date).format('ddd, MMM Do'))


        this.$ionicPopup.show({
            cssClass: 'shift-popup',
            templateUrl: 'popups/acknowledge_popup.html',
            title: 'You have new shifts!',
            scope: scope,
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                text: 'Acknowledge',
                type: 'button-positive',
                onTap: function(e) {
                    _acknowledgeShiftsPopupIsVisible = false
                    batchSave(newShifts)
                }
            }]
        })
    }
}

WGShiftsService.$inject = ["$q", "$rootScope", "$ionicPopup", "wgEarnings", "wgEligibilities"]
