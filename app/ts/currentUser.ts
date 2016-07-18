class CurrentUserService {

    public obj: Parse.User

    // User for availability questionaire but not saved to parse
    public availabilityDays: Object[];
    public availabilityTimes: Object[];

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
        this.obj = new Parse.User();
    }

    get shouldFinishWizard() {
        return localStorage.getItem('wg.shouldFinishWizard')
    }
    startWizard()  { localStorage.setItem('wg.shouldFinishWizard', 'true') }
    finishWizard() { localStorage.removeItem('wg.shouldFinishWizard') }

    get newUserCreated() { return this.obj && !this.obj.existed()}
    get isLoggedIn() { return !!Parse.User.current()}

    get password(): string { return this.obj && this.obj.get('password') }
    set password(password: string) { this.obj && this.obj.set('password', password) }

    get firstName(): string { return (this.obj && this.obj.get('name') || "").split(" ")[0] }
    get name(): string { return this.obj && this.obj.get('name') }
    set name(name: string) { this.obj && this.obj.set('name', name) }

    get email(): string { return this.obj && this.obj.get('email') }
    set email(email: string) { this.obj && this.obj.set('email', email); this.obj && this.obj.set('username', email) }

    get hoursGoal(): number { return Math.round(this.earningsGoal / 18) }
    get earningsGoal(): number { return this.obj && this.obj.get('earningsGoal') || 140 }
    set earningsGoal(earningsGoal: number) { this.obj && this.obj.set('earningsGoal', Number(earningsGoal)) }

    get locations(): WGLocation[] { return (this.obj && this.obj.get('locations')) || [] }

    get phone(): string { return this.obj && this.obj.get('phone') }
    set phone(phone: string) { this.obj && this.obj.set('phone', phone) }

    get availability(): WGAvailability { return this.obj && this.obj.get('availability') }
    set availability(availability: WGAvailability) { this.obj && this.obj.set('availability', availability) }

    get address(): Object { return this.obj && this.obj.get('address') }
    set address(address) { this.obj && this.obj.set('address', address) }

    get vehicles(): WGVehicle[] { return this.obj && this.obj.get('vehicles') }
    set vehicles(vehicles: WGVehicle[]) { this.obj && this.obj.set('vehicles', vehicles) }

    get ssn(): string { return this.obj && this.obj.get('ssn') }
    set ssn(ssn: string) { this.obj && this.obj.set('ssn', ssn) }

    get car(): WGVehicle { return this.obj && this.obj.get('vehicles') && _.find(this.vehicles, (v) => v.type === 'car') }
    set car(car: WGVehicle) { this.obj && this.obj.set('car', car) }

    get carInfo(): any { return this.obj && this.obj.get('carInfo') }
    set carInfo(carInfo: any) { this.obj && this.obj.set('carInfo', carInfo) }

    get canLift50lbs(): boolean { return this.obj && this.obj.get('canLift50lbs') }
    set canLift50lbs(canLift50lbs: boolean) { this.obj && this.obj.set('canLift50lbs', canLift50lbs) }

    get selectedVehicles(): string[] { return _.map(this.obj.get('vehicles'), (v: WGVehicle) => v.type) }

    hasCar() {
        return true
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

        return Parse.User.current()
        .fetch()
        .then((user: Parse.User) => {
            Raven.setUserContext({
                email: this.email,
                id: this.obj.id,
                // appVersion: $rootScope.appVersion,
            });
            mixpanel.register({
                Email: this.email,
                Name: this.name,
            })

        }, (err) => {
            console.log(err);
            Parse.User.logOut();
            Raven.setUserContext();
            mixpanel.identify();
        });
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
        var name = this.name
        var email = this.email
        var password = this.password
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
        this.getUserData();
    }
}

CurrentUserService.$inject = ["wgCompanies", "wgShifts", "wgDevice", "getUserData"]

angular.module('wg.user', [])

.service('currentUser', CurrentUserService)