class CurrentUserService {

    public obj: Parse.User

    // User for availability questionaire but not saved to parse
    public availabilityDays: Object[]
    public availabilityTimes: Object[]
    public hoursTotalPastDay: number
    public hoursTotalPastMonth: number
    public hoursTotalLifetime: number
    constructor(public wgCompanies: WGCompaniesService,
                public wgShifts: WGShiftsService,
                public wgDevice: WGDevice,
                public getUserData: any) {}

    init() {
        this.load()
        this.wgDevice.trackDevice()
        this.wgShifts.load()
        this.wgShifts.getAllScheduled()
        this.wgShifts.getAllAvailable()
        this.wgCompanies.load()

    }
    create() {
        this.obj = new Parse.User()
    }

    get shouldFinishWizard() {
        return localStorage.getItem('wg.shouldFinishWizard')
    }
    startWizard()  { localStorage.setItem('wg.shouldFinishWizard', 'true') }
    finishWizard() { localStorage.removeItem('wg.shouldFinishWizard') }

    get id() { return this.obj && this.obj.id}

    get newUserCreated() { return this.obj && !this.obj.existed()}
    get isLoggedIn() { return !!Parse.User.current()}

    get password(): string { return this.obj && this.obj.get('password') }
    set password(password: string) { this.obj && this.obj.set('password', password) }

    get lodashCaseName(): string { return ((this.obj && this.obj.get('name')) || "").split(" ").join("_") }
    get firstName(): string { return ((this.obj && this.obj.get('name')) || "").split(" ")[0] }
    get name(): string { return this.obj && this.obj.get('name') }
    set name(name: string) { this.obj && this.obj.set('name', name) }

    get email(): string { return this.obj && this.obj.get('email') }
    set email(email: string) { this.obj && this.obj.set('email', email); this.obj && this.obj.set('username', email) }

    get hoursGoal(): number { return Math.round(this.earningsGoal / 18) }
    get earningsGoal(): number {
        if (this.obj && (this.obj.get('earningsGoal') !== undefined)) return this.obj.get('earningsGoal')
        return 140
    }
    set earningsGoal(earningsGoal: number) { this.obj && this.obj.set('earningsGoal', Number(earningsGoal)) }

    get earningsTotal(): any {
        if (this.obj && (this.obj.get('earningsTotal') !== undefined)) return this.obj.get('earningsTotal')
        return 140
    }
    set earningsTotal(earningsTotal: any) { this.obj && this.obj.set('earningsTotal', earningsTotal) }

    get hoursTotal(): any {
        if (this.obj && (this.obj.get('hoursTotal') !== undefined)) return this.obj.get('hoursTotal')
        return 140
    }
    set hoursTotal(hoursTotal: any) { this.obj && this.obj.set('hoursTotal', hoursTotal) }

    get locations(): WGLocation[] { return (this.obj && this.obj.get('locations')) || [] }

    get phone(): string { return this.obj && this.obj.get('phone') }
    set phone(phone: string) { this.obj && this.obj.set('phone', phone) }


    get phoneCallTime(): Date { return this.obj && this.obj.get('phoneCallTime') }
    set phoneCallTime(phoneCallTime: Date) { this.obj && this.obj.set('phoneCallTime', phoneCallTime) }

    get license(): string { return this.obj && this.obj.get('license') }
    set license(license: string) { this.obj && this.obj.set('license', license) }

    get insurance(): string { return this.obj && this.obj.get('insurance') }
    set insurance(insurance: string) { this.obj && this.obj.set('insurance', insurance) }

    get registration(): string { return this.obj && this.obj.get('registration') }
    set registration(registration: string) { this.obj && this.obj.set('registration', registration) }

    get headshot(): string { return this.obj && this.obj.get('headshot') }
    set headshot(headshot: string) { this.obj && this.obj.set('headshot', headshot) }

    get availableDays(): string[] { return (this.obj && this.obj.get('availableDays')) || [] }
    set availableDays(availableDays: string[]) { this.obj && this.obj.set('availableDays', availableDays) }

    get availableTimes(): string[] { return (this.obj && this.obj.get('availableTimes')) || [] }
    set availableTimes(availableTimes: string[]) { this.obj && this.obj.set('availableTimes', availableTimes) }

    get availability(): WGAvailability { return this.obj && this.obj.get('availability') }
    set availability(availability: WGAvailability) { this.obj && this.obj.set('availability', availability) }

    get address(): Object { return this.obj && this.obj.get('address') }
    set address(address) { this.obj && this.obj.set('address', address) }

