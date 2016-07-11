class CurrentUserService {

    public obj: Parse.User

    // User for availability questionaire but not saved to parse
    public availabilityDays: Object[];
    public availabilityTimes: Object[];

    constructor(public wgCompanies: WGCompaniesService,
                public wgEligibilities: WGEligibilitiesService,
                public wgDevice: WGDevice,
                public getUserData: any) {}

    init() {
        this.obj = Parse.User.current()
        this.load()
    }
    create() {
        this.obj = new Parse.User();
    }
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
    set earningsGoal(earningsGoal: number) { this.obj && this.obj.set('earningsGoal', earningsGoal) }

    get locations(): WGLocation[] { return (this.obj && this.obj.get('locations')) || [] }

    get phone(): string { return this.obj && this.obj.get('phone') }
    set phone(phone: string) { this.obj && this.obj.set('phone', phone) }

    get availability(): WGAvailability { return this.obj && this.obj.get('availability') }
    set availability(availability: WGAvailability) { this.obj && this.obj.set('availability', availability) }

    get address(): Object { return this.obj && this.obj.get('address') }
    set address(address) { this.obj && this.obj.set('address', address) }

    get vehicles(): WGVehicle[] { return this.obj && this.obj.get('vehicles') }
    set vehicles(vehicles: WGVehicle[]) { this.obj && this.obj.set('vehicles', vehicles) }

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

        this.wgCompanies.load()
        this.wgEligibilities.load()
        this.wgDevice.trackDevice()

        this.getUserData()

        return Parse.User.current() && Parse.User.current()
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
            this.load()

            return Parse.Promise.as(user)

        }, (error) => Parse.Promise.error(error))
    }

    signUp(): Parse.IPromise<any> {

        // Make them lowercase so we don't have people signing up twice
        this.obj.set('email', this.email.toLowerCase());
        this.obj.set('username', this.email.toLowerCase());

        return this.obj.signUp().then((user: Parse.User) => {

            mixpanel.register({
                'Email': this.email,
                'Name': this.name,
            })

            // Not necessary but easier to deal with
            this.load()

            return Parse.Promise.as(user)

        }, (error) => Parse.Promise.error(error))
    }

    resetPassword(): Parse.Promise<any> {
        return Parse.User.requestPasswordReset(this.email.toLowerCase())
    }
}

CurrentUserService.$inject = ["wgCompanies", "wgEligibilities", "wgDevice", "getUserData"]

angular.module('wg.user', [])

.service('currentUser', CurrentUserService)