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

class WGShiftsService {

    public list: WGShift[] = []
    public onDataReload = function() {}

    constructor(public $rootScope: ng.IRootScopeService,
                public $ionicPopup: ionic.popup.IonicPopupService,
                public wgEarnigns: WGEarnigns,
                public wgEligibilities: WGEligibilitiesService) {
        Parse.Object.registerSubclass('Shift', WGShift)
    }
    public init() {}

    public load() {

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

            return Parse.Promise.as(this.list)
        })
    }
    public cancel(shift: WGShift) {
        var el = this.wgEligibilities.getCompanyEligibility(shift.company.name)
        if (!shift) return
        shift.cancel(el)
        .then((result) => this.removeFromList(shift), (error) => {})
    }
    public cancelAll(shifts: WGShift[]) {
        _.forEach(shifts, (s) => this.cancel(s))
    }

    private removeFromList(shift) {
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
    private acknowledgeShifts() {
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
        scope['earningsEstimate'] = this.wgEarnigns
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

WGShiftsService.$inject = ["$rootScope", "$ionicPopup", "wgEarnigns", "wgEligibilities"]