    addVehicle(vehicle: WGVehicle) {
        console.log(this.vehicles)
        this.vehicles.push(vehicle)
        this.vehicles = angular.copy(this.vehicles)
        this.save()
    }
    deleteVehicle(index: number) {
        this.vehicles.splice(index, 1)
        this.vehicles = angular.copy(this.vehicles)
        this.save()
    }
    get vehicles(): WGVehicle[] { return (this.obj && this.obj.get('vehicles')) || [] }
    set vehicles(vehicles: WGVehicle[]) { this.obj && this.obj.set('vehicles', vehicles) }

    get ssn(): string { return this.obj && this.obj.get('ssn') }
    set ssn(ssn: string) { this.obj && this.obj.set('ssn', ssn) }

    get canLift50lbs(): boolean { return this.obj && this.obj.get('canLift50lbs') }
    set canLift50lbs(canLift50lbs: boolean) { this.obj && this.obj.set('canLift50lbs', canLift50lbs) }

    get selectedVehicles(): string[] { return _.map(this.obj.get('vehicles'), (v: WGVehicle) => (v.type || '')) }

    hasAutomobileWithMakeModel() {
        return _.find(this.vehicles, (v) => {
            return v.type &&
            (v.type.toLowerCase() === 'car' || v.type.toLowerCase() === 'truck/van') &&
            v.make &&
            v.model &&
            v.year
        })
    }
    getAnyAutomobile() {
        return _.find(this.vehicles, (v) => (v.type && (v.type.toLowerCase() === 'car' || v.type.toLowerCase() === 'truck/van')))
    }

    get notificationEnabled(): boolean { return this.obj && this.obj.get('notificationEnabled') }
    set notificationEnabled(notificationEnabled: boolean) { this.obj && this.obj.set('notificationEnabled', notificationEnabled); this.save() }

    getHours() {
        Parse.Cloud.run('getHoursWorked', {duration: 24})
        .then((hours: number) => {
            this.hoursTotalPastDay = hours
        })
        Parse.Cloud.run('getHoursWorked', {duration: 24 * 30})
        .then((hours: number) => {
            this.hoursTotalPastMonth = hours
        })
        Parse.Cloud.run('getHoursWorked', {})
        .then((hours: number) => {
            this.hoursTotalLifetime = hours
        })
    }

    save(params?: Object) {

        // Testing env may not have current user
        if (Parse.User.current()) {

            return Parse.User.current()
                .save(params)

                .then(() => {
                    console.log("saved")

                }, (err) => {
                    console.log("error")
                    console.log(err)
                })
        }
        else
            return Parse.Promise.as(this.obj)
    }

    load() {
        this.obj = Parse.User.current()
        if (!this.obj) return
        this.getUserData() // Legacy
        this.getHours()
        return Parse.User.current()
        .fetch()
        .then((user: Parse.User) => {
            Raven.setUserContext({
                email: this.email,
                id: this.obj.id,
                // appVersion: $rootScope.appVersion,
            })
            mixpanel.register({
                Email: this.email,
                Name: this.name,
            })

        }, (err) => {
            console.log(err)
            // Parse.User.logOut()
            Raven.setUserContext()
            mixpanel.identify()
        })
    }
    logIn(): Parse.IPromise<any> {
        return Parse.User.logIn(this.email, this.password).then((user: Parse.User) => {

            this.obj = Parse.User.current()
            // Get all additional data on login
            this.init()

            return Parse.Promise.as(user)

        }, (error) => Parse.Promise.error(error))
    }

    signUp(): Parse.IPromise<any> {

        // Make them lowercase so we don't have people signing up twice

        console.log(this.obj.get('username'))
        console.log(this.email)

        return this.obj.signUp({
            username: this.obj.get('username'),
            password: this.password,
            email   : this.email

        }).then((user: Parse.User) => {

            mixpanel.register({
                'Email': this.email,
                'Name': this.name,
            })

            // Not necessary but easier to deal with
            this.init()

            return Parse.Promise.as(user)

        }, (error) => {
            this.resetUser()
            return Parse.Promise.error(error)
        })
    }

    // Bug workaround. Parse caches requests
    // If username is taken, User will get same error after changing username
    private resetUser() {
        const name = this.name
        const email = this.email
        const password = this.password
        Parse.User.logOut()
        this.obj = new Parse.User
        this.name = name
        this.email = email
        this.password = password
    }

    resetPassword(): Parse.Promise<any> {
        return Parse.User.requestPasswordReset(this.email.toLowerCase())
    }

    logOut() {
        Parse.User.logOut()
        this.obj = undefined
        this.getUserData()
    }
}

CurrentUserService.$inject = ["wgCompanies", "wgShifts", "wgDevice", "getUserData"]

angular.module('wg.user', [])

.service('currentUser', CurrentUserService)